// Конфіг
const CONFIG = {
  TRASH_COUNT: 5,
  TRASH_IMG: 'images/trash.png',
  PARALLAX_MULT_PC: 24,
  PARALLAX_MULT_MOBILE: 48,
  CLICK_REMOVE_DELAY: 300
};

// DOM
const gameArea = document.getElementById('game-area');
const startBtn = document.getElementById('start-btn');
const scoreEl = document.getElementById('score');
const winMessage = document.getElementById('win-message');
const restartBtn = document.getElementById('restart-btn');
const forestLayer = document.getElementById('forest-layer');
const treesLayer  = document.getElementById('trees-layer');

// Звуки
const bgMusic   = new Audio('bg-music.mp3');
const clickSfx  = new Audio('click-trash.mp3');
const startSfx  = new Audio('start.mp3');
const winSfx    = new Audio('win.mp3');
bgMusic.loop = true;

// Стан
let score = 0;
let isRunning = false;

// Паралакс: цільові координати (згладжування)
let targetX = 0, targetY = 0;
let smoothX = 0, smoothY = 0;
const SMOOTH_FACTOR = 0.08;
let usingGyro = false;

// Читання розміру сміття з CSS (у px)
function getTrashSizePx(){
  const val = getComputedStyle(document.documentElement).getPropertyValue('--trash-size').trim();
  const px = parseFloat(val);
  return isNaN(px) ? 64 : px;
}

// Запит дозволу на рух (iOS 13+)
function requestGyroPermissionIfNeeded(){
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    // iOS
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === 'granted') {
          // слухач додасться далі
          attachGyroListener();
        }
      })
      .catch(()=>{ /* ігноруємо */ });
  } else {
    // інші пристрої — просто додаємо слухача
    attachGyroListener();
  }
}

// Додає слухач для deviceorientation
function attachGyroListener(){
  if (usingGyro) return;
  window.addEventListener('deviceorientation', (e) => {
    // gamma: left/right tilt (-90..90), beta: front/back (-180..180)
    let gx = (e.gamma || 0) / 45; // приблизно -1..1
    let gy = (e.beta  || 0) / 45;
    // трохи зменшимо чутливість
    targetX = gx * 0.5;
    targetY = gy * 0.5;
  }, true);
  usingGyro = true;
}

// Старт/рестарт гри
function startGame(){
  // Якщо моб. браузер вимагає дозвіл для gyro, запитуємо після першого тапу
  requestGyroPermissionIfNeeded();

  score = 0;
  scoreEl.textContent = 'Score: ' + score;
  gameArea.innerHTML = '';
  winMessage.classList.remove('show');
  winMessage.setAttribute('aria-hidden','true');

  try{ startSfx.currentTime = 0; startSfx.play(); }catch(e){}

  // Вмикаємо музику лише якщо дозволено (не автоплей у мобільних)
  try{
    bgMusic.currentTime = 0;
    bgMusic.play().catch(()=>{ /* моб. браузер блокує автоплей — буде після інтерекції */ });
  }catch(e){}

  const bounds = gameArea.getBoundingClientRect();
  const size = getTrashSizePx();

  for (let i = 0; i < CONFIG.TRASH_COUNT; i++) {
    const img = document.createElement('img');
    img.src = CONFIG.TRASH_IMG;
    img.className = 'trash';
    // встановлюємо width/height атрибути для кращої продуктивності
    img.width = size;
    img.height = size;

    const maxX = Math.max(0, bounds.width - size);
    const maxY = Math.max(0, bounds.height - size);
    img.style.left = Math.random() * maxX + 'px';
    img.style.top  = Math.random() * maxY + 'px';

    // Подвійна обробка: click (desktop) і touchstart (mobile)
    const onHit = (ev) => {
      // Захищаємо від подвійного спрацьовування
      if (img.classList.contains('hit')) return;
      img.classList.add('hit');          // css-анімація (.hit -> transform/opacity)
      try{ clickSfx.currentTime = 0; clickSfx.play(); }catch(e){}
      // почекаємо анімацію, потім видалимо і рахуємо
      setTimeout(() => {
        if (img && img.parentNode) img.parentNode.removeChild(img);
      }, CONFIG.CLICK_REMOVE_DELAY || 300);

      score++;
      scoreEl.textContent = 'Score: ' + score;
      if (score === CONFIG.TRASH_COUNT) {
        winGame();
      }
      // Якщо це touch — запобігаємо "подвійний" клік
      if (ev && ev.type === 'touchstart') ev.preventDefault();
    };

    img.addEventListener('click', onHit, { passive: true });
    img.addEventListener('touchstart', onHit, { passive: false });

    gameArea.appendChild(img);
  }

  isRunning = true;
}

