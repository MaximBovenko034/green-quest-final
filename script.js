// ====== Parallax + частинки. Все з префіксом 'gq-' щоб не конфліктувало ======

(function () {
  const back = document.querySelector('.gq-back');
  const middle = document.querySelector('.gq-middle');
  const front = document.querySelector('.gq-front');

  // Захист: якщо блоків немає — нічого не робимо.
  if (!back || !middle || !front) return;

  // Parallax: рухаємо шари при русі миші
  // Пасивний слухач для продуктивності
  window.addEventListener('mousemove', (e) => {
    // Якщо користувач просить менше руху — не крутимо
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const x = (window.innerWidth - e.clientX) / 90;
    const y = (window.innerHeight - e.clientY) / 90;

    back.style.transform   = `translate3d(${x}px, ${y}px, 0) scale(2)`;
    middle.style.transform = `translate3d(${x/2}px, ${y/2}px, 0)`;
    front.style.transform  = `translate3d(${x/4}px, ${y/4}px, 0) scale(0.85)`;
  }, { passive: true });

  // ====== Частинки (листя) ======
  const MAX_LEAVES = 20;             // обмеження для FPS
  const MIN_INTERVAL = 900;          // мс
  const MAX_INTERVAL = 1500;         // мс
  let activeLeaves = 0;

  function spawnLeaf() {
    if (document.hidden) return; // не спавнимо на неактивній вкладці
    if (activeLeaves >= MAX_LEAVES) return;

    const leaf = document.createElement('div');
    leaf.className = 'gq-leaf';

    // Випадкові параметри: позиція, розмір, тривалість, горизонтальне коливання
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const startLeft = Math.random() * vw;
    const size = 20 + Math.random() * 22; // 20–42 px
    const duration = 7 + Math.random() * 5; // 7–12 c

    leaf.style.left = `${startLeft}px`;
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;
    leaf.style.animationDuration = `${duration}s`;

    document.body.appendChild(leaf);
    activeLeaves++;

    // Прибрати після завершення
    const remove = () => {
      leaf.remove();
      activeLeaves--;
    };
    leaf.addEventListener('animationend', remove, { once: true });
    // Запасний таймер (якщо подія не спрацює)
    setTimeout(remove, (duration + 0.5) * 1000);
  }

  // Запуск генератора листя (з повагою до reduced motion)
  function loop() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      spawnLeaf();
    }
    const next = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
    setTimeout(loop, next);
  }
  loop();

  // Якщо вкладка неактивна — не плодимо листя
  document.addEventListener('visibilitychange', () => {
    // Нічого додаткового: spawnLeaf() і так враховує document.hidden
  });
})();
