/* ─────────────────────────────────────────────────────────────────────────
   Connect. — site js
   Vanilla. No deps. Respects prefers-reduced-motion.
   ───────────────────────────────────────────────────────────────────────── */

(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Sticky nav state ─────────────────────────────────────────────────── */
  const nav = document.querySelector('header.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 24) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Mobile menu ─────────────────────────────────────────────────────── */
  const menuBtn = document.querySelector('.nav-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
      const open = navLinks.classList.contains('is-open');
      menuBtn.textContent = open ? 'Close' : 'Menu';
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ── Reveal on scroll ─────────────────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      reveals.forEach((el) => el.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      reveals.forEach((el) => io.observe(el));
    }
  }

  /* ── Breathing dot-grid background ────────────────────────────────────── */
  const gridCanvas = document.querySelector('.grid-bg');
  if (gridCanvas instanceof HTMLCanvasElement) {
    const ctx = gridCanvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let raf = 0;
    const period = 6000;
    const start = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = gridCanvas.clientWidth;
      h = gridCanvas.clientHeight;
      gridCanvas.width = Math.floor(w * dpr);
      gridCanvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t) => {
      const phase = ((t - start) % period) / period;
      const breath = 0.5 + Math.sin(phase * Math.PI * 2) * 0.5;
      const baseAlpha = 0.06 + breath * 0.05;
      ctx.clearRect(0, 0, w, h);
      const spacing = 28;
      ctx.fillStyle = `rgba(236,236,232,${baseAlpha})`;
      for (let y = spacing / 2; y < h; y += spacing) {
        for (let x = spacing / 2; x < w; x += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const staticDraw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(236,236,232,0.07)';
      const spacing = 28;
      for (let y = spacing / 2; y < h; y += spacing) {
        for (let x = spacing / 2; x < w; x += spacing) {
          ctx.beginPath(); ctx.arc(x, y, 0.9, 0, Math.PI * 2); ctx.fill();
        }
      }
    };

    resize();
    window.addEventListener('resize', () => {
      resize();
      if (reduced) staticDraw();
    });

    if (reduced) {
      staticDraw();
    } else {
      raf = requestAnimationFrame(draw);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else raf = requestAnimationFrame(draw);
      });
    }
  }

  /* ── Tide pacer demo ──────────────────────────────────────────────────── */
  const tideCanvas = document.getElementById('tide-canvas');
  const tideInstr = document.querySelector('.tide-instr');
  if (tideCanvas instanceof HTMLCanvasElement) {
    const ctx = tideCanvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = 0;
    let raf = 0;
    let inhaling = false;
    let touchStartT = 0;
    let userR = 0;
    let coherence = 0;
    const PHASE_MS = 5000; // 5 in / 5 out = resonant 6 BPM

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = tideCanvas.clientWidth;
      tideCanvas.width = Math.floor(size * dpr);
      tideCanvas.height = Math.floor(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onDown = (e) => {
      e.preventDefault();
      inhaling = true;
      touchStartT = performance.now();
      if (tideInstr) {
        tideInstr.textContent = 'Inhale';
        tideInstr.classList.add('active');
      }
    };
    const onUp = () => {
      inhaling = false;
      if (tideInstr) {
        tideInstr.textContent = 'Hold to inhale · release to exhale';
        tideInstr.classList.remove('active');
      }
    };

    tideCanvas.addEventListener('pointerdown', onDown);
    tideCanvas.addEventListener('pointerup', onUp);
    tideCanvas.addEventListener('pointercancel', onUp);
    tideCanvas.addEventListener('pointerleave', onUp);

    const lerp = (a, b, k) => a + (b - a) * k;
    const easeInOut = (x) => 0.5 - 0.5 * Math.cos(Math.PI * x);

    const draw = (t) => {
      const cx = size / 2, cy = size / 2;
      const maxR = size * 0.40;
      const minR = size * 0.16;

      // Pacer phase: cycle 10s (5 in + 5 out)
      const cyclePos = (t % (PHASE_MS * 2)) / (PHASE_MS * 2);
      const pacerPhase = cyclePos < 0.5
        ? easeInOut(cyclePos * 2)            // inhale 0 → 1
        : 1 - easeInOut((cyclePos - 0.5) * 2); // exhale 1 → 0
      const pacerR = lerp(minR, maxR, pacerPhase);

      // User radius: follows inhaling, with eased catch-up
      const targetUserR = inhaling
        ? Math.min(maxR, minR + (performance.now() - touchStartT) / PHASE_MS * (maxR - minR))
        : minR;
      userR = lerp(userR, targetUserR, 0.12);

      // Coherence: how close user is to pacer (0..1)
      const diff = Math.abs(userR - pacerR) / (maxR - minR);
      const inst = Math.max(0, 1 - diff * 2.5);
      coherence = lerp(coherence, inst, 0.04);

      ctx.clearRect(0, 0, size, size);

      // Outer guide ring
      ctx.strokeStyle = 'rgba(236,236,232,0.10)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, maxR, 0, Math.PI * 2); ctx.stroke();

      // Coherence halos
      const haloCount = 4;
      for (let i = 0; i < haloCount; i++) {
        const r = pacerR + (i + 1) * 14;
        const a = 0.05 * coherence * (1 - i / haloCount);
        if (a > 0.001) {
          ctx.strokeStyle = `rgba(95,201,197,${a.toFixed(3)})`;
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        }
      }

      // Pacer ring (color shifts cool → warm with phase)
      const phaseColor = pacerPhase; // 0 small (exhale end) → 1 big (inhale end)
      const r = Math.round(lerp(95, 244, phaseColor));   // inhale → cool teal, exhale → warm pink
      const g = Math.round(lerp(201, 140, phaseColor));
      const b = Math.round(lerp(197, 128, phaseColor));
      // Wait: we want inhale (big) = teal, exhale (small) = pink. So when pacerPhase HIGH = teal.
      const rr = Math.round(lerp(244, 95,  phaseColor));
      const gg = Math.round(lerp(140, 201, phaseColor));
      const bb = Math.round(lerp(128, 197, phaseColor));
      ctx.strokeStyle = `rgb(${rr}, ${gg}, ${bb})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(cx, cy, pacerR, 0, Math.PI * 2); ctx.stroke();

      // Progress arc (one rotation per phase)
      const arcPhase = (t % PHASE_MS) / PHASE_MS;
      const startA = -Math.PI / 2;
      const endA = startA + arcPhase * Math.PI * 2;
      ctx.strokeStyle = `rgba(${rr}, ${gg}, ${bb}, 0.7)`;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, pacerR + 8, startA, endA); ctx.stroke();
      // leading dot
      ctx.fillStyle = `rgb(${rr}, ${gg}, ${bb})`;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(endA) * (pacerR + 8), cy + Math.sin(endA) * (pacerR + 8), 2.4, 0, Math.PI * 2);
      ctx.fill();

      // User disc
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, userR);
      grad.addColorStop(0, `rgba(255, 220, 200, ${0.42 + coherence * 0.18})`);
      grad.addColorStop(1, `rgba(244, 140, 128, ${0.20 + coherence * 0.15})`);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, userR, 0, Math.PI * 2); ctx.fill();

      // Coherence meter at the foot
      const meterY = size - 22;
      const meterW = size * 0.4;
      const meterX = cx - meterW / 2;
      ctx.fillStyle = 'rgba(236,236,232,0.08)';
      ctx.fillRect(meterX, meterY, meterW, 2);
      ctx.fillStyle = `rgba(46, 186, 118, ${0.6 + coherence * 0.4})`;
      ctx.fillRect(meterX, meterY, meterW * coherence, 2);

      raf = requestAnimationFrame(draw);
    };

    const staticDraw = () => {
      const cx = size / 2, cy = size / 2;
      const maxR = size * 0.40;
      const minR = size * 0.24;
      ctx.clearRect(0, 0, size, size);
      ctx.strokeStyle = 'rgba(236,236,232,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, maxR, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#5fc9c5'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(cx, cy, (maxR + minR) / 2, 0, Math.PI * 2); ctx.stroke();
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, minR);
      grad.addColorStop(0, 'rgba(255, 220, 200, 0.4)');
      grad.addColorStop(1, 'rgba(244, 140, 128, 0.18)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, minR, 0, Math.PI * 2); ctx.fill();
    };

    resize();
    window.addEventListener('resize', () => { resize(); if (reduced) staticDraw(); });

    if (reduced) {
      staticDraw();
    } else {
      raf = requestAnimationFrame(draw);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); }
        else { raf = requestAnimationFrame(draw); }
      });
    }
  }

  /* ── Net puzzle decoration ────────────────────────────────────────────── */
  const netCanvas = document.getElementById('net-canvas');
  if (netCanvas instanceof HTMLCanvasElement) {
    const ctx = netCanvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = 0;
    let raf = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = netCanvas.clientWidth;
      netCanvas.width = Math.floor(size * dpr);
      netCanvas.height = Math.floor(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const N = 5; // 5x5 grid
    // Pre-built simple connected layout: each tile has a bitmask of connectors (N,E,S,W = 1,2,4,8)
    const layout = [
      [2,10,8,2,8],
      [4,5,0,4,1],
      [3,12,2,9,0],
      [4,1,4,2,8],
      [0,0,1,0,0],
    ];
    let rotations = layout.map(row => row.map(() => Math.floor(Math.random() * 4)));

    const start = performance.now();
    const draw = (t) => {
      const cell = size / N;
      ctx.clearRect(0, 0, size, size);

      const elapsed = t - start;
      // Auto-rotate one tile every 1.4s to settled state
      const settleStep = Math.floor(elapsed / 1400);
      const settleI = Math.floor(settleStep / N) % N;
      const settleJ = settleStep % N;
      if (settleStep >= 0 && settleStep < N * N) {
        rotations[settleI][settleJ] = 0;
      }

      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const cx = j * cell + cell / 2;
          const cy = i * cell + cell / 2;
          const mask = layout[i][j];
          if (!mask) continue;
          const rot = rotations[i][j];
          // rotate mask by rot * 90° clockwise: N->E->S->W
          let m = mask;
          for (let r = 0; r < rot; r++) {
            m = (((m << 1) | (m >> 3)) & 0xF);
          }
          const settled = rotations[i][j] === 0;
          ctx.strokeStyle = settled ? 'rgba(236,236,232,0.85)' : 'rgba(236,236,232,0.22)';
          ctx.lineWidth = 1.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          if (m & 1) { ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - cell * 0.45); }
          if (m & 2) { ctx.moveTo(cx, cy); ctx.lineTo(cx + cell * 0.45, cy); }
          if (m & 4) { ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + cell * 0.45); }
          if (m & 8) { ctx.moveTo(cx, cy); ctx.lineTo(cx - cell * 0.45, cy); }
          ctx.stroke();
          // node dot
          ctx.fillStyle = settled ? 'rgba(236,236,232,0.92)' : 'rgba(236,236,232,0.32)';
          ctx.beginPath(); ctx.arc(cx, cy, 1.6, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Source marker at center
      const sx = (Math.floor(N/2) * cell) + cell / 2;
      const sy = sx;
      ctx.strokeStyle = 'rgba(95,201,197,0.95)';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2); ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    if (reduced) { draw(performance.now() + 99999); }
    else { raf = requestAnimationFrame(draw); }
  }
})();