// Перемога
function winGame(){
  try{ bgMusic.pause(); }catch(e){}
  try{ winSfx.currentTime = 0; winSfx.play(); }catch(e){}
  winMessage.classList.add('show');
  winMessage.setAttribute('aria-hidden','false');
  isRunning = false;
}

// PARALLAX ПК (mousemove)
function onMouseMove(e){
  // clientX / width -> -0.5..0.5
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;
  // трохи посилюємо для ПК
  targetX = x * 1.0;
  targetY = y * 1.0;
}
document.addEventListener('mousemove', onMouseMove, { passive: true });

// Анімаційний цикл для плавного зміщення фонів
function animateParallax(){
  // інтерполяція (lerp) для плавності
  smoothX += (targetX - smoothX) * SMOOTH_FACTOR;
  smoothY += (targetY - smoothY) * SMOOTH_FACTOR;

  // підлаштовуємо для фонів
  const mulForest = CONFIG.PARALLAX_MULT_PC;
  const mulTrees  = CONFIG.PARALLAX_MULT_MOBILE;

  // Якщо використовується gyro (mobile), трохи зменшуємо множники
  const forestShift = smoothX * (usingGyro ? mulForest * 0.6 : mulForest);
  const forestShiftY= smoothY * (usingGyro ? mulForest * 0.6 : mulForest);
  const treesShift  = smoothX * (usingGyro ? mulTrees * 0.8 : mulTrees);
  const treesShiftY = smoothY * (usingGyro ? mulTrees * 0.8 : mulTrees);

  forestLayer.style.transform = `translate(${forestShift}px, ${forestShiftY}px)`;
  treesLayer.style.transform  = `translate(${treesShift}px, ${treesShiftY}px)`;

  requestAnimationFrame(animateParallax);
}
requestAnimationFrame(animateParallax);

// Запит дозволу на gyro при першому торканні/натисканні (для iOS)
function onFirstUserInteraction(){
  // запит дозволу, якщо потрібно
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(response => {
        if (response === 'granted') attachGyroListener();
      })
      .catch(()=>{ /* користувач відмовився або помилка */ });
  } else {
    // просте підключення для Android/інші
    attachGyroListener();
  }
  // знімаємо слухач, щоб не запитувати знову
  window.removeEventListener('touchstart', onFirstUserInteraction);
  window.removeEventListener('click', onFirstUserInteraction);
}
window.addEventListener('touchstart', onFirstUserInteraction, { passive: true });
window.addEventListener('click', onFirstUserInteraction, { passive: true });

// Додаткове: блокування pinch-zoom (на більшості браузерів)
function blockGestureZoom(e){
  if (e.touches && e.touches.length > 1) {
    e.preventDefault();
  }
}
document.addEventListener('touchstart', blockGestureZoom, { passive: false });

// Кнопки
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Якщо вкладка пішла у фон — зупиняємо музику
document.addEventListener('visibilitychange', ()=>{
  if (document.hidden) {
    try{ bgMusic.pause(); }catch(e){}
  }
});
