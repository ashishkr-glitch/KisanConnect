-- SQL Script to clean up database (Remove all non-admin users)
-- Run this in your PostgreSQL database to start fresh

-- Delete from related tables first (to avoid foreign key issues)
DELETE FROM farmers WHERE uid NOT IN (SELECT uid FROM users WHERE role = 'admin');
DELETE FROM buyers WHERE uid NOT IN (SELECT uid FROM users WHERE role = 'admin');

-- Delete non-admin users
DELETE FROM users WHERE role != 'admin';

-- Verify result
SELECT * FROM users;
