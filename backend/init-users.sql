-- Insert test users for offline authentication
-- Note: These passwords are hashed using BCrypt with salt rounds 10
-- Test users:
-- farmer: email=farmer@test.com, password=farmer123
-- buyer: email=buyer@test.com, password=buyer123
-- admin: email=admin@test.com, password=admin123

INSERT INTO users (uid, email, password, full_name, mobile, role, state, district) 
VALUES 
  ('FARM001', 'farmer@test.com', '$2a$10$kVIvDjZ2B0ZvIQKjQCVvPejy5v0X7vHQVPxHvKxBxFLxhQ6q4VNAa', 'Test Farmer', '9999999991', 'farmer', 'Maharashtra', 'Pune'),
  ('BUYER01', 'buyer@test.com', '$2a$10$1p/ZiYWx5IVkKPYYJXLDr.5FVMVhQ0QJhqYZ8Y7ZJBzEKLCfQc1xO', 'Test Buyer', '9999999992', 'buyer', 'Karnataka', 'Bangalore'),
  ('ADMIN01', 'admin@test.com', '$2a$10$5p1HH8vt6KJNVsxOl7mhMeLHaYbXVLJ9nXcVIh5pVLJHzQ8qIpWqC', 'Test Admin', '9999999993', 'admin', 'Delhi', 'Delhi')
ON CONFLICT (email) DO NOTHING;

-- Verify insertion
SELECT uid, email, full_name, role FROM users WHERE email IN ('farmer@test.com', 'buyer@test.com', 'admin@test.com');
