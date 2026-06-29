"use server";

import { signAccessToken } from "@/lib/jwt";
import { withAuthCurry } from "@/lib/auth-server";
import { User } from "@/lib/auth";

export const createAppLaunchToken = withAuthCurry(async (user: User): Promise<string> => {
    const now = new Date();
    const tokenExpiry = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now

    const token = await signAccessToken({
        userId: user.id,
        expiresAt: tokenExpiry.toISOString(),
        generatedAt: now.toISOString()
    }, '10m');

    return token;
});
