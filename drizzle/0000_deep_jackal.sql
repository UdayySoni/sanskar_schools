CREATE TABLE IF NOT EXISTS `admin_config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`details` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_audit_log_created_at` ON `audit_log` (`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `content` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`student_name` text NOT NULL,
	`parent_name` text DEFAULT '' NOT NULL,
	`phone` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`grade` text NOT NULL,
	`wing` text NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'website' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`email_status` text DEFAULT 'pending' NOT NULL,
	`ip_hash` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_leads_created_at` ON `leads` (`created_at`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_leads_status_created_at` ON `leads` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_leads_ip_hash_created_at` ON `leads` (`ip_hash`,`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `login_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`ip_hash` text NOT NULL,
	`successful` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_login_attempts_ip_created_at` ON `login_attempts` (`ip_hash`,`created_at`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `media` (
	`id` text PRIMARY KEY NOT NULL,
	`object_key` text NOT NULL,
	`file_name` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`alt_text` text DEFAULT '' NOT NULL,
	`category` text DEFAULT 'Campus' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `media_object_key_unique` ON `media` (`object_key`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_media_created_at` ON `media` (`created_at`);