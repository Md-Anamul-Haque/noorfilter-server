// relations.ts
import { defineRelations } from "drizzle-orm"
import * as schema from "./schema"

export const relations = defineRelations(schema, (r) => ({
    usersTable:{
        sessions: r.many.sessionsTable({
            from: r.usersTable.id,
            to: r.sessionsTable.userId,
            alias: "sessions",
        }),
        accounts: r.many.accountsTable({
            from: r.usersTable.id,
            to: r.accountsTable.userId,
            alias: "accounts",
        }),
        twoFactors: r.many.twoFactorsTable({
            from: r.usersTable.id,
            to: r.twoFactorsTable.userId,
            alias: "twoFactors",
        }),
    },
    sessionsTable: {
        user: r.one.usersTable({
            from: r.sessionsTable.userId,
            to: r.usersTable.id,
            alias: "user",
        }),
    },
    accountsTable: {
        user: r.one.usersTable({
            from: r.accountsTable.userId,
            to: r.usersTable.id,
            alias: "user",
        }),
    },
    twoFactorsTable: {
        user: r.one.usersTable({
            from: r.twoFactorsTable.userId,
            to: r.usersTable.id,
            alias: "user",
        }),
    },
}))