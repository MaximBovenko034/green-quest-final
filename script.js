const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score");
const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

let score = 0;
let gameInterval;

// 🎵 Запуск игры
function startGame() {
  score = 0;
  scoreDisplay.textContent = "Score: " + score;
  bgMusic.currentTime = 0;
  bgMusic.play();

  clearInterval(gameInterval);
  gameInterval = setInterval(spawnTrash, 2000);
}

// 📌 Создание мусора
function spawnTrash() {
  const trash = document.createElement("div");
  trash.classList.add("trash");
  trash.style.left = Math.random() * (window.innerWidth - 50) + "px";
  trash.style.top = "-60px";
  document.getElementById("game").appendChild(trash);

  let fallInterval = setInterval(() => {
    let top = parseInt(trash.style.top);
    if (top > window.innerHeight - 50) {
      clearInterval(fallInterval);
      trash.remove();
    } else {
      trash.style.top = top + 5 + "px";
    }
  }, 50);

  function collectTrash() {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    clickSound.play();

    trash.classList.add("clicked");
    setTimeout(() => trash.remove(), 300);

    if (score >= 10) {
      clearInterval(gameInterval);
      winSound.play();
      alert("🎉 Ты победил!");
      bgMusic.pause();
    }
  }

  // ✅ Работает и на телефоне, и на ПК
  trash.addEventListener("click", collectTrash);
  trash.addEventListener("touchstart", collectTrash);
}

startBtn.addEventListener("click", startGame);

// 🌲 Параллакс
window.addEventListener("scroll", applyParallax);

function applyParallax() {
  let scrollY = window.scrollY;
  document.getElementById("background").style.transform = `translateY(${scrollY * 0.3}px)`;
  document.getElementById("trees").style.transform = `translateY(${scrollY * 0.6}px)`;
}
