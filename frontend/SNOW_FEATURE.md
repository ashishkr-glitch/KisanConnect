Snowfall feature — implementation notes

Summary
- Small canvas-based snowfall overlay was added and controlled via a lightweight client-side API.
- Toggle controls (Header, Sidebar, Login/Signup, and a control page) were added and synchronized via localStorage + a custom event.

Files changed / added
- public/snowfall.js
  - Canvas-based implementation. Exposes global functions: `window.startSnowfall()` and `window.stopSnowfall()`.
  - Auto-starts on page load when `localStorage.getItem('letItSnow') === 'true'`.
  - Canvas is fixed, covers viewport, uses `pointer-events: none` so it doesn't block UI.
- public/index.html
  - A `<script src="/snowfall.js"></script>` tag was added to load the script.
- src/components/SnowToggle.js
  - Reusable React component. Reads `localStorage['letItSnow']`, toggles it, calls `window.startSnowfall()` / `window.stopSnowfall()`, and dispatches a custom event `kc-snow-change`.
- src/pages/SnowControl.js
  - Small settings page with a UI toggle and a short explanation / removal tip. Saves to `localStorage` and calls the global API.
- src/App.js
  - Route `/snow-control` added and SnowControl component imported.
- src/layout/Header.js (or src/components/Header.js)
  - SnowToggle added next to ThemeToggle (imported component).
- src/dashboard/Sidebar.js
  - SnowToggle placed above Logout in sidebar-footer; uses unified `.footer-btn` styles.
- src/auth/Login.js and src/auth/Signup.js
  - SnowToggle added near ThemeToggle; UI adjusted to match auth layout.
- CSS files updated for active/hover states and visual matching (examples):
  - src/dashboard/Sidebar.css
  - src/styles/dashboardTheme.css
  - other component CSS files where `.snow-toggle` or `.footer-btn` styles were applied

Runtime API & behavior
- localStorage key: `letItSnow`
  - Value `'true'` means snowfall should be active across pages.
- Global functions (from `public/snowfall.js`):
  - `window.startSnowfall()` — creates canvas/particles and begins animation loop.
  - `window.stopSnowfall()` — stops animation and removes canvas from DOM.
- Custom event:
  - `'kc-snow-change'` — dispatched on `window` when SnowToggle toggles snow. Other components can listen and update UI.

Quick runtime controls (developer / user)
- Start snowfall in browser console:

```js
localStorage.setItem('letItSnow', 'true');
window.startSnowfall && window.startSnowfall();
window.dispatchEvent(new Event('kc-snow-change'));
```

- Stop snowfall in browser console:

```js
localStorage.removeItem('letItSnow');
window.stopSnowfall && window.stopSnowfall();
window.dispatchEvent(new Event('kc-snow-change'));
```

How to remove the feature manually (full cleanup)
1) Remove the script tag from `public/index.html`.
   - Remove this line (or similar): `<script src="/snowfall.js"></script>`
2) Delete the runtime file `public/snowfall.js`.
   - `git rm public/snowfall.js` and commit, or delete via file explorer.
3) Remove the SnowToggle component and usages:
   - Delete or remove `src/components/SnowToggle.js`.
   - Remove any imports and `<SnowToggle />` JSX from these files (example paths):
     - `src/layout/Header.js` or `src/components/Header.js`
     - `src/dashboard/Sidebar.js`
     - `src/auth/Login.js`
     - `src/auth/Signup.js`
4) Remove the SnowControl page and route:
   - Delete `src/pages/SnowControl.js` and `src/pages/SnowControl.css` (if present).
   - Remove the `/snow-control` route and import from `src/App.js`.
5) Remove references to the global API and custom event listeners:
   - Search the codebase for `startSnowfall`, `stopSnowfall`, `kc-snow-change`, and `letItSnow` and remove/update references. Example grep commands:

```bash
# from repo root
git grep "startSnowfall\|stopSnowfall\|kc-snow-change\|letItSnow" -- frontend || true
```

6) Remove CSS rules added for `.snow-toggle` and `.footer-btn` if you no longer want the styling changes:
   - Check `src/dashboard/Sidebar.css` and `src/styles/dashboardTheme.css` and remove the specific `.snow-toggle` or `.footer-btn` rules; or revert to previous styles via Git.
7) Clean up leftover localStorage key (client-side):
   - In browser console: `localStorage.removeItem('letItSnow')`
8) Commit & push the removals:

```bash
# example sequence
git add -A
git commit -m "Remove snowfall feature"   # or appropriate message
git push
```

Tip if you only want to temporarily disable snow (no code edits)
- Stop it at runtime (browser console):

```js
localStorage.removeItem('letItSnow');
window.stopSnowfall && window.stopSnowfall();
```

Search helpers
- To locate all references and quickly revert, run:

```bash
# find where letItSnow is used
git grep "letItSnow" -- frontend || true
# find custom event references
git grep "kc-snow-change" -- frontend || true
```

Notes / safety
- The snow overlay uses `pointer-events: none` so it doesn't block clicks.
- If you remove the script but some components still call `window.startSnowfall()`, they will throw `undefined` errors — remove references first or guard calls with `window.startSnowfall && window.startSnowfall()`.

If you want, I can now:
- Revert the changes that added the feature (prepare a git rm + patches), or
- Create a small revert script that undoes all edits made earlier.

— End of file
