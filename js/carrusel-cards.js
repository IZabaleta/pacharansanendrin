window.addEventListener("load", () => {
  const container = document.querySelector(".slider-carrusel-wrapper");
  const slider = container.querySelector(".slider-carrusel");

  // Clonar tarjetas para el loop infinito
  const cards = Array.from(slider.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    slider.appendChild(clone);
  });

  // Esperar un frame para asegurarse de que los clones se rendericen
  requestAnimationFrame(() => {
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
      tween.pause();
    });

    container.addEventListener("mouseleave", () => {
      isDown = false;
      container.classList.remove("dragging");
      tween.play();
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
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    });
  });
});
