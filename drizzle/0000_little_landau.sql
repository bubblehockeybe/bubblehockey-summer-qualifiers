CREATE TABLE `confirmation_emails` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trainingDate` varchar(10) NOT NULL,
	`emailSentAt` timestamp NOT NULL DEFAULT (now()),
	`recipientCount` int NOT NULL,
	CONSTRAINT `confirmation_emails_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `training_signups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`trainingDate` varchar(10) NOT NULL,
	`acceptsContact` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `training_signups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
