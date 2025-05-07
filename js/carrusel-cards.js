window.addEventListener("load", () => {
  const container = document.querySelector(".slider-carrusel-wrapper");
  const slider = container.querySelector(".slider-carrusel");

  // Clonar tarjetas 4 veces para el loop infinito
  const cards = Array.from(slider.children);
  for (let i = 0; i < 4; i++) {
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      slider.appendChild(clone);
    });
  }

  // Esperar un frame para asegurarse de que los clones se rendericen
  requestAnimationFrame(() => {
    const totalWidth = slider.scrollWidth / 4; // Ajustar a 4 repeticiones

    // GSAP animación infinita
    const tween = gsap.to(slider, {
      x: `-${totalWidth}px`,
      duration: 40,
      ease: "linear",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      },
      paused: false
    });

    // Variables para el drag manual y la inercia
    let isDown = false;
    let startX;
    let scrollLeft;
    let velocity = 0;
    let lastTime = 0;
    
    container.addEventListener("mousedown", (e) => {
      isDown = true;
      container.classList.add("dragging");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      tween.pause();
      lastTime = Date.now(); // Iniciar el seguimiento de tiempo
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
      
      // Calcular la velocidad final para inercia
      const timeDiff = Date.now() - lastTime;
      velocity = (scrollLeft - container.scrollLeft) / timeDiff;
      applyInertia(); // Aplicar inercia
    });

    container.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;

      // Actualizar el tiempo y la velocidad durante el movimiento
      const timeDiff = Date.now() - lastTime;
      if (timeDiff > 0) {
        velocity = (scrollLeft - container.scrollLeft) / timeDiff;
        lastTime = Date.now();
      }
    });

    // Función para aplicar la inercia después de soltar el mouse
    function applyInertia() {
      gsap.to(container, {
        scrollLeft: container.scrollLeft + velocity * 200, // Ajusta la cantidad de inercia
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          // Volver a iniciar la animación de GSAP después de la inercia
          tween.play();
        }
      });
    }
  });
});
