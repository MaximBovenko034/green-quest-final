let score = 0;
let gameInterval;
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

// Звуки
const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const startSound = document.getElementById("startSound");
const winSound = document.getElementById("winSound");

function startGame() {
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  game.innerHTML = "";
  bgMusic.play();
  startSound.play();

  gameInterval = setInterval(spawnTrash, 1500);
}

// Спавн мусора
function spawnTrash() {
  const trash = document.createElement("div");
  trash.classList.add("trash");
  trash.style.left = Math.random() * (window.innerWidth - 50) + "px";
  trash.style.top = "-60px";
  game.appendChild(trash);

  let fallInterval = setInterval(() => {
    let top = parseInt(trash.style.top);
    if (top > window.innerHeight) {
      clearInterval(fallInterval);
      trash.remove();
    } else {
      trash.style.top = top + 4 + "px";
    }
  }, 20);

  trash.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    clickSound.play();
    trash.remove();

    if (score >= 10) {
      clearInterval(gameInterval);
      winSound.play();
      alert("🎉 Ты победил!");
      bgMusic.pause();
    }
  });
}

// Параллакс
function applyParallax() {
  const bg = document.querySelector(".background");
  const trees = document.querySelector(".trees");

  let offset = 0;

  setInterval(() => {
    offset -= 1;
    bg.style.backgroundPositionX = offset * 0.3 + "px";
    trees.style.backgroundPositionX = offset + "px";
  }, 30);
}

startBtn.addEventListener("click", startGame);
applyParallax();
