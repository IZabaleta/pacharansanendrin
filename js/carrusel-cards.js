window.addEventListener("load", () => {
  const container = document.querySelector(".slider-carrusel-wrapper");
  const slider = container.querySelector(".slider-carrusel");

  // Clonar tarjetas 2 veces para el loop infinito
  const cards = Array.from(slider.children);
  for (let i = 0; i < 2; i++) {
    cards.forEach(card => {
      const clone = card.cloneNode(true);
      // Optimizar las imágenes clonadas
      const img = clone.querySelector('img');
      if (img) {
        img.loading = "lazy";
        img.decoding = "async";
      }
      slider.appendChild(clone);
    });
  }

  // Esperar a que las imágenes se carguen antes de iniciar la animación
  const images = slider.querySelectorAll('img');
  let loadedImages = 0;

  const startAnimation = () => {
    const totalWidth = slider.scrollWidth / 2; // Ajustado a 2 repeticiones

    // GSAP animación infinita
    const tween = gsap.to(slider, {
      x: `-${totalWidth}px`,
      duration: 25, // Duración ajustada
      ease: "none",
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
    let rafId = null;

    // Función para el manejo del movimiento
    const handleMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeft - walk;

        const timeDiff = Date.now() - lastTime;
        if (timeDiff > 0) {
          velocity = (scrollLeft - container.scrollLeft) / timeDiff;
          lastTime = Date.now();
        }
      });
    };

    const handleMouseDown = (e) => {
      isDown = true;
      container.classList.add("dragging");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      tween.pause();
      lastTime = Date.now();
    };

    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove("dragging");
      tween.play();
      
      const timeDiff = Date.now() - lastTime;
      velocity = (scrollLeft - container.scrollLeft) / timeDiff;
      applyInertia();
    };

    const handleMouseLeave = () => {
      if (isDown) {
        isDown = false;
        container.classList.remove("dragging");
        tween.play();
      }
    };

    // Función para la inercia
    const applyInertia = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      gsap.to(container, {
        scrollLeft: container.scrollLeft + velocity * 150,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => tween.play()
      });
    };

    // Event listeners
    container.addEventListener("mousedown", handleMouseDown, { passive: false });
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMove, { passive: false });

    // Limpiar event listeners
    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      tween.kill();
    };
  };

  // Cargar imágenes de forma asíncrona
  const loadImage = (img) => {
    return new Promise((resolve) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }
    });
  };

  // Cargar todas las imágenes en paralelo
  Promise.all(Array.from(images).map(loadImage))
    .then(() => {
      const cleanup = startAnimation();
      window.addEventListener('unload', cleanup);
    })
    .catch(() => {
      const cleanup = startAnimation();
      window.addEventListener('unload', cleanup);
    });
});
