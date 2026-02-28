UPDATE "events" SET "open_time" = '19:00' WHERE "open_time" IS NULL;--> statement-breakpoint
UPDATE "events" SET "start_time" = '20:00' WHERE "start_time" IS NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "open_time" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "start_time" SET NOT NULL;