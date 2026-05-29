CREATE TABLE `assessments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`candidate_id` integer NOT NULL,
	`criteria_id` integer NOT NULL,
	`value` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`criteria_id`) REFERENCES `criteria`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `assessments_candidate_id_criteria_id_unique` ON `assessments` (`candidate_id`,`criteria_id`);--> statement-breakpoint
CREATE TABLE `candidates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`position` text NOT NULL,
	`department` text NOT NULL,
	`employee_id` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `candidates_employee_id_unique` ON `candidates` (`employee_id`);--> statement-breakpoint
CREATE TABLE `criteria` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`weight` real NOT NULL,
	`type` text DEFAULT 'benefit' NOT NULL,
	`description` text DEFAULT ''
);
