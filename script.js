// ---------------------------
//   НАСТРОЙКИ И РЕСУРСЫ
// ---------------------------
const CONFIG = {
  TRASH_COUNT: 6,            // Сколько предметов мусора за игру
  TRASH_SIZE: 68,            // Базовый размер (под стиль)
  TRASH_IMG: 'images/trash.png',
};

// Звуки (лежать в КОРНЕ рядом с index.html!)
const sounds = {
  bg:    new Audio('bg-music.mp3'),
  click: new Audio('click-trash.mp3'),
  start: new Audio('start.mp3'),
  win:   new Audio('win.mp3'),
};
sounds.bg.loop = true;
for (const key in sounds) sounds[key].preload = 'auto';

// ---------------------------
//   ЭЛЕМЕНТЫ И ПЕРЕМЕННЫЕ
// ---------------------------
const startBtn   = document.getElementById('startBtn');
const messageEl  = document.getElementById('message');
const scoreEl    = document.getElementById('score');
const targetEl   = document.getElementById('target');
const trashRoot  = document.getElementById('trash-container');
const bgLayer    = document.getElementById('bg-layer');
const forestLayer= document.getElementById('forest-layer');

let score = 0;
let target = CONFIG.TRASH_COUNT;
let started = false;

// ---------------------------
//   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ---------------------------
function setMessage(text, timeout=2500){
  messageEl.textContent = text;
  messageEl.classList.remove('hidden');
  if (timeout) setTimeout(()=>messageEl.classList.add('hidden'), timeout);
}

function updateHUD(){
  scoreEl.textContent = String(score);
  targetEl.textContent = String(target);
}

function playSafe(audio){
  try{
    audio.currentTime = 0;
    const res = audio.play();
    if (res && typeof res.then === 'function') {
      res.catch(()=>{}); // тихо игнорим блокировку автоплея
    }
  }catch(e){}
}

// Случайная позиция внутри сцены (без выхода за края)
function randomPos(){
  const pad = 20; // отступ от краёв
  const gw = trashRoot.clientWidth;
  const gh = trashRoot.clientHeight;
  const w = CONFIG.TRASH_SIZE;
  const h = CONFIG.TRASH_SIZE;
  const x = Math.random() * (gw - w - pad*2) + pad;
  const y = Math
