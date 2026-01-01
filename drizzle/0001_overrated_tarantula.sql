PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_note_tag` (
	`gid` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`note` integer NOT NULL,
	`tag` integer NOT NULL,
	`owner` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_note_tag`("gid", "note", "tag", "owner", "createdAt", "updatedAt") SELECT "gid", "note", "tag", "owner", "createdAt", "updatedAt" FROM `note_tag`;--> statement-breakpoint
DROP TABLE `note_tag`;--> statement-breakpoint
ALTER TABLE `__new_note_tag` RENAME TO `note_tag`;--> statement-breakpoint
PRAGMA foreign_keys=ON;