// relations.ts
import { defineRelations } from "drizzle-orm"
import * as schema from "./schema"

export const relations = defineRelations(schema, (r) => ({
    users: {
        sessions: r.many.sessions({
            from: r.users.id,
            to: r.sessions.userId,
            alias: "sessions",
        }),
        accounts: r.many.accounts({
            from: r.users.id,
            to: r.accounts.userId,
            alias: "accounts",
        }),
        twoFactors: r.many.twoFactors({
            from: r.users.id,
            to: r.twoFactors.userId,
            alias: "twoFactors",
        }),
        subscription: r.one.subscriptions({
            from: r.users.id,
            to: r.subscriptions.userId,
            alias: "subscription",
        }),
        freeAccessRequests: r.many.freeAccessRequests({
            from: r.users.id,
            to: r.freeAccessRequests.userId,
            alias: "freeAccessRequests",
        }),
    },
    sessions: {
        user: r.one.users({
            from: r.sessions.userId,
            to: r.users.id,
            alias: "user",
        }),
    },
    accounts: {
        user: r.one.users({
            from: r.accounts.userId,
            to: r.users.id,
            alias: "user",
        }),
    },
    twoFactors: {
        user: r.one.users({
            from: r.twoFactors.userId,
            to: r.users.id,
            alias: "user",
        }),
    },
    subscriptions: {
        user: r.one.users({
            from: r.subscriptions.userId,
            to: r.users.id,
            alias: "user",
        }),
    },
    freeAccessRequests: {
        user: r.one.users({
            from: r.freeAccessRequests.userId,
            to: r.users.id,
            alias: "user",
        }),
    },
}))