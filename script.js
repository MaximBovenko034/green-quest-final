
document.addEventListener('mousemove', e => {
  const layers = document.querySelectorAll('.layer');
  layers.forEach((layer, i) => {
    const speed = (i + 1) * 10;
    const x = (window.innerWidth - e.pageX*speed/100)/100;
    const y = (window.innerHeight - e.pageY*speed/100)/100;
    layer.style.transform = `translateX(${x}px) translateY(${y}px) scale(${1+(i*0.2)})`;
  });
});
