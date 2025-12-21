# AI Proxy (Margdarshak) — Backend README

This file explains how to configure and run the small AI proxy controller added to this backend. The controller forwards requests from the frontend to the configured Gemini-compatible API endpoint while keeping the API key secret on the server.

Files:
- `src/main/java/com/newKisan/controller/AiProxyController.java` — POST `/api/ai/generate` proxy endpoint.

Configuration
- Environment variable: `GEMINI_API_KEY` — set this to your real Gemini (or provider) API key on the server. DO NOT commit this key anywhere.

Local development (temporary for current PowerShell session)
1. Open PowerShell and set the key for the session:

```powershell
$env:GEMINI_API_KEY = '<YOUR_REAL_KEY>'
```

2. Run the backend (from project `backend` folder):

```powershell
cd 'C:\Users\Ashish Kumar\OneDrive\Documents\KisanConnect\backend'
.\mvnw.cmd spring-boot:run
```

Persistent (Windows) — set for future sessions
```powershell
setx GEMINI_API_KEY "<YOUR_REAL_KEY>"
# Open a new PowerShell window to use the persisted variable
```

Start frontend (in separate terminal)
```powershell
cd 'C:\Users\Ashish Kumar\OneDrive\Documents\KisanConnect\frontend'
npm start
```

Test the proxy
Use curl or Postman to POST to the proxy endpoint:

```powershell
curl -X POST http://localhost:8081/api/ai/generate -H "Content-Type: application/json" -d @- << 'JSON'
{
  "contents": [
    {
      "parts": [
        { "text": "Explain how AI works in a few words" }
      ]
    }
  ]
}
JSON
```

What the proxy does
- Forwards the request body as JSON to the Google Generative Language endpoint (default URL in controller).
- Sends the API key from the server environment as an Authorization `Bearer` token.

Adjustments
- If your provider requires `X-goog-api-key` or another header instead of Bearer, edit `AiProxyController.java` and replace the header logic accordingly.
- If the request/response JSON shape differs from what the provider expects, the controller currently forwards the body as-is — we can add a translator/validator if needed.

Security notes
- Never store the real `GEMINI_API_KEY` in frontend files or in source control.
- For production, store `GEMINI_API_KEY` in your platform's secret manager (Azure Key Vault, AWS Secrets Manager, GCP Secret Manager, or environment variables managed by your orchestration system).

Troubleshooting
- If you see `Server error: GEMINI_API_KEY not configured` make sure the environment variable is set in the same shell that starts the backend.
- If the backend fails to start with missing dependency errors, ensure `spring-boot-starter-web` is present in `pom.xml` (it is included in this project by default).

Contact
If you want, I can adapt the controller to send `Authorization: Bearer <token>` vs `X-goog-api-key`, add request validation, or add a small integration test. Tell me which and I'll implement it.
