# Route Checker

This small script extracts `to` paths from `frontend/src/dashboard/Sidebar.js` and probes each route against the running frontend dev server.

What it checks:
- HTTP status (non-2xx responses are reported)
- Simple HTML checks for text like `Access Denied`, `Unauthorized`, `Please login`, `404`, `Not Found`.

Usage

1. Start your frontend dev server so the SPA pages are served (default: http://localhost:3000):

```powershell
cd frontend
npm start
```

2. In another terminal, run the checker:

```powershell
cd frontend
node .\scripts\checkRoutes.js
```

Notes

- The checker performs simple keyword checks in the returned HTML and is not a full browser-based test. For client-side-only routing that requires authentication you should log into the app in a browser first or enhance the script to use a headless browser (Puppeteer) to perform logged-in navigation.
- You can change the target base URL by setting the `FRONTEND_BASE` environment variable, e.g.: `set FRONTEND_BASE=http://localhost:3000` on Windows PowerShell.
