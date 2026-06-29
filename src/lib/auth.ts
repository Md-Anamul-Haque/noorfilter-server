import { db } from "@/db"; // your drizzle instance
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { admin, twoFactor } from "better-auth/plugins";
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        usePlural: true,
    }),
    emailAndPassword: {
        enabled: true,
    },

    plugins: [
        twoFactor(),
        admin()
    ],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    // client থেকে আসা কোনও role/isAdmin/permissions থাকলে বাদ দেয়
                    // const { role, isAdmin, permissions, ...rest } = user;

                    return {
                        data: {
                            ...user,
                            role: "user", // server-side enforced default
                        },
                    };
                }
            },
        },
    },

});

// user type 
export type User = typeof auth.$Infer.Session.user;