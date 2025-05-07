   // Animación Video
   const section = document.querySelector('.section-video');
   const wrapper = section.querySelector('.video-wrapper');
 
   window.addEventListener('scroll', () => {
     const rect = section.getBoundingClientRect();
     const windowHeight = window.innerHeight;
 
     if (rect.top < windowHeight && rect.bottom > 0) {
       const scrollProgress = 1 - (rect.top / windowHeight);
       const progress = Math.min(Math.max(scrollProgress, 0), 1);
 
       const scale = 0.5 + (progress * 0.5);
 
       wrapper.style.transform = `scale(${scale})`;
     }
   });
 
 