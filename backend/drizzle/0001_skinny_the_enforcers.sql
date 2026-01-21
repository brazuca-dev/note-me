PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_note` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`is_pinned` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_note`("id", "owner", "title", "content", "is_pinned", "status", "createdAt", "updatedAt") SELECT "id", "owner", "title", "content", "is_pinned", "status", "createdAt", "updatedAt" FROM `note`;--> statement-breakpoint
DROP TABLE `note`;--> statement-breakpoint
ALTER TABLE `__new_note` RENAME TO `note`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_note_tag` (
	`note_id` text NOT NULL,
	`tag_id` text NOT NULL,
	`owner` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	PRIMARY KEY(`note_id`, `tag_id`),
	FOREIGN KEY (`note_id`) REFERENCES `note`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_note_tag`("note_id", "tag_id", "owner", "createdAt", "updatedAt") SELECT "note_id", "tag_id", "owner", "createdAt", "updatedAt" FROM `note_tag`;--> statement-breakpoint
DROP TABLE `note_tag`;--> statement-breakpoint
ALTER TABLE `__new_note_tag` RENAME TO `note_tag`;--> statement-breakpoint
CREATE TABLE `__new_tag` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_tag`("id", "owner", "title", "status", "createdAt", "updatedAt") SELECT "id", "owner", "title", "status", "createdAt", "updatedAt" FROM `tag`;--> statement-breakpoint
DROP TABLE `tag`;--> statement-breakpoint
ALTER TABLE `__new_tag` RENAME TO `tag`;