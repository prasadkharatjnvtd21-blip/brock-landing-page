CREATE TABLE `properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image` text NOT NULL,
	`price` text NOT NULL,
	`price_value` integer NOT NULL,
	`title` text NOT NULL,
	`location` text NOT NULL,
	`beds` integer NOT NULL,
	`baths` integer NOT NULL,
	`sqft` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
