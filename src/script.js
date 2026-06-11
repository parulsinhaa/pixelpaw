// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PIXEL CAT RENDERER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const CAT_PALETTES = {
  orange:   { body:'#E8923A', stripe:'#B85C0A', belly:'#F7C87A', eye:'#2D1200', nose:'#E87070', ear:'#E07070' },
  black:    { body:'#252525', stripe:'#111',    belly:'#4A4A4A', eye:'#FFFFFF', nose:'#E87070', ear:'#E07070' },
  siamese:  { body:'#C9A96E', stripe:'#8B6230', belly:'#F0E0C0', eye:'#4A90D9', nose:'#E87070', ear:'#D07070' },
  mackerel: { body:'#9A9A9A', stripe:'#555',    belly:'#DDD8CC', eye:'#4A7A4A', nose:'#E87070', ear:'#D07070' },
  white:    { body:'#EEEEEE', stripe:'#CCCCCC', belly:'#FFFFFF', eye:'#88BBDD', nose:'#FFB0B0', ear:'#FFB8B8' },
};

const ACCESSORIES = {
  none:    null,
  hat:     { color:'#D97757', accent:'#E8B86D' },
  scarf:   { color:'#7EA16B', accent:'#5A8050' },
  glasses: { color:'#444',    accent:'#666' },
  bow:     { color:'#E8B86D', accent:'#D97757' },
};

