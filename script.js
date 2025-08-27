// --- Звуки ---
const sounds = {
  bg: new Audio('bg-music.mp3'),
  click: new Audio('click-trash.mp3'),
  start: new Audio('start.mp3'),
  win: new Audio('win.mp3')
};
sounds.bg.loop = true;

// --- Элементы ---
const startBtn = document.getElementById('startBtn');
const message = document.getElementById('message');
const scoreEl = document.getElementById('score');
const targetEl = document.getElementById('target');
const trashes = document.querySelectorAll('.trash');

let score = 0;
let target = trashes.length;

// обновление счёта
function updateScore() {
  scoreEl.textContent = score;
  targetEl.textContent = target;
}

// победа
function winGame() {
  sounds.bg.pause();
  sounds.bg.currentTime = 0;
  sounds.win.play();

  message.textContent = '🎉 Перемога! Ти очистив ліс!';
  message.classList.remove('hidden');
  message.style.background = 'rgba(0,150,0,0.7)';
  message.style.color = 'white';
  message.style.fontSize = '22px';
}

// старт игры
startBtn.addEventListener('click', () => {
  score = 0;
  updateScore();

  sounds.start.currentTime = 0;
  sounds.start.play();

  sounds.bg.currentTime = 0;
  sounds.bg.play().catch(err => console.log("bg music blocked:", err));

  message.textContent = 'Гра почалася! Збирай сміття!';
  message.classList.remove('hidden');
  setTimeout(() => message.classList.add('hidden'), 3000);

  // делаем весь мусор снова видимым
  trashes.forEach(t => t.style.display = 'block');
});

// клик по мусору
trashes.forEach(trash => {
  trash.addEventListener('click', () => {
    trash.style.display = 'none';
    score++;
    sounds.click.currentTime = 0;
    sounds.click.play();
    updateScore();

    if (score >= target) {
      winGame();
    }
  });
});

// начальная инициализация
updateScore();

// --- Параллакс ---
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  document.getElementById('bg-layer').style.transform = `translate(${x}px, ${y}px)`;
  document.getElementById('forest-layer').style.transform = `translate(${x * 2}px, ${y * 2}px)`;
});
