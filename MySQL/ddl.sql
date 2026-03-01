CREATE DATABASE pulse_core_system;

USE pulse_core_system;

-- user_email	user_full_name	user_phone	user_city	user_status	blood_type	donor_level	last_donation_date	preferred_channel

CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_full_name VARCHAR(200) NOT NULL,
	user_email VARCHAR(120) NOT NULL UNIQUE,
	password VARCHAR(100) NOT NULL,
	role ENUM ('USER', 'ADMIN', 'AGENT') DEFAULT 'USER' NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL);

CREATE TABLE donors(
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	user_phone VARCHAR(10) NOT NULL UNIQUE,
	user_city ENUM ('BELLO', 'BOGOTA', 'ENVIGADO', 'ITAGUI', 'MEDELLIN', 'SABANETA') NOT NULL,
	user_status ENUM ('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE' NOT NULL,
	blood_type	ENUM ('A+', 'A-', 'O+', 'O-', 'AB+', 'AB-', 'B+', 'B-') NOT NULL, 
	donor_level	ENUM ('BRONZE', 'SILVER', 'GOLD') NOT NULL, 
	last_donation_date DATETIME,
	preferred_channel ENUM ('EMAIL', 'WHATSAPP', 'SMS') NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	
	FOREIGN KEY (user_id)
	REFERENCES users(id));

-- campaign_name	campaign_city	campaign_start_date	campaign_end_date

CREATE TABLE campaigns(
	id INT AUTO_INCREMENT PRIMARY KEY,
	campaign_name VARCHAR(100) NOT NULL,
	campaign_city ENUM ('BELLO', 'BOGOTA', 'ENVIGADO', 'ITAGUI', 'MEDELLIN', 'SABANETA') NOT NULL,
	campaign_start_date DATETIME,
	campaign_end_date DATETIME,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- appointment_scheduled_at	appointment_status	appointment_location

CREATE TABLE appointments(
	id INT AUTO_INCREMENT PRIMARY KEY,
	donor_id INT NOT NULL,
	campaign_id INT NOT NULL,
	appointment_scheduled_at DATETIME,
	appointment_status ENUM ('PENDING', 'CONFIRMED', 'RESCHEDULED', 'CANCELLED', 'NO-SHOW', 'COMPLETED') NOT NULL,
	appointment_location ENUM ('SEDE POBLADO', 'SEDE CENTRO', 'SEDE ENVIGADO', 'SEDE BELLO', 'SEDE ITAGUI', 'SEDE SABANETA', 'SEDE BOGOTA') NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	
	FOREIGN KEY (donor_id)
	REFERENCES donors(id),
	
	FOREIGN KEY (campaign_id)
	REFERENCES campaigns(id)
);

-- notification_channel	notification_message	notification_status	notification_sent_at
CREATE TABLE notifications(
	id INT AUTO_INCREMENT PRIMARY KEY,
	donor_id INT NOT NULL,
	notification_channel ENUM ('EMAIL', 'WHATSAPP', 'SMS') NOT NULL,
	notification_message VARCHAR(150) NOT NULL,
	notification_status ENUM ('QUEUED', 'SENT', 'FAILED') NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	
	FOREIGN KEY (donor_id)
	REFERENCES donors(id)
);