// Draw a pixel cat on a canvas context
// scale: pixels-per-cell (e.g. 4 for 64px canvas with 16-cell design)
function drawCat(ctx, pal, acc, frame, blinking, state, scale) {
  const s = scale;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const bodyOffY = (state === 'sleep') ? 0 : (frame % 2 === 0 ? 0 : -1);
  const tailAngle = (state === 'happy') ? (frame % 2 === 0 ? 15 : -15) : (frame % 4 < 2 ? 5 : -5);

  // â”€â”€ Tail â”€â”€
  ctx.save();
  const tailPivotX = 13 * s;
  const tailPivotY = 11 * s;
  ctx.translate(tailPivotX, tailPivotY);
  ctx.rotate(tailAngle * Math.PI / 180);
  ctx.translate(-tailPivotX, -tailPivotY);
  roundRect(ctx, 13*s, 9*s, 2*s, 6*s, pal.body, s*0.5);
  roundRect(ctx, 11*s, 13*s, 4*s, 2*s, pal.body, s*0.5);
  ctx.restore();

  ctx.save();
  ctx.translate(0, bodyOffY * s);

  // â”€â”€ Ears â”€â”€
  fillRect(ctx, 2*s, 1*s, 3*s, 3*s, pal.body);
  fillRect(ctx, 11*s, 1*s, 3*s, 3*s, pal.body);
  fillRect(ctx, 3*s, 2*s, s, s, pal.ear);
  fillRect(ctx, 12*s, 2*s, s, s, pal.ear);

  // â”€â”€ Head â”€â”€
  roundRect(ctx, 2*s, 3*s, 12*s, 8*s, pal.body, s*0.5);

  // â”€â”€ Head stripes â”€â”€
  ctx.globalAlpha = 0.35;
  fillRect(ctx, 5*s, 3*s, s, 2*s, pal.stripe);
  fillRect(ctx, 8*s, 3*s, s, 2*s, pal.stripe);
  fillRect(ctx, 10*s, 3*s, s, 2*s, pal.stripe);
  ctx.globalAlpha = 1;

  // â”€â”€ Eyes â”€â”€
  if (blinking || state === 'sleep') {
    fillRect(ctx, 4*s, 6*s, 3*s, s, pal.eye);
    fillRect(ctx, 9*s, 6*s, 3*s, s, pal.eye);
    if (state === 'sleep') {
      // ZZZ
      ctx.fillStyle = '#88AABB';
      ctx.font = `${s*1.5}px 'Press Start 2P', monospace`;
      ctx.fillText('z', 14*s, 4*s);
    }
  } else {
    roundRect(ctx, 4*s, 5*s, 3*s, 3*s, pal.eye, s*0.3);
    roundRect(ctx, 9*s, 5*s, 3*s, 3*s, pal.eye, s*0.3);
    // Shine
    ctx.globalAlpha = 0.7;
    fillRect(ctx, 5*s, 5*s, s, s, '#ffffff');
    fillRect(ctx, 10*s, 5*s, s, s, '#ffffff');
    ctx.globalAlpha = 1;
  }

  // â”€â”€ Nose â”€â”€
  fillRect(ctx, 7*s, 8*s, 2*s, s, pal.nose);
  // Mouth
  ctx.strokeStyle = pal.stripe; ctx.lineWidth = s*0.4;
  ctx.beginPath(); ctx.moveTo(7*s, 9*s); ctx.lineTo(6*s, 10*s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(9*s, 9*s); ctx.lineTo(10*s, 10*s); ctx.stroke();

  // â”€â”€ Whiskers â”€â”€
  ctx.strokeStyle = pal.stripe; ctx.globalAlpha = 0.5; ctx.lineWidth = s*0.3;
  ctx.beginPath(); ctx.moveTo(0, 8*s); ctx.lineTo(4*s, 8*s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 7*s); ctx.lineTo(3*s, 7.5*s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(16*s, 8*s); ctx.lineTo(12*s, 8*s); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(16*s, 7*s); ctx.lineTo(13*s, 7.5*s); ctx.stroke();
  ctx.globalAlpha = 1;

  // â”€â”€ Body â”€â”€
  roundRect(ctx, 3*s, 10*s, 10*s, 5*s, pal.body, s*0.5);

  // â”€â”€ Belly â”€â”€
  ctx.globalAlpha = 0.6;
  roundRect(ctx, 5*s, 11*s, 6*s, 4*s, pal.belly, s*0.5);
  ctx.globalAlpha = 1;

  // â”€â”€ Body stripes â”€â”€
  ctx.globalAlpha = 0.3;
  fillRect(ctx, 3*s, 11*s, s, 3*s, pal.stripe);
  fillRect(ctx, 12*s, 11*s, s, 3*s, pal.stripe);
  ctx.globalAlpha = 1;

  // â”€â”€ Legs â”€â”€
  fillRect(ctx, 3*s, 14*s, 3*s, 2*s, pal.body);
  fillRect(ctx, 10*s, 14*s, 3*s, 2*s, pal.body);
  // paw detail
  ctx.globalAlpha = 0.4;
  fillRect(ctx, 3*s, 15*s, 3*s, s, pal.stripe);
  fillRect(ctx, 10*s, 15*s, 3*s, s, pal.stripe);
  ctx.globalAlpha = 1;

  // â”€â”€ Accessory â”€â”€
  if (acc === 'hat') {
    fillRect(ctx, 4*s, 0, 8*s, s, ACCESSORIES.hat.color);
    fillRect(ctx, 5*s, -2*s, 6*s, 3*s, ACCESSORIES.hat.color);
    ctx.globalAlpha=0.4; fillRect(ctx, 5*s, -2*s, 6*s, s, ACCESSORIES.hat.accent); ctx.globalAlpha=1;
  } else if (acc === 'scarf') {
    fillRect(ctx, 2*s, 10*s, 12*s, 2*s, ACCESSORIES.scarf.color);
    ctx.globalAlpha=0.5; fillRect(ctx, 2*s, 10*s, 12*s, s, ACCESSORIES.scarf.accent); ctx.globalAlpha=1;
    fillRect(ctx, 5*s, 11*s, 2*s, 3*s, ACCESSORIES.scarf.color);
  } else if (acc === 'glasses') {
    ctx.strokeStyle = ACCESSORIES.glasses.color; ctx.lineWidth = s*0.5;
    ctx.strokeRect(3.5*s, 5*s, 3*s, 3*s);
    ctx.strokeRect(9.5*s, 5*s, 3*s, 3*s);
    ctx.beginPath(); ctx.moveTo(6.5*s, 6.5*s); ctx.lineTo(9.5*s, 6.5*s); ctx.stroke();
  } else if (acc === 'bow') {
    fillRect(ctx, 6*s, 0, 4*s, s, ACCESSORIES.bow.color);
    fillRect(ctx, 7*s, -s, 2*s, 3*s, ACCESSORIES.bow.accent);
  }

  ctx.restore();
}

function fillRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
function roundRect(ctx, x, y, w, h, color, r) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ANIMATION STATE MACHINE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
class PetAnimator {
  constructor(canvasId, scale) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.scale = scale;
    this.frame = 0;
    this.blinking = false;
    this.state = 'idle';
    this.palette = 'orange';
    this.acc = 'none';
    this.tick = 0;

    // auto blink
    this._scheduleBlink();
    this._loop();
  }

  _scheduleBlink() {
    const delay = 2500 + Math.random() * 3000;
    setTimeout(() => {
      if (this.state !== 'sleep') {
        this.blinking = true;
        setTimeout(() => { this.blinking = false; this._scheduleBlink(); }, 140);
      } else {
        this._scheduleBlink();
      }
    }, delay);
  }

  _loop() {
    this.tick++;
    if (this.tick % 3 === 0) this.frame++;
    const pal = CAT_PALETTES[this.palette] || CAT_PALETTES.orange;
    drawCat(this.ctx, pal, this.acc, this.frame, this.blinking, this.state, this.scale);
    requestAnimationFrame(() => this._loop());
  }

  setState(s, duration) {
    this.state = s;
    if (duration) setTimeout(() => { this.state = 'idle'; }, duration);
  }
  setPalette(p) { this.palette = p; }
  setAcc(a) { this.acc = a; }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// INITIALIZE ALL CATS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const cats = {};
window.addEventListener('DOMContentLoaded', () => {
  cats.hero   = new PetAnimator('hero-cat',    10);
  cats.demo   = new PetAnimator('demo-cat',    8);
  cats.preview= new PetAnimator('preview-cat', 7.5);
  cats.mood   = new PetAnimator('mood-cat',    6);
  cats.pom    = new PetAnimator('pom-cat',     3);
  cats.price  = new PetAnimator('price-cat',   4);
  cats.nav    = new PetAnimator('nav-cat',     1.75);
  cats.footer = new PetAnimator('footer-cat',  2.25);
  cats.toast  = new PetAnimator('toast-cat',   2);
  cats.nav.setState('idle');
  initCatPicker();
  initAccPicker();
  initMoods();
  setupReveal();
  setupCustomCursor();
  setupPomTimer();
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CAT PICKER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const CAT_VARIANTS = [
  { key:'orange',   name:'Orange' },
  { key:'black',    name:'Black' },
  { key:'siamese',  name:'Siamese' },
  { key:'mackerel', name:'Mackerel' },
  { key:'white',    name:'White' },
];
let selectedCat = 'orange';
const pickCatCanvases = {};

function initCatPicker() {
  const grid = document.getElementById('cat-picker');
  CAT_VARIANTS.forEach(v => {
    const card = document.createElement('div');
    card.className = 'cat-card' + (v.key === selectedCat ? ' selected' : '');
    card.id = 'catcard-' + v.key;
    card.innerHTML = `
      <canvas id="picker-cat-${v.key}" width="64" height="64" style="display:block;margin:0 auto;filter:drop-shadow(2px 2px 0 #000)"></canvas>
      <div class="cat-name">${v.name}</div>
    `;
    card.onclick = () => selectCat(v.key);
    grid.appendChild(card);
  });

  // animate picker cats
  CAT_VARIANTS.forEach(v => {
    const c = document.getElementById('picker-cat-' + v.key);
    if (!c) return;
    pickCatCanvases[v.key] = { canvas: c, ctx: c.getContext('2d'), frame: 0, tick: 0, blink: false };
    (function loop(obj) {
      obj.tick++;
      if (obj.tick % 3 === 0) obj.frame++;
      const pal = CAT_PALETTES[v.key];
      drawCat(obj.ctx, pal, 'none', obj.frame, obj.blink, 'idle', 4);
      requestAnimationFrame(() => loop(obj));
    })(pickCatCanvases[v.key]);
    // blink
    setInterval(() => {
      pickCatCanvases[v.key].blink = true;
      setTimeout(() => { pickCatCanvases[v.key].blink = false; }, 140);
    }, 3000 + Math.random()*2000);
  });
}

function selectCat(key) {
  document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('catcard-' + key)?.classList.add('selected');
  selectedCat = key;
  document.getElementById('preview-name').textContent = CAT_VARIANTS.find(v=>v.key===key)?.name + ' Cat';
  // sync all cats
  Object.values(cats).forEach(c => c && c.setPalette && c.setPalette(key));
  showToast('ðŸ± ' + CAT_VARIANTS.find(v=>v.key===key)?.name + ' cat selected!');
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ACCESSORY PICKER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const ACC_LIST = [
  { key:'none', label:'âœ• None' },
  { key:'hat', label:'ðŸŽ© Hat' },
  { key:'scarf', label:'ðŸ§£ Scarf' },
  { key:'glasses', label:'ðŸ‘“ Glasses' },
  { key:'bow', label:'ðŸŽ€ Bow' },
];
let selectedAcc = 'none';

function initAccPicker() {
  const grid = document.getElementById('acc-picker');
  ACC_LIST.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'acc-btn' + (a.key === selectedAcc ? ' active' : '');
    btn.id = 'accbtn-' + a.key;
    btn.textContent = a.label;
    btn.onclick = () => selectAcc(a.key);
    grid.appendChild(btn);
  });
}

function selectAcc(key) {
  document.querySelectorAll('.acc-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('accbtn-' + key)?.classList.add('active');
  selectedAcc = key;
  Object.values(cats).forEach(c => c && c.setAcc && c.setAcc(key));
  document.getElementById('preview-acc').textContent = key === 'none' ? 'No accessories' : ACC_LIST.find(a=>a.key===key)?.label || '';
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// MOODS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const MOODS = [
  { key:'curious',  label:'Curious',  emoji:'ðŸ‘€', color:'#E8B86D', state:'idle',  desc:'PixelPaw tilts its head and stares at something only it can see. Probably a pixel bird. Probably.' },
  { key:'happy',    label:'Happy',    emoji:'ðŸ˜¸', color:'#7EA16B', state:'happy', desc:'Tail wagging, eyes sparkling. Your companion is absolutely delighted â€” possibly because you exist.' },
  { key:'sleepy',   label:'Sleepy',   emoji:'ðŸ˜´', color:'#6B7EA1', state:'sleep', desc:'Eyelids drooping... PixelPaw finds the nearest cozy corner, curls into a tiny ball, and snores softly.' },
  { key:'excited',  label:'Excited',  emoji:'âš¡', color:'#D97757', state:'happy', desc:'ZOOM. PixelPaw bounces across the screen with completely unhinged energy. Something incredible just happened.' },
  { key:'focused',  label:'Focused',  emoji:'ðŸŽ¯', color:'#9B7EA1', state:'idle',  desc:'Perfectly still. Eyes sharp. PixelPaw is in full study-buddy mode and will not be disturbed until the Pomodoro ends.' },
  { key:'hungry',   label:'Hungry',   emoji:'ðŸŸ', color:'#A17E6B', state:'idle',  desc:'"Hey. Hey. Psst. Hey." â€” PixelPaw slides a tiny fish icon across your taskbar. It\'s snack time.' },
];
let activeMood = 'happy';

function initMoods() {
  const grid = document.getElementById('mood-grid');
  MOODS.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'mood-btn' + (m.key === activeMood ? ' active' : '');
    btn.id = 'mood-' + m.key;
    btn.style.setProperty('--c', m.color);
    btn.innerHTML = `<span style="font-size:18px">${m.emoji}</span><span>${m.label}</span>`;
    btn.onclick = () => setMood(m.key);
    grid.appendChild(btn);
  });
  renderMood(activeMood);
}

function setMood(key) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('mood-' + key)?.classList.add('active');
  activeMood = key;
  renderMood(key);
}

function renderMood(key) {
  const m = MOODS.find(x => x.key === key);
  if (!m) return;
  document.getElementById('mood-title').textContent = m.emoji + ' ' + m.label.toUpperCase();
  document.getElementById('mood-title').style.color = m.color;
  document.getElementById('mood-desc').textContent = m.desc;
  cats.mood?.setState(m.state, 0);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// HERO PET CLICK
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let heroPetCount = 0;
const HERO_BUBBLES = [
  'Purrrr â™¥','Mrow!','*blinks slowly*','Pet me again!','...I love you.','Mmmm â™¥','*kneads invisible bread*','You\'re my favorite human.',
];

function handleHeroPetClick(e) {
  heroPetCount++;
  spawnParticles(e.clientX, e.clientY);
  cats.hero?.setState('happy', 1200);
  const msg = HERO_BUBBLES[heroPetCount % HERO_BUBBLES.length];
  const b = document.getElementById('hero-bubble');
  if (b) { b.textContent = msg; b.style.opacity=1; }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// DEMO CONTROLS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let demoPetCount = 0;
const DEMO_BUBBLES = [
  'Mrow! â™¥','*purrs*','Feed me!','*kneads air*','Best human!','Again! Again!','*headbutt*','Mmmm fish!',
];

function handleDemoClick(e) {
  demoPetCount++;
  spawnParticles(e.clientX, e.clientY, 8);
  cats.demo?.setState('happy', 1500);
  const el = document.getElementById('demo-pet-count');
  if (el) el.textContent = demoPetCount;
  updateDemoBubble(DEMO_BUBBLES[demoPetCount % DEMO_BUBBLES.length]);
  updateDemoMood('Happy');
}

function feedPet() {
  spawnParticles(null, null, 10, ['ðŸŸ','ðŸ ','ðŸ–']);
  cats.demo?.setState('happy', 2000);
  updateDemoBubble('ðŸŸ FISH!! Thank you!!');
  updateDemoMood('Ecstatic');
  showToast('ðŸŸ PixelPaw has been fed!');
}

function playPet() {
  cats.demo?.setState('happy', 2500);
  updateDemoBubble('âš¡ Zoooooom!!');
  updateDemoMood('Excited');
  spawnParticles(null, null, 12, ['â˜…','âœ¿','â™ª','âš¡']);
}

function sleepPet() {
  cats.demo?.setState('sleep', 0);
  updateDemoBubble('ðŸ’¤ zzzz...');
  updateDemoMood('Sleepy');
}

function excitePet() {
  cats.demo?.setState('happy', 3000);
  updateDemoBubble('âš¡âš¡ !!!');
  updateDemoMood('OVERJOYED');
  spawnParticles(null, null, 20, ['âš¡','â˜…','â™¥','âœ¿','ðŸŽ‰']);
}

function updateDemoBubble(msg) {
  const el = document.getElementById('demo-bubble');
  if (el) el.textContent = msg;
}
function updateDemoMood(mood) {
  const el = document.getElementById('demo-mood-label');
  if (el) el.textContent = mood;
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// POMODORO TIMER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let pomSeconds = 25 * 60;
let pomRunning = false;
let pomInterval = null;
let pomXP = 0;
const POM_TOTAL = 25 * 60;

function setupPomTimer() { renderPom(); }

function togglePom() {
  pomRunning = !pomRunning;
  const btn = document.getElementById('pom-start');
  if (pomRunning) {
    btn.textContent = 'â¸ Pause';
    cats.pom?.setState('idle');
    pomInterval = setInterval(() => {
      pomSeconds--;
      if (pomSeconds <= 0) {
        pomSeconds = 0;
        clearInterval(pomInterval);
        pomRunning = false;
        btn.textContent = 'â–¶ Start';
        pomXP += 25;
        document.getElementById('pom-xp').textContent = pomXP + ' XP';
        cats.pom?.setState('happy', 3000);
        showToast('ðŸ… Session done! +25 XP âœ¨');
      }
      renderPom();
    }, 1000);
  } else {
    clearInterval(pomInterval);
    document.getElementById('pom-start').textContent = 'â–¶ Start';
    cats.pom?.setState('idle');
  }
}

function resetPom() {
  clearInterval(pomInterval);
  pomRunning = false;
  pomSeconds = POM_TOTAL;
  document.getElementById('pom-start').textContent = 'â–¶ Start';
  renderPom();
}

function renderPom() {
  const m = Math.floor(pomSeconds / 60).toString().padStart(2,'0');
  const s = (pomSeconds % 60).toString().padStart(2,'0');
  document.getElementById('pom-time').textContent = `${m}:${s}`;
  const prog = 1 - pomSeconds / POM_TOTAL;
  const ring = document.getElementById('pom-ring');
  const hue = Math.round(prog * 120);
  ring.style.borderTopColor = `hsl(${hue + 10},70%,55%)`;
  const lbl = document.getElementById('pom-label');
  if (pomSeconds === POM_TOTAL) lbl.textContent = 'Focus session';
  else if (pomRunning) lbl.textContent = `${Math.round(prog*100)}% complete`;
  else lbl.textContent = 'Paused';
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PRICING
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let hasCoffee = false;
function toggleCoffee() {
  hasCoffee = !hasCoffee;
  const toggle = document.getElementById('coffee-toggle');
  const check = document.getElementById('coffee-check');
  const total = document.getElementById('price-total');
  toggle.classList.toggle('checked', hasCoffee);
  check.textContent = hasCoffee ? 'âœ“' : '';
  total.textContent = hasCoffee ? '$6.80' : '$4.90';
}
function handleBuy() {
  showToast('â˜• Thanks for supporting PixelPaw! â™¥');
  cats.hero?.setState('happy', 3000);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// PARTICLES
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
const DEFAULT_CHARS = ['â™¥','â˜…','âœ¿','â™ª','Â·'];
function spawnParticles(x, y, count = 8, chars = DEFAULT_CHARS) {
  const ex = x ?? window.innerWidth/2;
  const ey = y ?? window.innerHeight/2;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    el.textContent = chars[Math.floor(Math.random() * chars.length)];
    el.style.left = ex + 'px';
    el.style.top = ey + 'px';
    el.style.color = ['#E8B86D','#D97757','#7EA16B','#F6E8C3','#ffffff'][Math.floor(Math.random()*5)];
    const dx = (Math.random() - 0.5) * 120;
    const dy = -(30 + Math.random() * 80);
    el.style.setProperty('--dx', dx + 'px');
    el.style.setProperty('--dy', dy + 'px');
    el.style.animationDuration = (.6 + Math.random() * .5) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  }
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// TOAST
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  const m = document.getElementById('toast-msg');
  if (!t || !m) return;
  m.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CUSTOM CURSOR
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function setupCustomCursor() {
  const cursor = document.getElementById('cursor');
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    // make hero cat lazily follow
    if (cats.hero) {
      // just set state briefly when moving fast
    }
  });
  document.querySelectorAll('a,button,.cat-card,.acc-btn,.mood-btn,.feat-card,.coffee-addon').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('big'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
  });
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SCROLL REVEAL
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
function setupReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// HERO CAT BUBBLE AUTO-CYCLE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let bubbleIdx = 0;
const IDLE_BUBBLES = ['Mrow! âœ¨','*yawns*','Pet me! â™¥','...watching you work','I believe in you!','*slow blink*'];
setInterval(() => {
  if (heroPetCount === 0) {
    bubbleIdx = (bubbleIdx + 1) % IDLE_BUBBLES.length;
    const b = document.getElementById('hero-bubble');
    if (b) b.textContent = IDLE_BUBBLES[bubbleIdx];
    cats.hero?.setState('idle');
  }
}, 4000);

// hero pet bob animation
document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('hero-pet-wrap');
  if (wrap) {
    let t = 0;
    setInterval(() => {
      t += 0.1;
      wrap.style.transform = `translateY(${Math.sin(t)*5}px)`;
    }, 50);
  }
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// KEYBOARD REACTIONS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let lastKeyTime = 0;
document.addEventListener('keydown', () => {
  const now = Date.now();
  if (now - lastKeyTime > 100) {
    cats.demo?.setState('happy', 400);
    lastKeyTime = now;
  }
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// SCROLL REACTIONS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let scrollTimer = null;
window.addEventListener('scroll', () => {
  cats.nav?.setState('happy', 300);
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => cats.nav?.setState('idle'), 400);
});
