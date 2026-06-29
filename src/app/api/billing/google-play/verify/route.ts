import { NextResponse } from "next/server";
import { google } from "googleapis";
import { db } from "@/db";
import { transactions, subscriptions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";
import { verifyAccessToken } from "@/lib/jwt";
import { headers } from "next/headers";
import { corsHeaders } from "@/lib/corsHeaders";

// CORS Preflight request এর জন্য OPTIONS মেথড
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Initialize the Google Play Developer API client
const playDeveloperApi = google.androidpublisher("v3");
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ["https://www.googleapis.com/auth/androidpublisher"],
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const zschemaOfBody = z.object({
      purchaseToken: z.string(),
      productId: z.string(),
      packageName: z.string(),
    });

    const headersList = await headers();
    const bearerToken = headersList.get('Authorization');
    const token = bearerToken?.split(' ')[1] || null;

    if (!token) {
      return NextResponse.json({
        is_valid: false,
        valid_until: 0,
        error: "Membership expired or invalid token",
      }, { status: 401, headers: corsHeaders });
    }

    const { userId } = await verifyAccessToken(token);

    const { data: parsedBody, success, error } = zschemaOfBody.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Invalid request body", error },
        { status: 400, headers: corsHeaders }
      );
    }
    const { purchaseToken, productId, packageName } = parsedBody;

    // 1. Check if this token was already processed (Corrected Drizzle Syntax)
    const existingTransaction = await db.query.transactions.findFirst({
      where: { transactionId: purchaseToken },
    });

    if (existingTransaction) {
      return NextResponse.json(
        { success: true, message: "Purchase already verified" },
        { headers: corsHeaders }
      );
    }

    // 2. Verify the purchase with Google Play Developer API
    let purchaseInfo;
    try {
      google.options({ auth });

      const res = await playDeveloperApi.purchases.subscriptions.get({
        packageName: packageName,
        subscriptionId: productId,
        token: purchaseToken,
      });
      purchaseInfo = res.data;
    } catch (apiError: any) {
      console.error("Google Play API Error:", apiError.message);
      return NextResponse.json(
        { success: false, message: "Failed to verify token with Google" },
        { status: 400, headers: corsHeaders }
      );
    }

    // For subscriptions, paymentState: 1 = Payment received, 2 = Free trial
    if (purchaseInfo.paymentState !== 1 && purchaseInfo.paymentState !== 2) {
      return NextResponse.json(
        { success: false, message: "Payment not completed or invalid state" },
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Save the transaction record
    await db.insert(transactions).values({
      userId,
      paymentMethod: "google_play",
      transactionId: purchaseToken,
      status: "success",
      metadata: JSON.stringify({
        productId,
        orderId: purchaseInfo.orderId || null,
        purchaseState: purchaseInfo.paymentState || 0,
      }),
    });

    // 4. Update the user's subscription
    const expiryTimeMillis = purchaseInfo.expiryTimeMillis;
    let newExpiryDate = new Date();

    if (expiryTimeMillis) {
      newExpiryDate = new Date(parseInt(expiryTimeMillis, 10));
    } else {
      // Fallback যদি কোনো কারণে Google date না দেয়
      let addDays = 180; // 6 months default
      if (productId.includes("1_month")) addDays = 30;
      newExpiryDate.setDate(newExpiryDate.getDate() + addDays);
    }

    // Corrected Drizzle Syntax
    const currentSub = await db.query.subscriptions.findFirst({
      where: { userId },
    });

    const now = new Date();
    const baseDate = (currentSub?.currentPeriodEnd && currentSub.currentPeriodEnd > now)
      ? new Date(currentSub.currentPeriodEnd)
      : now;

    if (currentSub) {
      await db.update(subscriptions)
        .set({
          plan: "premium",
          status: "active",
          currentPeriodEnd: newExpiryDate,
        })
        .where(eq(subscriptions.userId, userId));
    } else {
      await db.insert(subscriptions).values({
        userId,
        plan: "premium",
        status: "active",
        currentPeriodEnd: newExpiryDate,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
      validUntil: baseDate
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}