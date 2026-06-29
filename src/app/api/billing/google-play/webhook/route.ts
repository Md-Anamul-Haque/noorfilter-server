import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscriptions, transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { google } from "googleapis";

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

        // Google Pub/Sub sends data in a base64 encoded 'data' field inside 'message'
        if (!body.message || !body.message.data) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const decodedData = Buffer.from(body.message.data, 'base64').toString('utf-8');
        const notification = JSON.parse(decodedData);

        // We only care about subscription notifications
        if (!notification.subscriptionNotification) {
            return NextResponse.json({ success: true, message: "Not a subscription notification" });
        }

        const { notificationType, purchaseToken, subscriptionId } = notification.subscriptionNotification;
        const packageName = notification.packageName;

        // Fetch the latest subscription state from Google Play
        google.options({ auth });
        const res = await playDeveloperApi.purchases.subscriptions.get({
            packageName: packageName,
            subscriptionId: subscriptionId,
            token: purchaseToken,
        });

        const purchaseInfo = res.data;

        // Find the user associated with this purchase token in our database
        const existingTransaction = await db.query.transactions.findFirst({
            where: { transactionId: purchaseToken },
        });

        if (!existingTransaction) {
            console.log("No transaction found for token:", purchaseToken);
            return NextResponse.json({ success: true, message: "Transaction not found, skipping" });
        }

        const userId = existingTransaction.userId;
        const newExpiryDate = new Date(parseInt(purchaseInfo.expiryTimeMillis || "0", 10));

        // notificationType codes:
        // 2 = RENEWED, 3 = CANCELED, 12 = REVOKED, 13 = EXPIRED

        if (notificationType === 2) { // RENEWED (অটো-রিনিউ হয়েছে)
            await db.update(subscriptions)
                .set({ status: "active", currentPeriodEnd: newExpiryDate })
                .where(eq(subscriptions.userId, userId));
        }
        else if (notificationType === 3 || notificationType === 13) { // CANCELED or EXPIRED (ক্যানসেল করেছে বা মেয়াদ শেষ)
            const status = newExpiryDate > new Date() ? "active" : "expired";
            await db.update(subscriptions)
                .set({ status: status, currentPeriodEnd: newExpiryDate })
                .where(eq(subscriptions.userId, userId));
        }
        else if (notificationType === 12) { // REVOKED (Google রিফান্ড দিয়েছে)
            await db.update(subscriptions)
                .set({ status: "canceled", currentPeriodEnd: new Date() }) // সাথে সাথে মেয়াদ শেষ
                .where(eq(subscriptions.userId, userId));
        }

        // Always return 200 OK so Google doesn't retry
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}