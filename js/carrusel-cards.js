document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".slider-carrusel-wrapper");
  const slider = container.querySelector(".slider-carrusel");

  // Clonar cards para el loop infinito
  const cards = Array.from(slider.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    slider.appendChild(clone);
  });

  const totalWidth = slider.scrollWidth / 2;

  // GSAP animación infinita
  const tween = gsap.to(slider, {
    x: `-${totalWidth}px`,
    duration: 40,
    ease: "linear",
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
    }
  });

  // Drag manual
  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener("mousedown", (e) => {
    isDown = true;
    container.classList.add("dragging");
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    tween.pause(); // pausar animación GSAP
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
    container.classList.remove("dragging");
    tween.play(); // reanudar
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
    container.classList.remove("dragging");
    tween.play();
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5; // velocidad de drag
    container.scrollLeft = scrollLeft - walk;
  });
});
