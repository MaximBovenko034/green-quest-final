// Конфиг
const CONFIG = {
  TRASH_COUNT: 6,
  TRASH_SIZE: 68,
  TRASH_IMG: 'images/trash.png',
};

// Элементы
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

// Настройки музыки
bgMusic.loop = true;

let score = 0;

// Старт игры
function startGame() {
  score = 0;
  scoreEl.textContent = "Score: " + score;
  gameArea.innerHTML = "";
  winMessage.style.display = "none";

  startSound.play();
  bgMusic.play();

  // Добавляем мусор
  for (let i = 0; i < CONFIG.TRASH_COUNT; i++) {
    createTrash();
  }
}

// Создание мусора
function createTrash() {
  const trash = document.createElement("img");
  trash.src = CONFIG.TRASH_IMG;
  trash.classList.add("trash");
  trash.style.left = Math.random() * (window.innerWidth - CONFIG.TRASH_SIZE) + "px";
  trash.style.top = Math.random() * (window.innerHeight - CONFIG.TRASH_SIZE) + "px";

  trash.addEventListener("click", () => {
    trash.remove();
    clickSound.play();
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
  winMessage.style.display = "flex";
}

// Параллакс-эффект
document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;

  forestLayer.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
  treesLayer.style.transform = `translate(${x * 60}px, ${y * 60}px)`;
});

// Кнопки
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
