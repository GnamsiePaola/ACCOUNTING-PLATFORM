-- Sample data for testing the accounting platform
USE `accounting_platform`;

-- Insert sample users
INSERT INTO `users` (`userid`, `username`, `email`, `password`, `is_active`) VALUES
(UUID(), 'john_doe', 'john@example.com', '$2b$10$example_hashed_password_1', TRUE),
(UUID(), 'jane_smith', 'jane@example.com', '$2b$10$example_hashed_password_2', TRUE);

-- Get user IDs for reference
SET @user1_id = (SELECT userid FROM users WHERE username = 'john_doe');
SET @user2_id = (SELECT userid FROM users WHERE username = 'jane_smith');

-- Insert sample businesses
INSERT INTO `businesses` (`business_name`, `contact_phone`, `contact_email`, `address`, `tax_id`, `user_id`) VALUES
('Tech Solutions Inc', '+1-555-0123', 'info@techsolutions.com', '123 Tech Street, Silicon Valley, CA 94000', 'TAX123456', @user1_id),
('Creative Agency LLC', '+1-555-0456', 'hello@creativeagency.com', '456 Design Ave, New York, NY 10001', 'TAX789012', @user2_id);

-- Get business IDs for reference
SET @business1_id = (SELECT business_id FROM businesses WHERE business_name = 'Tech Solutions Inc');
SET @business2_id = (SELECT business_id FROM businesses WHERE business_name = 'Creative Agency LLC');

-- Insert sample categories
INSERT INTO `categories` (`name`, `description`, `category_type`, `business_id`) VALUES
('Software Products', 'Software development and licensing', 'product', @business1_id),
('Office Supplies', 'General office supplies and equipment', 'expense', @business1_id),
('Consulting Services', 'Professional consulting services', 'income', @business1_id),
('Design Services', 'Creative design and branding services', 'product', @business2_id),
('Marketing Expenses', 'Advertising and marketing costs', 'expense', @business2_id);

-- Insert sample clients
INSERT INTO `clients` (`client_name`, `contact_person`, `phone`, `email`, `address`, `payment_terms`, `business_id`) VALUES
('ABC Corporation', 'Michael Johnson', '+1-555-1001', 'michael@abccorp.com', '789 Business Blvd, Los Angeles, CA 90001', 'Net 30', @business1_id),
('XYZ Enterprises', 'Sarah Wilson', '+1-555-1002', 'sarah@xyzent.com', '321 Commerce St, Chicago, IL 60601', 'Net 15', @business1_id),
('StartupCo', 'David Brown', '+1-555-2001', 'david@startupco.com', '654 Innovation Dr, Austin, TX 78701', 'Net 30', @business2_id);

-- Insert sample vendors
INSERT INTO `vendors` (`vendor_name`, `contact_person`, `phone`, `email`, `address`, `payment_terms`, `business_id`) VALUES
('Office Depot', 'Sales Team', '+1-555-3001', 'sales@officedepot.com', '111 Supply Chain Ave, Denver, CO 80201', 'Net 30', @business1_id),
('Cloud Services Inc', 'Account Manager', '+1-555-3002', 'billing@cloudservices.com', '222 Server St, Seattle, WA 98101', 'Net 15', @business1_id),
('Print Solutions', 'Customer Service', '+1-555-4001', 'orders@printsolutions.com', '333 Print Ave, Miami, FL 33101', 'Net 30', @business2_id);

-- Insert sample products
INSERT INTO `products` (`product_name`, `description`, `unit_price`, `quantity_in_stock`, `minimum_stock_level`, `category_id`, `business_id`) VALUES
('Web Development Package', 'Complete web development solution', 5000.00, 0, 0, (SELECT category_id FROM categories WHERE name = 'Software Products'), @business1_id),
('Mobile App Development', 'Custom mobile application development', 8000.00, 0, 0, (SELECT category_id FROM categories WHERE name = 'Software Products'), @business1_id),
('Logo Design Package', 'Professional logo design service', 500.00, 0, 0, (SELECT category_id FROM categories WHERE name = 'Design Services'), @business2_id),
('Brand Identity Package', 'Complete brand identity design', 1200.00, 0, 0, (SELECT category_id FROM categories WHERE name = 'Design Services'), @business2_id);

-- Insert sample income records
INSERT INTO `income` (`income_date`, `amount`, `description`, `invoice_number`, `client_id`, `category_id`, `business_id`) VALUES
('2025-01-15', 5000.00, 'Web development project payment', 'INV-2025-001', (SELECT client_id FROM clients WHERE client_name = 'ABC Corporation'), (SELECT category_id FROM categories WHERE name = 'Consulting Services'), @business1_id),
('2025-01-18', 8000.00, 'Mobile app development milestone', 'INV-2025-002', (SELECT client_id FROM clients WHERE client_name = 'XYZ Enterprises'), (SELECT category_id FROM categories WHERE name = 'Consulting Services'), @business1_id),
('2025-01-20', 1200.00, 'Brand identity design project', 'INV-2025-003', (SELECT client_id FROM clients WHERE client_name = 'StartupCo'), (SELECT category_id FROM categories WHERE name = 'Design Services'), @business2_id);

-- Insert sample expense records
INSERT INTO `expenses` (`expense_date`, `amount`, `description`, `receipt_number`, `vendor_id`, `category_id`, `business_id`) VALUES
('2025-01-10', 450.00, 'Office supplies purchase', 'REC-001', (SELECT vendor_id FROM vendors WHERE vendor_name = 'Office Depot'), (SELECT category_id FROM categories WHERE name = 'Office Supplies'), @business1_id),
('2025-01-12', 299.99, 'Cloud hosting services', 'REC-002', (SELECT vendor_id FROM vendors WHERE vendor_name = 'Cloud Services Inc'), (SELECT category_id FROM categories WHERE name = 'Office Supplies'), @business1_id),
('2025-01-16', 750.00, 'Marketing materials printing', 'REC-003', (SELECT vendor_id FROM vendors WHERE vendor_name = 'Print Solutions'), (SELECT category_id FROM categories WHERE name = 'Marketing Expenses'), @business2_id);

-- Insert corresponding transactions
INSERT INTO `transactions` (`transaction_date`, `amount`, `transaction_type`, `status`, `description`, `reference_id`, `business_id`) VALUES
('2025-01-15', 5000.00, 'income', 'completed', 'Web development project payment', 1, @business1_id),
('2025-01-18', 8000.00, 'income', 'completed', 'Mobile app development milestone', 2, @business1_id),
('2025-01-20', 1200.00, 'income', 'pending', 'Brand identity design project', 3, @business2_id),
('2025-01-10', 450.00, 'expense', 'completed', 'Office supplies purchase', 1, @business1_id),
('2025-01-12', 299.99, 'expense', 'completed', 'Cloud hosting services', 2, @business1_id),
('2025-01-16', 750.00, 'expense', 'completed', 'Marketing materials printing', 3, @business2_id);
