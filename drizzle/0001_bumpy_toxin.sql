CREATE TABLE IF NOT EXISTS `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`display_name` text DEFAULT '' NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`last_login_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `admin_users_username_unique` ON `admin_users` (`username`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_admin_users_active_username` ON `admin_users` (`active`,`username`);