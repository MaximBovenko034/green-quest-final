// Конфигурация
const CONFIG = {
  TRASH_COUNT: 5,
  TRASH_IMG: 'images/trash.png'
};

// DOM элементы
const gameArea = document.getElementById("game-area");
const startBtn = document.getElementById("start-btn");
const scoreEl = document.getElementById("score");
const winMessage = document.getElementById("win-message");
const restartBtn = document.getElementById("restart-btn");
const forestLayer = document.getElementById("forest-layer");
const treesLayer = document.getElementById("trees-layer");

// Звуки
const bgMusic = new Audio("bg-music.mp3");
const clickSound = new Audio("click-trash.mp3");
const startSound = new Audio("start.mp3");
const winSound = new Audio("win.mp3");

bgMusic.loop = true;

let score = 0;
let parallaxX = 0, parallaxY = 0;

// Старт игры
function startGame() {
  score = 0;
  scoreEl.textContent = "Score: " + score;
  gameArea.innerHTML = "";
  winMessage.classList.remove("show");

  startSound.play();
  bgMusic.currentTime = 0;
  bgMusic.play();

  for (let i = 0; i < CONFIG.TRASH_COUNT; i++) {
    createTrash();
  }
}

// Создание мусора
function createTrash() {
  const trash = document.createElement("img");
  trash.src = CONFIG.TRASH_IMG;
  trash.classList.add("trash");

  const gameRect = gameArea.getBoundingClientRect();
  const size = parseInt(getComputedStyle(trash).width);
  trash.style.left = Math.random() * (gameRect.width - size) + "px";
  trash.style.top = Math.random() * (gameRect.height - size) + "px";

  trash.addEventListener("click", () => {
    trash.classList.add("clicked");
    clickSound.play();
    setTimeout(() => trash.remove(), 300);
    score++;
    scoreEl.textContent = "Score: " + score;

    if (score === CONFIG.TRASH_COUNT) {
      winGame();
    }
  });

  gameArea.appendChild(trash);
}

// Победа
function winGame() {
  bgMusic.pause();
  winSound.play();
  winMessage.classList.add("show");
}

// Параллакс для ПК
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;
  parallaxX = x;
  parallaxY = y;
});

// Параллакс для телефонов (гироскоп)
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", (e) => {
    const x = e.gamma / 45; // наклон влево/вправо
    const y = e.beta / 45;  // наклон вперёд/назад
    parallaxX = x * 0.5;
    parallaxY = y * 0.5;
  }, true);
}

// Анимация параллакса
function animateParallax() {
  forestLayer.style.transform = `translate(${parallaxX * 30}px, ${parallaxY * 30}px)`;
  treesLayer.style.transform = `translate(${parallaxX * 60}px, ${parallaxY * 60}px)`;
  requestAnimationFrame(animateParallax);
}
animateParallax();

// Кнопки
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

// Блокировка масштабирования на мобильных
document.addEventListener('touchmove', function(event) {
  if (event.scale !== 1) {
    event.preventDefault();
  }
}, { passive: false });
