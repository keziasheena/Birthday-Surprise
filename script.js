/* ─────────────────────────────────────────────
   CONFIG — Edit these values before sharing
   ───────────────────────────────────────────── */
const HUSBAND_NAME   = 'Sayangku';       // Ganti dengan nama suami
const YOUR_NAME      = 'Istrimu';        // Ganti dengan namamu
const FIRST_MET_DATE = new Date('2020-01-01'); // Ganti tanggal pertama bertemu

/* ─────────────────────────────────────────────
   INIT
   ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('husbandName').textContent  = HUSBAND_NAME;
  document.getElementById('yourName').textContent     = YOUR_NAME;

  spawnGoldDust();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  buildSliderDots();
});

/* ─────────────────────────────────────────────
   SCREEN TRANSITIONS
   ───────────────────────────────────────────── */
let currentScreen = 'screen-gift';

function goTo(id) {
  const prev = document.getElementById(currentScreen);
  const next = document.getElementById(id);
  if (!next || id === currentScreen) return;

  prev.classList.remove('active');
  next.classList.add('active');
  currentScreen = id;

  if (id === 'screen-intro')     spawnHearts();
  if (id === 'screen-finale')    initFireworks();
  if (id !== 'screen-gift')      showMusicBtn();
}

function showMusicBtn() {
  document.getElementById('musicBtn').style.display = 'flex';
}

/* ─────────────────────────────────────────────
   GIFT BOX
   ───────────────────────────────────────────── */
let giftOpened = false;

function openGift() {
  if (giftOpened) return;
  giftOpened = true;

  const lid   = document.getElementById('giftLid');
  const burst = document.getElementById('lightBurst');
  const scene = document.getElementById('giftScene');
  const hint  = document.querySelector('.gift-hint');

  // Hint fades
  hint.style.transition = 'opacity 0.4s';
  hint.style.opacity    = '0';

  // Lid flies up
  lid.style.transition  = 'transform 0.7s cubic-bezier(0.23,1,0.32,1), opacity 0.5s 0.4s';
  lid.style.transform   = 'translateY(-90px) rotate(-20deg)';
  lid.style.opacity     = '0';

  // Light burst
  setTimeout(() => {
    burst.classList.add('boom');
  }, 350);

  // Scene fades out → go to intro
  setTimeout(() => {
    scene.style.transition = 'opacity 0.6s';
    scene.style.opacity    = '0';
  }, 700);

  setTimeout(() => {
    goTo('screen-intro');
  }, 1350);
}

/* ─────────────────────────────────────────────
   GOLD DUST
   ───────────────────────────────────────────── */
function spawnGoldDust() {
  const container = document.getElementById('goldDust');
  for (let i = 0; i < 18; i++) {
    const dot = document.createElement('div');
    dot.className = 'dust-dot';
    dot.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      --dur: ${5 + Math.random() * 6}s;
      --delay: ${Math.random() * -8}s;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      opacity: 0;
    `;
    container.appendChild(dot);
  }
}

/* ─────────────────────────────────────────────
   FLOATING HEARTS
   ───────────────────────────────────────────── */
function spawnHearts() {
  const layer = document.getElementById('heartsLayer');
  layer.innerHTML = '';
  const symbols = ['♥', '♥', '♥', '❤', '❤'];

  for (let i = 0; i < 22; i++) {
    const h = document.createElement('div');
    h.className  = 'heart';
    const size   = 10 + Math.random() * 18;
    const color  = Math.random() > 0.5 ? '#CC2936' : '#E8647A';
    h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    h.style.cssText = `
      left: ${3 + Math.random() * 94}%;
      font-size: ${size}px;
      color: ${color};
      --dur: ${7 + Math.random() * 9}s;
      --delay: ${Math.random() * -14}s;
      --rot: ${-15 + Math.random() * 30}deg;
      --alpha: ${0.5 + Math.random() * 0.45};
    `;
    layer.appendChild(h);
  }
}

/* ─────────────────────────────────────────────
   SLIDER
   ───────────────────────────────────────────── */
let slideIndex  = 0;
const SLIDE_COUNT = 6;
let autoSlide;
let touchStartX = 0;

function buildSliderDots() {
  const wrap = document.getElementById('sliderDots');
  wrap.innerHTML = '';
  for (let i = 0; i < SLIDE_COUNT; i++) {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.onclick = () => goToSlide(i);
    wrap.appendChild(d);
  }
  startAutoSlide();
  setupSwipe();
}

function goToSlide(n) {
  slideIndex = (n + SLIDE_COUNT) % SLIDE_COUNT;
  document.getElementById('sliderTrack').style.transform =
    `translateX(-${slideIndex * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) =>
    d.classList.toggle('active', i === slideIndex));
}

function moveSlide(dir) {
  goToSlide(slideIndex + dir);
  resetAutoSlide();
}

function startAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => goToSlide(slideIndex + 1), 4000);
}
function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}

