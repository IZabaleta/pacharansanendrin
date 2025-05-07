// Animaciones de textos e imágenes

// Animación para los elementos con clase .titular
document.querySelectorAll('.titular').forEach(titular => {
    const split = new SplitText(titular, { type: "words" });
  
    gsap.from(split.words, {
      scrollTrigger: {
        trigger: titular,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 50,
      stagger: 0.05,
      duration: 1.5,
      ease: "power3.out"
    });
  
    // Evitar que las palabras se dividan en nuevas líneas
    titular.style.wordBreak = 'keep-all';
  });
  


  // Animación para los elementos con clase .texto
  document.querySelectorAll('.texto,.subtitulo').forEach(texto => {
    gsap.from(texto, {
      opacity: 0,
      y: 20,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: texto,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });
  });
  

  // Animación fade-in para imágenes
document.querySelectorAll('img').forEach(imagen => {
  gsap.from(imagen, {
    scrollTrigger: {
      trigger: imagen,
      start: "top 80%",
      toggleActions: "play none none none"
    },
    opacity: 0,
    y: 30,
    duration: 1.2,
    ease: "power2.out"
  });
});


