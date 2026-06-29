CREATE TABLE "free_access_requests" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"reason" text NOT NULL,
	"status" text DEFAULT 'approved' NOT NULL,
	"granted_until" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"status" text DEFAULT 'trialing' NOT NULL,
	"trial_expires_at" timestamp,
	"current_period_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "freeAccessRequests_userId_idx" ON "free_access_requests" ("user_id");--> statement-breakpoint
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions" ("user_id");--> statement-breakpoint
ALTER TABLE "free_access_requests" ADD CONSTRAINT "free_access_requests_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;