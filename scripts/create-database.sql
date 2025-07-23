-- MySQL Script for Accounting Platform Database
-- Based on your provided schema with improvements

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Create Database
CREATE DATABASE IF NOT EXISTS `accounting_platform` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `accounting_platform`;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `userid` VARCHAR(36) NOT NULL DEFAULT (UUID()),
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`userid`),
  INDEX `idx_email` (`email`),
  INDEX `idx_username` (`username`)
);

-- Business Table
CREATE TABLE IF NOT EXISTS `businesses` (
  `business_id` INT AUTO_INCREMENT,
  `business_name` VARCHAR(255) NOT NULL,
  `contact_phone` VARCHAR(20),
  `contact_email` VARCHAR(255),
  `address` TEXT,
  `tax_id` VARCHAR(50),
  `user_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`business_id`),
  INDEX `idx_user_id` (`user_id`),
  CONSTRAINT `fk_business_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`userid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` INT AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `category_type` ENUM('product', 'expense', 'income') NOT NULL,
  `business_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  INDEX `idx_business_id` (`business_id`),
  CONSTRAINT `fk_category_business`
    FOREIGN KEY (`business_id`)
    REFERENCES `businesses` (`business_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` INT AUTO_INCREMENT,
  `product_name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `unit_price` DECIMAL(10,2) DEFAULT 0.00,
  `quantity_in_stock` INT DEFAULT 0,
  `minimum_stock_level` INT DEFAULT 0,
  `category_id` INT,
  `business_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`product_id`),
  INDEX `idx_business_id` (`business_id`),
  INDEX `idx_category_id` (`category_id`),
  CONSTRAINT `fk_product_business`
    FOREIGN KEY (`business_id`)
    REFERENCES `businesses` (`business_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_product_category`
    FOREIGN KEY (`category_id`)
    REFERENCES `categories` (`category_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- Vendors Table
CREATE TABLE IF NOT EXISTS `vendors` (
  `vendor_id` INT AUTO_INCREMENT,
  `vendor_name` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(255),
  `phone` VARCHAR(20),
  `email` VARCHAR(255),
  `address` TEXT,
  `payment_terms` VARCHAR(100),
  `business_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`vendor_id`),
  INDEX `idx_business_id` (`business_id`),
  CONSTRAINT `fk_vendor_business`
    FOREIGN KEY (`business_id`)
    REFERENCES `businesses` (`business_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Clients Table
CREATE TABLE IF NOT EXISTS `clients` (
  `client_id` INT AUTO_INCREMENT,
  `client_name` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(255),
  `phone` VARCHAR(20),
  `email` VARCHAR(255),
  `address` TEXT,
  `payment_terms` VARCHAR(100),
  `business_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`client_id`),
  INDEX `idx_business_id` (`business_id`),
  CONSTRAINT `fk_client_business`
    FOREIGN KEY (`business_id`)
    REFERENCES `businesses` (`business_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS `expenses` (
  `expense_id` INT AUTO_INCREMENT,
  `expense_date` DATE NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `description` TEXT,
  `receipt_number` VARCHAR(100),
  `vendor_id` INT,
  `category_id` INT,
  `business_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`expense_id`),
  INDEX `idx_business_id` (`business_id`),
  INDEX `idx_vendor_id` (`vendor_id`),
  INDEX `idx_category_id` (`category_id`),
  INDEX `idx_expense_date` (`expense_date`),
  CONSTRAINT `fk_expense_business`
    FOREIGN KEY (`business_id`)
    REFERENCES `businesses` (`business_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_expense_vendor`
    FOREIGN KEY (`vendor_id`)
    REFERENCES `vendors` (`vendor_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_expense_category`
    FOREIGN KEY (`category_id`)
    REFERENCES `categories` (`category_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- Income Table
CREATE TABLE IF NOT EXISTS `income` (
  `income_id` INT AUTO_INCREMENT,
  `income_date` DATE NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `description` TEXT,
  `invoice_number` VARCHAR(100),
  `client_id` INT,
  `category_id` INT,
  `business_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`income_id`),
  INDEX `idx_business_id` (`business_id`),
  INDEX `idx_client_id` (`client_id`),
  INDEX `idx_category_id` (`category_id`),
  INDEX `idx_income_date` (`income_date`),
  CONSTRAINT `fk_income_business`
    FOREIGN KEY (`business_id`)
    REFERENCES `businesses` (`business_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_income_client`
    FOREIGN KEY (`client_id`)
    REFERENCES `clients` (`client_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_income_category`
    FOREIGN KEY (`category_id`)
    REFERENCES `categories` (`category_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- Transactions Table (for tracking all financial movements)
CREATE TABLE IF NOT EXISTS `transactions` (
  `transaction_id` INT AUTO_INCREMENT,
  `transaction_date` DATE NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `transaction_type` ENUM('income', 'expense') NOT NULL,
  `status` ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
  `description` TEXT,
  `reference_id` INT, -- Links to income_id or expense_id
  `business_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  INDEX `idx_business_id` (`business_id`),
  INDEX `idx_transaction_date` (`transaction_date`),
  INDEX `idx_transaction_type` (`transaction_type`),
  CONSTRAINT `fk_transaction_business`
    FOREIGN KEY (`business_id`)
    REFERENCES `businesses` (`business_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- Stock Movements Table
CREATE TABLE IF NOT EXISTS `stock_movements` (
  `movement_id` INT AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `movement_type` ENUM('in', 'out', 'adjustment') NOT NULL,
  `quantity` INT NOT NULL,
  `unit_cost` DECIMAL(10,2),
  `total_cost` DECIMAL(10,2),
  `movement_date` DATE NOT NULL,
  `reference_number` VARCHAR(100),
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`movement_id`),
  INDEX `idx_product_id` (`product_id`),
  INDEX `idx_movement_date` (`movement_date`),
  CONSTRAINT `fk_stock_movement_product`
    FOREIGN KEY (`product_id`)
    REFERENCES `products` (`product_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
