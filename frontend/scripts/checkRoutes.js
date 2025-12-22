const fs = require('fs');
const path = require('path');
const axios = require('axios');

const SIDEBAR_PATH = path.join(__dirname, '..', 'src', 'dashboard', 'Sidebar.js');
const BASE = process.env.FRONTEND_BASE || 'http://localhost:3000';

function extractRoutes(sidebarSource) {
  const routes = new Set();
  const re = /to=\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(sidebarSource)) !== null) {
    routes.add(m[1]);
  }
  return Array.from(routes).sort();
}

async function probeRoute(route) {
  const url = `${BASE}${route}`;
  try {
    const res = await axios.get(url, { timeout: 6000, headers: { Accept: 'text/html' } });
    const body = (res.data || '').toString().toLowerCase();

    const checks = [];
    if (res.status >= 400) checks.push(`http ${res.status}`);
    if (body.includes('access denied') || body.includes('unauthorized') || body.includes('please login') || body.includes('login to view profile')) checks.push('access-denied');
    if (body.includes('404') || body.includes('not found') || body.includes('page not found')) checks.push('404');

    return { route, url, status: res.status, flags: checks };
  } catch (err) {
    if (err.response) {
      const code = err.response.status;
      return { route, url, status: code, flags: [`http ${code}`] };
    }
    return { route, url, status: 'ERR', flags: [err.code || err.message] };
  }
}

async function main() {
  if (!fs.existsSync(SIDEBAR_PATH)) {
    console.error('Sidebar file not found:', SIDEBAR_PATH);
    process.exit(2);
  }

  const src = fs.readFileSync(SIDEBAR_PATH, 'utf8');
  const routes = extractRoutes(src);

  if (!routes.length) {
    console.error('No routes found in Sidebar.js');
    process.exit(2);
  }

  console.log('Probing routes from Sidebar.js against', BASE);
  console.log('Tip: run frontend dev server (`npm start`) so SPA pages resolve');
  console.log('---');

  const results = [];
  for (const r of routes) {
    process.stdout.write(`Checking ${r} ... `);
    const res = await probeRoute(r);
    results.push(res);
    if (res.flags.length) console.log(res.flags.join(', '));
    else console.log('OK');
  }

  console.log('\nSummary:');
  for (const r of results) {
    const bad = r.flags && r.flags.length;
    console.log(`${bad ? 'FAILED' : ' OK  '}  ${r.route} -> ${r.url}  ${bad ? ' [' + r.flags.join(', ') + ']' : ''}`);
  }

  const failed = results.filter(r => r.flags && r.flags.length);
  if (failed.length) process.exit(3);
}

main().catch(e => {
  console.error('Error running route checker:', e);
  process.exit(1);
});
