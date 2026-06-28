"use server";

import { signAccessToken } from "@/lib/jwt";

export async function createJWTToken(): Promise<string> {
    // এখানে আপনার JWT টোকেন তৈরি করার লজিক থাকবে
    const userId = "user123"; // উদাহরণস্বরূপ, এটি ডাটাবেস থেকে আসা ইউজারের আইডি হতে পারে
    const now = new Date();
    const expirationDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 দিন পরে
    const token =await signAccessToken({
        userId,
        expiresAt: expirationDate.toString()
    },'20m')
    return token
}