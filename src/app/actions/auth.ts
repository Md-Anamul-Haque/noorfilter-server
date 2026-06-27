"use server";

import { signAccessToken } from "@/lib/jwt";

export async function createJWTToken(): Promise<string> {
    // এখানে আপনার JWT টোকেন তৈরি করার লজিক থাকবে
    const userId = "user123"; // উদাহরণস্বরূপ, এটি ডাটাবেস থেকে আসা ইউজারের আইডি হতে পারে
    const token =await signAccessToken({
        userId
    },'20d')
    return token
}