function setupSwipe() {
  const wrap = document.getElementById('sliderWrap');
  wrap.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  wrap.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      moveSlide(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   COUNTDOWN
   ───────────────────────────────────────────── */
function updateCountdown() {
  const now   = new Date();
  const start = FIRST_MET_DATE;

  let years  = now.getFullYear() - start.getFullYear();
  let months = now.getMonth()    - start.getMonth();
  let days   = now.getDate()     - start.getDate();

  if (days < 0) {
    months--;
    const prev = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) { years--; months += 12; }

  const totalSec = Math.floor((now - start) / 1000);

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('cntYears',   years);
  setEl('cntMonths',  months);
  setEl('cntDays',    days);
  setEl('cntSeconds', totalSec.toLocaleString('id-ID'));
}

/* ─────────────────────────────────────────────
   FIREWORKS (Canvas)
   ───────────────────────────────────────────── */
let fireworksActive = false;
let fwRAF;
const particles = [];

function initFireworks() {
  if (fireworksActive) return;
  fireworksActive = true;

  const canvas = document.getElementById('fireworksCanvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    '#D4AF37', '#F5D76E', '#FF8C42',
    '#E8647A', '#FFFFFF', '#FFC0CB',
    '#A88820', '#FFD700'
  ];

  function launch() {
    const x = 0.1 * canvas.width + Math.random() * 0.8 * canvas.width;
    const y = 0.1 * canvas.height + Math.random() * 0.55 * canvas.height;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const count = 34 + Math.floor(Math.random() * 14);

    for (let i = 0; i < count; i++) {
      const angle  = (Math.PI * 2 / count) * i;
      const speed  = 1.8 + Math.random() * 3.5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        radius: 1.5 + Math.random() * 2,
        gravity: 0.06 + Math.random() * 0.04,
        decay:   0.013 + Math.random() * 0.008
      });
    }
  }

  // Launch immediately then every 1.4s
  launch();
  const launchTimer = setInterval(launch, 1400);

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.alpha -= p.decay;

      if (p.alpha <= 0) { particles.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.restore();
    }

    fwRAF = requestAnimationFrame(draw);
  }

  draw();

  // Stop after 30s to save resources (can be relaunched)
  setTimeout(() => {
    clearInterval(launchTimer);
    setTimeout(() => {
      cancelAnimationFrame(fwRAF);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      fireworksActive = false;
    }, 3000);
  }, 30000);
}

/* ─────────────────────────────────────────────
   ROMANTIC AMBIENT MUSIC (Web Audio API)
   ───────────────────────────────────────────── */
let audioCtx   = null;
let masterGain = null;
let isPlaying  = false;
const oscNodes = [];

// Cmaj7 chord: C4 E4 G4 B4 + C5 octave
const CHORD_FREQS = [261.63, 329.63, 392.00, 493.88, 523.25];

function buildMusic() {
  if (audioCtx) return;
  audioCtx   = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);

  CHORD_FREQS.forEach((freq, i) => {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const lfo  = audioCtx.createOscillator();
    const lfoG = audioCtx.createGain();

    osc.type      = 'sine';
    osc.frequency.value = freq;

    lfo.type      = 'sine';
    lfo.frequency.value = 0.08 + i * 0.02;
    lfoG.gain.value     = 0.003;

    lfo.connect(lfoG);
    lfoG.connect(osc.frequency);

    gain.gain.value = 0.045 / (1 + i * 0.15);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    lfo.start();
    oscNodes.push(osc, lfo);
  });
}

function toggleMusic() {
  if (!audioCtx) {
    buildMusic();
  } else if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (!isPlaying) {
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setTargetAtTime(1, audioCtx.currentTime, 1.5);
    isPlaying = true;
  } else {
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, 1.0);
    isPlaying = false;
  }

  document.getElementById('iconNote').style.display  = isPlaying ? 'none'  : 'inline';
  document.getElementById('iconPause').style.display = isPlaying ? 'inline': 'none';
  document.getElementById('musicPulse').classList.toggle('playing', isPlaying);
}

/* ─────────────────────────────────────────────
   RESTART
   ───────────────────────────────────────────── */
function restartExperience() {
  // Stop fireworks
  cancelAnimationFrame(fwRAF);
  fireworksActive = false;
  particles.length = 0;
  const canvas = document.getElementById('fireworksCanvas');
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

  // Reset gift
  giftOpened = false;
  const lid   = document.getElementById('giftLid');
  const burst = document.getElementById('lightBurst');
  const scene = document.getElementById('giftScene');
  const hint  = document.querySelector('.gift-hint');
  lid.style.transition = 'none';
  lid.style.transform  = '';
  lid.style.opacity    = '1';
  burst.classList.remove('boom');
  scene.style.transition = 'none';
  scene.style.opacity    = '1';
  hint.style.opacity     = '1';

  // Reset slider
  goToSlide(0);

  // Music button off
  document.getElementById('musicBtn').style.display = 'none';

  // Go back to gift
  const current = document.getElementById(currentScreen);
  current.classList.remove('active');
  const gift = document.getElementById('screen-gift');
  gift.classList.add('active');
  currentScreen = 'screen-gift';
}
