import { NextResponse } from "next/server";
import { google } from "googleapis";
import { db } from "@/db";
import { transactions, subscriptions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

// Initialize the Google Play Developer API client
// Note: You must provide these credentials in your .env file
const playDeveloperApi = google.androidpublisher("v3");
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    // Fix private key newlines if they are escaped in env vars
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
      userId: z.string(),
      packageName: z.string(),
    });
    const { data: parsedBody, success, error } = zschemaOfBody.safeParse(body);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Invalid request body", error },
        { status: 400 }
      );
    }
    const { purchaseToken, productId, userId, packageName } = parsedBody;

    // 1. Check if this token was already processed to prevent duplicate processing
    const existingTransaction = await db.query.transactions.findFirst({
      where: { transactionId: purchaseToken },
    });

    if (existingTransaction) {
      return NextResponse.json(
        { success: true, message: "Purchase already verified" }
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
        { status: 400 }
      );
    }

    // purchaseState: 0 = Purchased, 1 = Canceled, 2 = Pending
    // For subscriptions, paymentState: 1 = Payment received
    if (purchaseInfo.paymentState !== 1 && purchaseInfo.paymentState !== 2) {
      return NextResponse.json(
        { success: false, message: "Payment not completed or invalid state" },
        { status: 400 }
      );
    }

    // 3. Save the transaction record in our unified database
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
    // Assuming 'premium_1_month' or 'premium_1_year' are your product IDs
    let addDays = 30; // Default to 30 days
    if (productId.includes("year")) {
      addDays = 365;
    } else if (productId.includes("6month")) {
      addDays = 180;
    }

    const currentSub = await db.query.subscriptions.findFirst({
      where: { userId: userId },
    });

    const now = new Date();
    // If they already have an active sub, extend it. Otherwise, start from today.
    const baseDate = (currentSub?.currentPeriodEnd && currentSub.currentPeriodEnd > now)
      ? new Date(currentSub.currentPeriodEnd)
      : now;

    baseDate.setDate(baseDate.getDate() + addDays);

    if (currentSub) {
      await db.update(subscriptions)
        .set({
          plan: "premium",
          status: "active",
          currentPeriodEnd: baseDate,
        })
        .where(eq(subscriptions.userId, userId));
    } else {
      await db.insert(subscriptions).values({
        userId,
        plan: "premium",
        status: "active",
        currentPeriodEnd: baseDate,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
      validUntil: baseDate
    });

  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
