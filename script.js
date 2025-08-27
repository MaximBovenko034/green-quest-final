// --- звуки ---
const sounds = {
  bg: new Audio('bg-music.mp3'),
  click: new Audio('click-trash.mp3'),
  start: new Audio('start.mp3'),
  win: new Audio('win.mp3'),
};

// зацикливаем фоновую музыку
sounds.bg.loop = true;

// --- элементы интерфейса ---
const startBtn = document.getElementById('startBtn');
const gameArea = document.getElementById('gameArea');
const message = document.getElementById('message');
const scoreSpan = document.getElementById('score');
const targetSpan = document.getElementById('target');

// --- игровые переменные ---
let score = 0;
let targetScore = 0; // сколько всего мусора
let started = false;

// --- функция обновления счёта ---
function updateScore() {
  scoreSpan.textContent = score;
}

// --- функция победы ---
function winGame() {
  started = false;

  // остановить фоновую музыку
  sounds.bg.pause();
  sounds.bg.currentTime = 0;

  // звук победы
  sounds.win.currentTime = 0;
  sounds.win.play();

  // сообщение
  message.textContent = '🎉 Победа! Ты очистил ліс!';
  message.classList.remove('hidden');
  message.style.background = 'rgba(0,150,0,0.7)';
  message.style.fontSize = '22px';
}

// --- запуск игры ---
startBtn.addEventListener('click', function () {
  // сброс состояния
  started = true;
  score = 0;
  updateScore();

  // звук старта
  sounds.start.currentTime = 0;
  sounds.start.play();

  // запуск фоновой музыки
  sounds.bg.currentTime = 0;
  sounds.bg.play().catch(err => {
    console.log('Музыка не стартанула автоматически:', err);
  });

  // показать сообщение
  message.textContent = 'Гра почалася! Убирай сміття 🙂';
  message.classList.remove('hidden');
  setTimeout(() => message.classList.add('hidden'), 3000);

  // найти все мусорные элементы
  const trashes = document.querySelectorAll('.trash');
  targetScore = trashes.length;
  targetSpan.textContent = targetScore;

  // очистить прошлые обработчики и добавить новые
  trashes.forEach(trash => {
    trash.style.display = 'block'; // показать мусор снова
    const newTrash = trash.cloneNode(true); // клонируем чтобы убрать старый listener
    trash.parentNode.replaceChild(newTrash, trash);

    newTrash.addEventListener('click', function () {
      if (!started) return;

      // звук клика
      sounds.click.currentTime = 0;
      sounds.click.play();

      // скрыть мусор
      newTrash.style.display = 'none';

      // увеличить очки
      score++;
      updateScore();

      // проверка на победу
      if (score >= targetScore) {
        winGame();
      }
    });
  });
});
