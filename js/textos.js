gsap.registerPlugin(SplitText, ScrollTrigger);

// TITULARES
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
    duration: 2.5,
    ease: "back.out(1.7)"
  });

  titular.style.wordBreak = 'keep-all';
});

// SUBTÍTULOS
document.querySelectorAll(".subtitulo").forEach(subtitulo => {
  gsap.set(subtitulo, { opacity: 1 });

  SplitText.create(subtitulo, {
    type: "lines",
    linesClass: "line",
    autoSplit: true,
    onSplit: (self) => {
      gsap.from(self.lines, {
        scrollTrigger: {
          trigger: subtitulo,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        y: 20,
        opacity: 0,
        duration: 3.2,
        ease: "power4.out",
        stagger: 0.1
      });
    }
  });
});

// TEXTOS 
document.fonts.ready.then(() => {
  document.querySelectorAll(".texto").forEach(texto => {
    gsap.set(texto, { opacity: 1 });

    SplitText.create(texto, {
      type: "lines",
      linesClass: "line",
      autoSplit: true,
      mask: "lines",
      onSplit: (self) => {
        gsap.from(self.lines, {
          scrollTrigger: {
            trigger: texto,
            start: "top 80%",
            toggleActions: "play none none none"
          },
          yPercent: 100,
          opacity: 0,
          duration: 2.6,
          stagger: 0.1,
          ease: "expo.out"
        });
      }
    });
  });
});




document.querySelectorAll('img').forEach(imagen => {
  if (!imagen.closest('.section-rituales')) {
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
  }
});
