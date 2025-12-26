(function () {
  // Minimal, self-contained snowfall effect.
  // Exposes window.startSnowfall() and window.stopSnowfall().

  let canvas, ctx, flakes = [], animId;
  let running = false;
  const MAX_FLAKES = 120;

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'kc-snow-canvas';
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    window.addEventListener('resize', onResize);
  }

  function onResize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initFlakes() {
    flakes = [];
    for (let i = 0; i < MAX_FLAKES; i++) {
      flakes.push({
        x: rand(0, canvas.width),
        y: rand(-canvas.height, canvas.height),
        r: rand(1.2, 4.2),
        d: rand(0.5, 2.0),
        vx: rand(-0.3, 0.3),
      });
    }
  }

  function step() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      ctx.moveTo(f.x, f.y);
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
    }
    ctx.fill();

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.y += Math.pow(f.d, 1.3) + 0.5;
      f.x += f.vx + Math.sin(Date.now() / 1000 + f.d) * 0.5;

      if (f.y > canvas.height + 10) {
        f.y = -10;
        f.x = rand(0, canvas.width);
      }
      if (f.x > canvas.width + 10) f.x = -10;
      if (f.x < -10) f.x = canvas.width + 10;
    }

    animId = requestAnimationFrame(step);
  }

  function startSnowfall() {
    if (running) return;
    running = true;
    if (!canvas) createCanvas();
    initFlakes();
    step();
  }

  function stopSnowfall() {
    running = false;
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    if (canvas) {
      try { canvas.remove(); } catch (e) {}
      canvas = null; ctx = null; flakes = [];
    }
    window.removeEventListener('resize', onResize);
  }

  // Auto-run if localStorage flag present
  try {
    if (localStorage && localStorage.getItem && localStorage.getItem('letItSnow') === 'true') {
      // Delay a little to let page paint
      setTimeout(() => { startSnowfall(); }, 400);
    }
  } catch (e) {}

  // Expose on window
  window.startSnowfall = startSnowfall;
  window.stopSnowfall = stopSnowfall;

})();
