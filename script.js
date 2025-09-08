const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");
const hint = document.getElementById("hint");
const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");
const background = document.getElementById("background");
const trees = document.getElementById("trees");

let score = 0;
let gameInterval;
const TRASH_COUNT_TO_WIN = 10;

// Запуск игры
function startGame() {
  score = 0;
  scoreDisplay.textContent = "Score: " + score;
  bgMusic.currentTime = 0;
  bgMusic.play();

  document.querySelectorAll(".trash").forEach(t => t.remove());
  hint.classList.remove("hidden");

  clearInterval(gameInterval);
  gameInterval = setInterval(spawnTrash, 2000);
}

// Создание мусора
function spawnTrash() {
  const trash = document.createElement("div");
  trash.classList.add("trash");
  trash.style.left = Math.random() * (window.innerWidth - 64) + "px";
  trash.style.top = Math.random() * (window.innerHeight - 64) + "px";
  document.getElementById("game").appendChild(trash);

  function collectTrash() {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    clickSound.play();
    if (navigator.vibrate) navigator.vibrate(50);

    trash.classList.add("clicked");
    setTimeout(() => trash.remove(), 400);
    hint.classList.add("hidden");

    if (score >= TRASH_COUNT_TO_WIN) {
      clearInterval(gameInterval);
      winSound.play();
      bgMusic.pause();
      alert("🎉 Ви перемогли!");
    }
  }

  trash.addEventListener("click", collectTrash);
  trash.addEventListener("touchstart", collectTrash);
}

startBtn.addEventListener("click", startGame);

// Параллакс (ПК — мышь)
let targetX = 0, targetY = 0, raf = null;
function onMouseMove(e) {
  targetX = (e.clientX / window.innerWidth - 0.5) * 30;
  targetY = (e.clientY / window.innerHeight - 0.5) * 30;
  if (!raf) raf = requestAnimationFrame(applyParallax);
}
function applyParallax() {
  background.style.transform = `translate(${targetX * 0.3}px, ${targetY * 0.3}px)`;
  trees.style.transform = `translate(${targetX * 0.6}px, ${targetY * 0.6}px)`;
  raf = null;
}
document.addEventListener("mousemove", onMouseMove);

// Параллакс (мобильный — гироскоп)
if ('DeviceOrientationEvent' in window) {
  window.addEventListener("deviceorientation", e => {
    if (e.gamma !== null && e.beta !== null) {
      targetX = e.gamma;
      targetY = e.beta;
      if (!raf) raf = requestAnimationFrame(applyParallax);
    }
  });
}
