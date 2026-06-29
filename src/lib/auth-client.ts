
import { adminClient, inferAdditionalFields, twoFactorClient } from "better-auth/client/plugins";
import { nextCookies, } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth"; // Import your server auth instance

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [
        nextCookies(),
        inferAdditionalFields<typeof auth>(), // This enables the types on the client
        twoFactorClient(),
        adminClient()
    ]
})