document.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth - e.pageX) / 100;
  const y = (window.innerHeight - e.pageY) / 100;

  document.querySelector(".back").style.transform = `translate(${x}px, ${y}px) scale(2)`;
  document.querySelector(".middle").style.transform = `translate(${x/2}px, ${y/2}px)`;
  document.querySelector(".front").style.transform = `translate(${x/4}px, ${y/4}px) scale(0.8)`;
});
