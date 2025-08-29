let score = 0;
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const startSound = document.getElementById("startSound");
const winSound = document.getElementById("winSound");

let trashCount = 5;

// Функція старту гри
startBtn.addEventListener("click", async () => {
  score = 0;
  scoreEl.textContent = "Score: 0";
  game.innerHTML = "";

  // запуск звуків
  try {
    await startSound.play();
    await bgMusic.play();
  } catch (e) {
    console.log("Автовідтворення заблоковане, але звук запуститься після кліку.");
  }

  spawnTrash(trashCount);
});

// Спавн сміття
function spawnTrash(count) {
  for (let i = 0; i < count; i++) {
    const trash = document.createElement("img");
    trash.src = "images/trash.png";
    trash.classList.add("trash");
    trash.style.left = Math.random() * (window.innerWidth - 60) + "px";
    trash.style.top = Math.random() * (window.innerHeight - 60) + "px";

    trash.addEventListener("click", () => {
      game.removeChild(trash);
      score++;
      scoreEl.textContent = "Score: " + score;
      clickSound.play();

      if (score === trashCount) {
        winSound.play();
        alert("You won! 🎉");
      }
    });

    game.appendChild(trash);
  }
}

// Паралакс
window.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth) - 0.5;
  const y = (e.clientY / window.innerHeight) - 0.5;

  document.querySelector(".background").style.transform =
    `translate(${x * 20}px, ${y * 20}px)`;
  document.querySelector(".trees").style.transform =
    `translate(${x * 40}px, ${y * 40}px)`;
  document.querySelector(".clouds").style.transform =
    `translate(${x * 60}px, ${y * 60}px)`;
});
