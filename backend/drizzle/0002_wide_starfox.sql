ALTER TABLE `note` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `note` RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE `note_tag` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `note_tag` RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE `tag` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `tag` RENAME COLUMN "updatedAt" TO "updated_at";