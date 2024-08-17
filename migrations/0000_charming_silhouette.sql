CREATE TABLE IF NOT EXISTS `boostModeDurations` (
	`id` integer PRIMARY KEY NOT NULL,
	`duration` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`devId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ecogazSignals` (
	`id` integer PRIMARY KEY NOT NULL,
	`timestamp` integer NOT NULL,
	`color` text NOT NULL,
	`couleur_du_signal_fr` text NOT NULL,
	`indice_de_couleur` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `ecowattSignals` (
	`id` integer PRIMARY KEY NOT NULL,
	`timestamp` integer NOT NULL,
	`dvalue` integer NOT NULL,
	`values` text NOT NULL
);
