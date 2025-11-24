# Fresh Start & Offline Authentication Setup

## 🗑️ Step 1: Delete All Non-Admin Users

### Option A: Using the API Endpoint (Recommended)
```bash
# Make a POST request to delete all non-admin users
curl -X POST http://localhost:8081/api/users/cleanup/delete-all-non-admin
```

### Option B: Using SQL (Direct Database)
1. Open pgAdmin or connect to your PostgreSQL database
2. Run the SQL commands from `cleanup.sql`:
```sql
DELETE FROM farmers WHERE uid NOT IN (SELECT uid FROM users WHERE role = 'admin');
DELETE FROM buyers WHERE uid NOT IN (SELECT uid FROM users WHERE role = 'admin');
DELETE FROM users WHERE role != 'admin';
SELECT * FROM users;
```

---

## 📝 Step 2: How Offline Authentication Works

### Registration Flow:
1. User fills signup form with email, password, firstName, lastName
2. Password is hashed on **backend** using BCrypt
3. User data is saved to **local PostgreSQL database**
4. User also gets created in Firebase Auth

### Login Flow (Offline Support):
1. **First Try**: Offline login using local database
   - Sends `email` + `password` to `/api/auth/login-offline`
   - Backend verifies password hash against PostgreSQL
   - If successful → Login complete ✅ (works without internet)
   
2. **Fallback**: Firebase login (if offline fails or internet available)
   - Uses Firebase Auth
   - Requires internet connection

---

## 🚀 Testing Offline Mode

### Scenario 1: With Internet
1. Start backend on `http://localhost:8081`
2. Start frontend on `http://localhost:3000`
3. Register a new user → saved to PostgreSQL + Firebase
4. Logout
5. **Disconnect internet**
6. Try to login → **Should work using local database!** ✅

### Scenario 2: Without Internet
1. Stop backend (or disconnect network)
2. Frontend will try to login offline
3. Backend offline login endpoint will be called
4. If credentials exist in PostgreSQL → Success! ✅

---

## 📊 Database Schema Changes

### New Fields in `users` table:
```
- password: VARCHAR(255)  -- BCrypt hashed password
```

### Updated `farmers` & `buyers` tables:
- Now include `firstName` and `lastName` fields
- Also support `email` and `password` fields

---

## 🔑 Key Features

✅ **Fresh Start**: Delete all non-admin users
✅ **Offline Login**: Works without internet using local database
✅ **Password Hashing**: BCrypt encryption (not stored as plain text)
✅ **Fallback**: Firebase login as backup
✅ **Local Database**: All user data stored in PostgreSQL

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login-offline` - Offline login (email + password)
  
### User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user (saves password hash)
- `DELETE /api/users/{uid}` - Delete user
- `POST /api/users/cleanup/delete-all-non-admin` - Delete all non-admin users

---

## ⚠️ Important Notes

1. **First Time Setup**:
   - Stop backend
   - Run `mvn clean install` to download Spring Security dependency
   - Restart backend

2. **Database Update**:
   - Hibernate will auto-create the `password` column
   - Make sure `spring.jpa.hibernate.ddl-auto=update` is set in `application.properties`

3. **Old Users**:
   - Existing users (before this update) may not have password hashes
   - They'll need to re-register or have their passwords re-hashed

4. **Security**:
   - Never store passwords as plain text ✅ (Using BCrypt)
   - Always hash on server-side ✅
   - Passwords are never logged or transmitted as plain text ✅

---

## 🛠️ Troubleshooting

**Q: Login not working offline?**
- A: Make sure backend is running and PostgreSQL has the user data

**Q: "Spring Security cannot be resolved"?**
- A: Run `mvn clean install` to download dependencies, then restart backend

**Q: Password column doesn't exist?**
- A: Wait a few seconds after backend startup (Hibernate needs time to create tables)

**Q: Can't delete users?**
- A: Make sure you're making a POST request to `/api/users/cleanup/delete-all-non-admin`

