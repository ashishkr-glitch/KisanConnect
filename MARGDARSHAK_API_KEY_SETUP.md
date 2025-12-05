# 🔑 Margdarshak AI - API Key Setup Guide

## ⚠️ Issue: API Key Compromised

Your Gemini API key has been reported as leaked. Google has revoked it for security reasons.

**Error**: `403: {"error":{"code":403,"message":"Your API key was reported as leaked. Please use another API key."}}`

---

## ✅ Solution: Set Up a New Gemini API Key

### **Step 1: Get a New API Key from Google**

1. Go to: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"** button
4. Select your project (or create a new one)
5. Copy the generated API key

---

### **Step 2: Configure Backend with New Key**

Choose ONE of these options:

#### **Option A: Using Environment Variable (Recommended for Production)** 🔐

Set environment variable before running backend:

```bash
# Windows PowerShell
$env:GEMINI_API_KEY="your_new_api_key_here"

# Or add to system environment variables (Windows)
# 1. Press Win + X → System
# 2. Click "Advanced system settings"
# 3. Click "Environment Variables"
# 4. Add new variable: GEMINI_API_KEY = your_key_here
# 5. Restart your terminal/IDE

# Linux/Mac
export GEMINI_API_KEY="your_new_api_key_here"
```

Then run backend:
```bash
cd backend
./mvnw spring-boot:run
```

#### **Option B: Using application.properties (For Development Only)** 📝

Edit: `backend/src/main/resources/application.properties`

Add or uncomment this line:
```properties
gemini.api.key=your_new_api_key_here
```

Full example:
```properties
spring.application.name=backend
server.port=8081

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/Kisan2
spring.datasource.username=postgres
spring.datasource.password=12345

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.use_sql_comments=true

# Gemini AI Key
gemini.api.key=your_new_api_key_here
```

---

### **Step 3: Verify Configuration**

Check the logs when backend starts:

**Success**:
```
[AiProxy] Using X-goog-api-key header for API key.
```

**Failure**:
```
[AiProxy] ERROR: GEMINI_API_KEY not configured!
```

---

### **Step 4: Test Margdarshak AI**

1. Start backend: `./mvnw spring-boot:run` (from backend folder)
2. Start frontend: `npm start` (from frontend folder)
3. Navigate to Margdarshak AI page
4. Send a test message - should work now!

---

## 🔒 Security Notes

✅ **DO**:
- Use environment variables for production
- Keep API key secret - don't commit to version control
- Use `.gitignore` to exclude sensitive files
- Rotate keys periodically
- Use different keys for different environments (dev, staging, prod)

❌ **DON'T**:
- Commit API keys to git
- Expose keys in frontend code
- Share keys in messages/chats
- Use the same key everywhere

---

## 📋 Architecture Changes Made

### Frontend (`Margdarshak.js`)
- ✅ Now uses backend proxy: `http://localhost:8081/api/ai/generate`
- ✅ No longer sends API key from frontend
- ✅ Secure communication through backend

### Backend (`AiProxyController.java`)
- ✅ Reads API key from environment or properties
- ✅ Forwards requests to Google Gemini API
- ✅ Returns responses back to frontend
- ✅ No hardcoded keys

### Configuration (`application.properties`)
- ✅ Added `gemini.api.key` property (optional)
- ✅ Backend checks environment variable first
- ✅ Better error messages for missing keys

---

## 🚀 Quick Start Command

**Windows PowerShell (All-in-One)**:
```powershell
# Set your new API key and start backend
$env:GEMINI_API_KEY="AIzaSy...YOUR_NEW_KEY_HERE..."; cd backend; .\mvnw spring-boot:run
```

**Mac/Linux**:
```bash
# Set your new API key and start backend
export GEMINI_API_KEY="AIzaSy...YOUR_NEW_KEY_HERE..." && cd backend && ./mvnw spring-boot:run
```

---

## 🆘 Troubleshooting

### **Still getting 403 error?**
- ✅ Verify API key is fresh and active
- ✅ Check key doesn't have typos
- ✅ Ensure backend restarted after setting key
- ✅ Verify environment variable is set: `echo $env:GEMINI_API_KEY` (PowerShell)
- ✅ Check backend logs for configuration errors

### **No Margdarshak response?**
- ✅ Ensure backend is running on port 8081
- ✅ Check browser console for errors
- ✅ Check backend console for proxy errors

### **API key not found in properties file?**
```
[AiProxy] ERROR: GEMINI_API_KEY not configured!
```
- ✅ Uncomment `gemini.api.key` line in application.properties
- ✅ Or set GEMINI_API_KEY environment variable
- ✅ Restart backend

---

## 📚 Related Files

- Frontend: `frontend/src/pages/Margdarshak.js` (updated to use backend proxy)
- Backend: `backend/src/main/java/com/newKisan/controller/AiProxyController.java` (updated to use env key)
- Config: `backend/src/main/resources/application.properties` (added gemini.api.key)
- Frontend env: `frontend/.env.local.example` (reference only)

---

## ✨ Next Steps

1. **Get new API key** from https://aistudio.google.com/app/apikey
2. **Set environment variable** or update application.properties
3. **Restart backend**
4. **Test in Margdarshak page**
5. **Celebrate** 🎉

---

**Status**: ✅ Security hardened with backend proxy!

Your Margdarshak AI is now:
- 🔐 More secure (no frontend API key exposure)
- 🔄 Flexible (can change keys without rebuilding frontend)
- 🛡️ Production-ready (uses environment variables)

Enjoy secure AI-powered guidance for your farmers! 🌾✨
