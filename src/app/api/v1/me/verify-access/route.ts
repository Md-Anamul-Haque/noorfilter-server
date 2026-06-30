import { NextResponse } from "next/server";
import { headers } from 'next/headers'
import { signAccessToken, verifyAccessToken } from "@/lib/jwt";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { corsHeaders } from "@/lib/corsHeaders";

type ResData = {
  is_valid: boolean;
  // Android expects milliseconds (Unix ms timestamp)
  valid_until: number;
  error?: string;
  token?: string
}

// CORS Preflight handler
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const headersList = await headers()
    const bearerToken = headersList.get('Authorization')
    const token = bearerToken?.split(' ')[1] || null;

    if (!token) {
      return NextResponse.json({
        is_valid: false,
        valid_until: 0,
        error: "Membership expired or invalid token",
      }, { status: 401, headers: corsHeaders });
    }

    const parsedToken = await verifyAccessToken(token)
    const { userId, expiresAt, generatedAt } = parsedToken;
    const now = new Date()
    const exDate = new Date(expiresAt)
    const genDate = generatedAt ? new Date(generatedAt) : new Date(0);

    // If the token is mathematically expired (the max 3-month has passed, or the user's expiry has passed)
    if (exDate < now) {
      return NextResponse.json({
        is_valid: false,
        valid_until: 0,
        error: "Membership expired",
      }, { status: 401, headers: corsHeaders });
    }

    // Check if token was generated more than 30 days ago OR if it's a short-lived token (e.g. 10m token from web)
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const tokenAge = now.getTime() - genDate.getTime();
    const isShortLivedToken = exDate.getTime() - genDate.getTime() <= 24 * 60 * 60 * 1000; // <= 1 day

    if (tokenAge > thirtyDaysInMs || isShortLivedToken) {
      // Regenerate token by fetching latest expiry from DB
      const userSubs = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1);

      let userExpiry = new Date(0);
      if (userSubs.length > 0) {
        const sub = userSubs[0];
        if (sub.plan === 'premium' && sub.currentPeriodEnd) {
          userExpiry = new Date(sub.currentPeriodEnd);
        } else if (sub.trialExpiresAt) {
          userExpiry = new Date(sub.trialExpiresAt);
        }
      }

      if (userExpiry < now) {
        return NextResponse.json({
          is_valid: false,
          valid_until: 0,
          error: "Membership expired",
        }, { status: 401, headers: corsHeaders });
      }

      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

      let tokenExpiry = userExpiry;
      if (userExpiry > threeMonthsFromNow) {
        tokenExpiry = threeMonthsFromNow;
      }

      const new_token = await signAccessToken({
        userId,
        expiresAt: tokenExpiry.toISOString(),
        generatedAt: now.toISOString()
      }, tokenExpiry)

      // Android expects milliseconds
      const validUntil = tokenExpiry.getTime();
      return NextResponse.json({
        is_valid: true,
        valid_until: validUntil,
        token: new_token
      }, { status: 200, headers: corsHeaders });

    } else {
      // Token is valid and less than 30 days old. Return success.
      // Android expects milliseconds
      const validUntil = exDate.getTime();
      return NextResponse.json({
        is_valid: true,
        valid_until: validUntil,
        token: token
      }, { status: 200, headers: corsHeaders });
    }

  } catch (error) {
    console.error("Error verifying access:", error);
    return NextResponse.json({
      is_valid: false,
      valid_until: 0,
      error: "Internal server error or invalid token signature",
    }, { status: 401, headers: corsHeaders });
  }
}