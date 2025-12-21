Margdarshak / Gemini API setup (backend)

1) Local setup (temporary for current PowerShell session)

Run these in the same PowerShell session you will use to start the backend:

    $env:GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    $env:GEMINI_API_KEY = "<YOUR_GEMINI_API_KEY>"

    cd 'C:\Users\Ashish Kumar\OneDrive\Documents\KisanConnect\backend'
    .\mvnw.cmd spring-boot:run

2) Persistent (Windows) — stores for your user

    setx GEMINI_API_URL "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    setx GEMINI_API_KEY "<YOUR_GEMINI_API_KEY>"

Open a new terminal after `setx` to pick up the changes.

3) Test endpoint (after backend is running)

Use PowerShell to POST a simple payload to the backend proxy:

    $body = @{ contents = @(@{ parts = @(@{ text = "Hello Margdarshak, give wheat tips." }) }) } | ConvertTo-Json -Depth 10
    Invoke-RestMethod -Method Post -Uri http://localhost:8081/api/ai/generate -Body $body -ContentType 'application/json'

4) CI / Deployment

- Store `GEMINI_API_KEY` and `GEMINI_API_URL` in your hosting/CI secrets (e.g., GitHub Actions Secrets). Do NOT commit real keys.
- Use `backend/.env.local.example` as a reference for variable names.
