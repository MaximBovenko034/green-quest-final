const CONFIG = {
  TRASH_COUNT: 5,
  IMG_SIZE: null,
  TRASH_IMG: 'images/trash.png',
};
const gameArea = document.getElementById('game-area');
const startBtn = document.getElementById('start-btn');
const scoreEl = document.getElementById('score');
const winMessage = document.getElementById('win-message');
const restartBtn = document.getElementById('restart-btn');
const forestLayer = document.getElementById('forest-layer');
const treesLayer  = document.getElementById('trees-layer');

const bgMusic   = new Audio('bg-music.mp3');
const clickSfx  = new Audio('click-trash.mp3');
const startSfx  = new Audio('start.mp3');
const winSfx    = new Audio('win.mp3');
bgMusic.loop = true;

let score = 0;
let isRunning = false;
let targetX = 0, targetY = 0;
let rafId = null;

function readTrashSize(){
  const val = getComputedStyle(document.documentElement).getPropertyValue('--trash-size').trim();
  const px = parseFloat(val);
  CONFIG.IMG_SIZE = isNaN(px) ? 64 : px;
}

function startGame(){
  readTrashSize();
  score = 0;
  scoreEl.textContent = 'Score: ' + score;
  gameArea.innerHTML = '';
  winMessage.classList.remove('show');
  winMessage.setAttribute('aria-hidden','true');
  try{ startSfx.currentTime = 0; startSfx.play(); }catch(e){}
  try{ bgMusic.currentTime = 0; bgMusic.play(); }catch(e){}

  const bounds = gameArea.getBoundingClientRect();
  for(let i=0;i<CONFIG.TRASH_COUNT;i++){
    const img = document.createElement('img');
    img.src = CONFIG.TRASH_IMG;
    img.className = 'trash';
    img.width = CONFIG.IMG_SIZE;
    img.height = CONFIG.IMG_SIZE;

    const maxX = bounds.width - CONFIG.IMG_SIZE;
    const maxY = bounds.height - CONFIG.IMG_SIZE;
    img.style.left = Math.max(0, Math.random()*maxX) + 'px';
    img.style.top  = Math.max(0, Math.random()*maxY) + 'px';

    const onHit = () => {
      img.classList.add('hit');
      try{ clickSfx.currentTime = 0; clickSfx.play(); }catch(e){}
      setTimeout(() => { img.remove(); }, 450);
      score++;
      scoreEl.textContent = 'Score: ' + score;
      if(score === CONFIG.TRASH_COUNT){
        winGame();
      }
    };
    img.addEventListener('click', onHit, { passive:true });
    img.addEventListener('touchstart', (e)=>{ e.preventDefault(); onHit(); }, { passive:false });

    gameArea.appendChild(img);
  }
  isRunning = true;
}

function winGame(){
  try{ bgMusic.pause(); }catch(e){}
  try{ winSfx.currentTime = 0; winSfx.play(); }catch(e){}
  winMessage.classList.add('show');
  winMessage.setAttribute('aria-hidden','false');
  isRunning = false;
}

// Параллакс — ПК мышь
function onMouseMove(e){
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;
  targetX = x; targetY = y;
  if(!rafId) rafId = requestAnimationFrame(applyParallax);
}

// Параллакс — гироскоп мобильный
if ('DeviceOrientationEvent' in window) {
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma !== null && e.beta !== null) {
      targetX = e.gamma / 45;
      targetY = e.beta / 45;
      if(!rafId) rafId = requestAnimationFrame(applyParallax);
    }
  }, true);
}

// Применение параллакса
function applyParallax(){
  forestLayer.style.transform = `translate(${targetX*24}px, ${targetY*24}px)`;
  treesLayer.style.transform  = `translate(${targetX*48}px, ${targetY*48}px)`;
  rafId = null;
}

if (window.innerWidth > 768) {
  document.addEventListener('mousemove', onMouseMove, { passive:true });
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

document.addEventListener('visibilitychange', ()=>{
  if(document.hidden && !isRunning){
    try{ bgMusic.pause(); }catch(e){}
  }
});
