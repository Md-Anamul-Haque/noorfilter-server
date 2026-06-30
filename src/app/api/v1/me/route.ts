import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyAccessToken, signAccessToken } from "@/lib/jwt";
import { corsHeaders } from "@/lib/corsHeaders";

// ─── Types ───────────────────────────────────────────────────────────────────

type SubscriptionInfo = {
  currentPackage: string;
  trialStatus: string;
  scheduledPackages: string;
  nextPackage: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a human-readable subscription block from a DB subscription row.
 * Returns null if no subscription record exists.
 */
function buildSubscriptionInfo(
  sub: typeof subscriptions.$inferSelect | null,
  now: Date
): SubscriptionInfo {
  if (!sub) {
    return {
      currentPackage: "No Active Package",
      trialStatus: "Eligible for Free Trial",
      scheduledPackages: "None",
      nextPackage: "None",
    };
  }

  const isPremium = sub.plan === "premium";
  const isActive = sub.status === "active";
  const isTrialing = sub.status === "trialing";

  // Determine current package label
  let currentPackage = "No Active Package";
  if (isPremium && isActive && sub.currentPeriodEnd && sub.currentPeriodEnd > now) {
    currentPackage = "Premium";
  } else if (!isPremium && isActive) {
    currentPackage = "Basic (Free)";
  } else if (isTrialing) {
    currentPackage = "Free Trial";
  }

  // Trial status
  let trialStatus = "Not Eligible";
  if (isTrialing && sub.trialExpiresAt) {
    const daysLeft = Math.ceil(
      (sub.trialExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysLeft > 0) {
      trialStatus = `Trial Active – ${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
    } else {
      trialStatus = "Trial Expired";
    }
  } else if (!isPremium && sub.status !== "trialing") {
    trialStatus = "Eligible for Free Trial";
  }

  // Expiry / next package note
  let scheduledPackages = "None";
  let nextPackage = "None";

  if (isPremium && sub.currentPeriodEnd) {
    const exp = sub.currentPeriodEnd;
    if (exp > now) {
      scheduledPackages = `Premium until ${exp.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`;
    } else {
      currentPackage = "Expired (Premium)";
      nextPackage = "Upgrade Required";
    }
  }

  return { currentPackage, trialStatus, scheduledPackages, nextPackage };
}

/**
 * Decide whether to issue a fresh token and return it.
 * Returns the new token string if rotation is needed, otherwise null.
 */
async function maybeRotateToken(
  token: string,
  userId: string,
  sub: typeof subscriptions.$inferSelect | null,
  now: Date
): Promise<string | null> {
  try {
    const parsed = await verifyAccessToken(token);
    const genDate = parsed.generatedAt ? new Date(parsed.generatedAt) : new Date(0);
    const exDate = new Date(parsed.expiresAt);

    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const tokenAge = now.getTime() - genDate.getTime();
    const isShortLived = exDate.getTime() - genDate.getTime() <= 24 * 60 * 60 * 1000;

    // Only rotate if old/short-lived
    if (tokenAge <= thirtyDaysInMs && !isShortLived) return null;

    // Determine valid user expiry from subscription
    let userExpiry: Date | null = null;
    if (sub) {
      if (sub.plan === "premium" && sub.currentPeriodEnd && sub.currentPeriodEnd > now) {
        userExpiry = sub.currentPeriodEnd;
      } else if (sub.trialExpiresAt && sub.trialExpiresAt > now) {
        userExpiry = sub.trialExpiresAt;
      }
    }

    if (!userExpiry) return null; // subscription expired – no new token

    // Cap at 3 months
    const threeMonths = new Date(now);
    threeMonths.setMonth(threeMonths.getMonth() + 3);
    const tokenExpiry = userExpiry > threeMonths ? threeMonths : userExpiry;

    return await signAccessToken(
      { userId, expiresAt: tokenExpiry.toISOString(), generatedAt: now.toISOString() },
      tokenExpiry
    );
  } catch {
    // If verification fails, don't crash the /me response
    return null;
  }
}

// ─── CORS Preflight ───────────────────────────────────────────────────────────

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const headersList = await headers();

    // Support both Bearer token AND Cookie (PersistentCookieJar from Android)
    const bearerToken = headersList.get("Authorization");
    const token = bearerToken?.startsWith("Bearer ")
      ? bearerToken.slice(7)
      : null;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Verify JWT
    let userId: string;
    try {
      const parsed = await verifyAccessToken(token);
      userId = parsed.userId;

      // Reject expired tokens
      if (new Date(parsed.expiresAt) < new Date()) {
        return NextResponse.json(
          { error: "Token expired" },
          { status: 401, headers: corsHeaders }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid or malformed token" },
        { status: 401, headers: corsHeaders }
      );
    }

    const now = new Date();

    // Fetch user row
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userRows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const user = userRows[0];

    // Fetch subscription
    const subRows = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    const sub = subRows.length > 0 ? subRows[0] : null;

    // Build response
    const subscriptionInfo = buildSubscriptionInfo(sub, now);
    const newToken = await maybeRotateToken(token, userId, sub, now);

    const responseBody: Record<string, unknown> = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.image ?? null,
      },
      subscription: subscriptionInfo,
    };

    // Only include token field if rotation happened
    if (newToken) {
      responseBody.token = newToken;
    }

    return NextResponse.json(responseBody, { status: 200, headers: corsHeaders });
  } catch (error: unknown) {
    console.error("[GET /api/v1/me] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
