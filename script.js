
const startBtn = document.getElementById('startBtn');
const gameArea = document.getElementById('gameArea');
const scoreEl = document.getElementById('score');

let score = 0;
let totalTrash = 5;
let winSound = new Audio('win.mp3');
let clickSound = new Audio('click-trash.mp3');

function startGame() {
  score = 0;
  scoreEl.textContent = score;
  gameArea.innerHTML = '';
  for (let i = 0; i < totalTrash; i++) {
    const trash = document.createElement('div');
    trash.classList.add('trash');
    trash.style.top = Math.random() * (gameArea.clientHeight - 80) + 'px';
    trash.style.left = Math.random() * (gameArea.clientWidth - 80) + 'px';
    trash.addEventListener('click', () => {
      clickSound.play();
      trash.remove();
      score++;
      scoreEl.textContent = score;
      if (score === totalTrash) {
        winSound.play();
        alert('Вітаю! Ви прибрали все сміття!');
      }
    });
    gameArea.appendChild(trash);
  }
}

startBtn.addEventListener('click', startGame);
