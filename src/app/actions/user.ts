"use server";

import { db } from "@/db";
import { subscriptions, freeAccessRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { withAuthCurry } from "@/lib/auth-server";
import { User } from "@/lib/auth";

export const getUserSubscription = withAuthCurry(async (user: User) => {
  const userSubs = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .limit(1);

  if (userSubs.length === 0) {
    return null;
  }

  return userSubs[0];
});

export const submitFreeAccessRequest = withAuthCurry(
  async (user: User, reason: string) => {
    if (!reason || reason.trim() === "") {
      return { success: false, error: "Reason is required" };
    }

    // Calculate 1 month from now
    const grantedUntil = new Date();
    grantedUntil.setMonth(grantedUntil.getMonth() + 1);

    try {
      // Save the request
      await db.insert(freeAccessRequests).values({
        userId: user.id,
        reason: reason,
        status: "approved",
        grantedUntil: grantedUntil,
      });

      // Update the user's subscription
      const userSubs = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, user.id))
        .limit(1);

      if (userSubs.length > 0) {
        await db
          .update(subscriptions)
          .set({
            trialExpiresAt: grantedUntil,
            status: "active", // trial extended
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.userId, user.id));
      } else {
        // Create subscription if not exists
        await db.insert(subscriptions).values({
          userId: user.id,
          plan: "free",
          status: "active",
          trialExpiresAt: grantedUntil,
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to submit free access request:", error);
      return { success: false, error: "Database error" };
    }
  }
);

export const startFreeTrial = withAuthCurry(async (user: User) => {
  try {
    const userSubs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .limit(1);

    if (userSubs.length > 0) {
      return { success: false, error: "Trial has already been claimed or subscription exists." };
    }

    const trialExpiresAt = new Date();
    trialExpiresAt.setDate(trialExpiresAt.getDate() + 3);

    await db.insert(subscriptions).values({
      userId: user.id,
      plan: "free",
      status: "trialing",
      trialExpiresAt: trialExpiresAt,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to start free trial:", error);
    return { success: false, error: "Database error" };
  }
});
