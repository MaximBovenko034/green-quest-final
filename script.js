(function(){
  // --- настройки ---
  const parallaxRoot = document.getElementById('parallax-root');
  const layers = Array.from(document.querySelectorAll('.bg-layer'));
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('startBtn');
  const message = document.getElementById('message');

  // resize canvas на весь экран
  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Парллакс: движение слоёв по положению мыши
  document.addEventListener('mousemove', function(e){
    const w = window.innerWidth, h = window.innerHeight;
    const cx = (e.clientX - w/2) / (w/2); // -1..1
    const cy = (e.clientY - h/2) / (h/2);
    layers.forEach(layer=>{
      const depth = parseFloat(layer.getAttribute('data-depth') || '0.1');
      const tx = cx * depth * 20; // множитель глубины
      const ty = cy * depth * 12;
      layer.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${1 + depth*0.02})`;
    });
  });

  // Парллакс на прокрутку: немного смещаем слои при скролле
  window.addEventListener('scroll', function(){
    const sc = window.scrollY;
    layers.forEach(layer=>{
      const depth = parseFloat(layer.getAttribute('data-depth') || '0.1');
      layer.style.transform = `translate3d(0, ${-sc * depth * 0.15}px, 0)`;
    });
  }, {passive:true});

  // Простые частицы (canvas) — при клике на trash
  const particles = [];
  function createParticles(x,y, count=18){
    for(let i=0;i<count;i++){
      particles.push({
        x, y,
        vx: (Math.random()-0.5) * 6,
        vy: (Math.random()-0.8) * 6,
        life: 60 + Math.random()*40,
        size: 3 + Math.random()*4,
        color: `rgba(255,255,255,${0.6+Math.random()*0.4})`
      });
    }
  }

  function updateParticles(){
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.vy += 0.12; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if(p.life <= 0 || p.y > canvas.height + 50) particles.splice(i,1);
    }
  }

  function drawParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of particles){
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.size * Math.max(0, p.life/100 + 0.2), 0, Math.PI*2);
      ctx.fill();
    }
  }

  // анимационный цикл
  function loop(){
    updateParticles();
    drawParticles();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // вешаем обработчики на все элементы с классом clickable (trash)
  function bindClickables(){
    const items = document.querySelectorAll('.clickable');
    items.forEach(el=>{
      el.addEventListener('click', function(ev){
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        createParticles(cx, cy, 30);
        // визуальное исчезновение элемента
        el.style.transition = 'transform .35s ease, opacity .35s ease';
        el.style.transform = 'scale(0.25) rotate(-10deg)';
        el.style.opacity = '0';
        // через 400ms убираем из DOM чтобы не мешало
        setTimeout(()=>{ if(el.parentNode) el.parentNode.removeChild(el); }, 450);
      });
    });
  }
  bindClickables();

  // старт кнопки — пример простого показа сообщения
  startBtn.addEventListener('click', function(){
    message.textContent = 'Игра началась! Убирай мусор кликая по нему 🙂';
    message.classList.remove('hidden');
    setTimeout(()=> message.classList.add('hidden'), 4000);
  });

  // Функция, которая гарантирует что фон существует
  function ensureBackgroundExists(){
    // пробуем загрузить основной фон. Если 404 — показываем сообщение.
    const img = new Image();
    img.onload = ()=> { /* всё ок */ };
    img.onerror = ()=> {
      console.warn('Background image not found: images/forest-background.jpg. Please upload it to /images/');
      // подсказка юзеру (в devtools видно)
      message.textContent = 'Внимание: фон не найден. Загрузите images/forest-background.jpg в репозиторий.';
      message.classList.remove('hidden');
      setTimeout(()=> message.classList.add('hidden'), 6000);
    };
    img.src = 'images/forest-background.jpg';
  }
  ensureBackgroundExists();

  // Дополнительная полезная проверка в консоли (чтоб легко понять причину)
  console.log('%cGreen Quest: parallax & particles loaded', 'color: lightgreen; background: #002200; padding:3px');

})();
