# KisanConnect - Full Stack Setup

Agricultural e-commerce platform built with **React** (frontend) and **Spring Boot** (backend).

## 📋 Prerequisites

- **Node.js** (v16+) — [Download](https://nodejs.org/)
- **Java 24** — Already installed ✓
- **Maven 3.0.0-M5** — Already installed ✓
- **Git** (optional)

## 🚀 Quick Start (Single Command)

### Option 1: Run Both Services Together

From the **root KisanConnect folder**, run:

```powershell
# First time setup (install all dependencies)
npm install
npm run install-all

# Start both React and Spring Boot
npm start
```

This will:
- ✅ Start **React dev server** on `http://localhost:3000`
- ✅ Start **Spring Boot backend** on `http://localhost:8081`
- ✅ Both logs visible in terminal (with different colors)
- ✅ Auto-reload on code changes (React only, restart backend manually for Java changes)

### Option 2: Run Services Separately

#### Start React Frontend Only
```powershell
cd frontend
npm install
npm start
```
Frontend will run on: `http://localhost:3000`

#### Start Spring Boot Backend Only
```powershell
cd backend
mvn clean install
mvn spring-boot:run
```
Backend will run on: `http://localhost:8081`

---

## 📁 Project Structure

```
KisanConnect/
├── frontend/                 # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/                  # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── BackendApplication.java (main class)
├── package.json              # Root npm config (NEW - handles both services)
└── README.md
```

---

## 🔧 Environment Configuration

### Frontend (.env - Optional)
Create `frontend/.env` if you need custom backend URL:
```
REACT_APP_API_URL=http://localhost:8081
```

### Backend (application.properties)
Check `backend/src/main/resources/application.properties`:
```properties
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/kisan_connect
spring.datasource.username=root
spring.datasource.password=your_password
```

---

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start React + Spring Boot together |
| `npm run frontend` | Start only React |
| `npm run backend` | Start only Spring Boot |
| `npm run install-all` | Install all dependencies (both frontend and backend) |

---

## 🐛 Troubleshooting

### Port Already in Use (3000 or 8081)

**For Port 3000 (React):**
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port
$env:PORT=3001; npm run frontend
```

**For Port 8081 (Spring Boot):**
Edit `backend/src/main/resources/application.properties`:
```properties
server.port=8082
```

### Maven Build Fails

```powershell
cd backend
mvn clean install -U
```

### Java Version Mismatch

Check Java version:
```powershell
java -version
```

Should show: `java version "24"` ✓

---

## 🔌 API Endpoints

Default backend URL: `http://localhost:8081`

Common endpoints:
- `POST /auth/login` — User login
- `GET /crops` — Fetch all crops
- `POST /crops` — Add new crop
- `DELETE /crops/{id}` — Delete crop
- `GET /farmers` — List farmers
- `GET /buyers` — List buyers

---

## 📝 Development Tips

### Hot Reload
- **React**: Auto-reloads on file changes ✓
- **Java/Spring Boot**: Restart required (use `mvn spring-boot:run` with dev tools or restart terminal)

### Enable Spring Boot Dev Tools (Optional)
Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
</dependency>
```

### Database Setup

Ensure MySQL is running:
```powershell
# Windows - if MySQL is installed as service
net start MySQL80

# Or use Docker
docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:8
```

---

## 🚢 Production Deployment

### Build Frontend
```powershell
cd frontend
npm run build
```
Creates optimized build in `frontend/build/`

### Build Backend JAR
```powershell
cd backend
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

---

## 📧 Support

If you encounter issues:
1. Check terminal logs (both React and Spring Boot output)
2. Verify ports are not in use
3. Ensure Java version is 24+
4. Check Maven is in PATH: `mvn --version`
5. Check Node is in PATH: `node --version`

---

## ✅ Quick Checklist

- [ ] Node.js installed (`node --version` shows v16+)
- [ ] Java 24 installed (`java -version` shows 24)
- [ ] Maven installed (`mvn --version` shows 3.0.0-M5)
- [ ] MySQL/Database running
- [ ] Root `package.json` created
- [ ] Run `npm install` from root
- [ ] Run `npm start` to launch both services
- [ ] React opens at `http://localhost:3000`
- [ ] Backend API available at `http://localhost:8081`

---

**You're all set! Happy coding! 🎉**
