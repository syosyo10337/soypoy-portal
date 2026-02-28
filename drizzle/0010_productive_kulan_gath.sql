ALTER TABLE "events" ADD COLUMN "open_time" varchar(5);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "start_time" varchar(5);--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "pricing" jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "venue" jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "performers" jsonb;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "hashtags" text[];