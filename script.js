(function(){
  const layers = Array.from(document.querySelectorAll('.bg-layer'));
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('startBtn');
  const message = document.getElementById('message');
  const scoreSpan = document.getElementById('score');
  const targetSpan = document.getElementById('target');

  // --- звуки ---
  const sounds = {
    bg: new Audio('bg-music.mp3'),
    click: new Audio('click-trash.mp3'),
    start: new Audio('start.mp3'),
    win: new Audio('win.mp3'),
  };
  sounds.bg.loop = true;

  // --- очки ---
  let score = 0;
  const targetScore = 5;
  targetSpan.textContent = targetScore;

  function updateScore(){ scoreSpan.textContent = score; }

  // --- canvas resize ---
  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // --- parallax (мышь) ---
  document.addEventListener('mousemove', function(e){
    const w = window.innerWidth, h = window.innerHeight;
    const cx = (e.clientX - w/2) / (w/2);
    const cy = (e.clientY - h/2) / (h/2);
    layers.forEach(layer=>{
      const depth = parseFloat(layer.getAttribute('data-depth') || '0.1');
      const tx = cx * depth * 20;
      const ty = cy * depth * 12;
      layer.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${1 + depth*0.02})`;
    });
  });

  // --- parallax (scroll) ---
  window.addEventListener('scroll', function(){
    const sc = window.scrollY;
    layers.forEach(layer=>{
      const depth = parseFloat(layer.getAttribute('data-depth') || '0.1');
      layer.style.transform = `translate3d(0, ${-sc * depth * 0.15}px, 0)`;
    });
  }, {passive:true});

  // --- particles ---
  const particles = [];
  function createParticles(x,y,count=18){
    for(let i=0;i<count;i++){
      particles.push({
        x, y,
        vx: (Math.random()-0.5)*6,
        vy: (Math.random()-0.8)*6,
        life: 60 + Math.random()*40,
        size: 3 + Math.random()*4,
        color: `rgba(255,255,255,${0.6+Math.random()*0.4})`
      });
    }
  }
  function updateParticles(){
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      if(p.life<=0||p.y>canvas.height+50) particles.splice(i,1);
    }
  }
  function drawParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of particles){
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x,p.y,p.size*Math.max(0,p.life/100+0.2),0,Math.PI*2);
      ctx.fill();
    }
  }
  function loop(){ updateParticles(); drawParticles(); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);

  // --- клик по мусору ---
  function bindClickables(){
    const items = document.querySelectorAll('.clickable');
    items.forEach(el=>{
      el.addEventListener('click', function(){
        sounds.click.currentTime = 0;
        sounds.click.play();

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        createParticles(cx,cy,30);

        el.style.transition = 'transform .35s ease, opacity .35s ease';
        el.style.transform = 'scale(0.25) rotate(-10deg)';
        el.style.opacity = '0';
        setTimeout(()=>{ if(el.parentNode) el.parentNode.removeChild(el); }, 450);

        score++;
        updateScore();
        if(score>=targetScore) winGame();
      });
    });
  }
  bindClickables();

  // --- старт игры ---
  startBtn.addEventListener('click', function(){
    score = 0;
    updateScore();

    sounds.start.play();
    sounds.bg.currentTime = 0;
    sounds.bg.play();

    message.textContent = 'Игра началась! Убирай мусор 🙂';
    message.classList.remove('hidden');
    setTimeout(()=> message.classList.add('hidden'), 3000);
  });

  // --- победа ---
  function winGame(){
    sounds.bg.pause();
    sounds.win.play();
    message.textContent = '🎉 Победа! Ты очистил лес!';
    message.classList.remove('hidden');
    message.style.background = 'rgba(0,150,0,0.7)';
    message.style.fontSize = '22px';
  }

})();
