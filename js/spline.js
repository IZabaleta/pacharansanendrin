import { Application } from '../node_modules/@splinetool/runtime/build/runtime.js';

// GSAP is already loaded via script tags in HTML
const { gsap, ScrollTrigger } = window;

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Variables para el movimiento
let currentRotation = { 
  x: -1.25159265358979,   // Valor inicial X
  y: -0.701592653589793,  // Valor inicial Y
  z: -0.991592653589793   // Valor inicial Z
};
let currentPosition = { 
  x: 0,
  y: 50,    // Valor inicial Y
  z: 0 
};
let currentScale = 1;
let totalScrollProgress = 0;

// Valores finales para la transición
const finalRotation = {
  x: 2.53840734641021,
  y: -3.14159265358979,
  z: -3.14159265358979
};
const finalPosition = {
  y: 50
};

// Function to calculate bottle scale based on viewport
function calculateBottleScale() {
  const vh = window.innerHeight;
  const targetHeight = vh * 0.3; // 30vh
  const baseScale = 2.5; // Increased base scale
  const scaleFactor = targetHeight / (vh * 0.2); // Reduced divisor to make it larger
  return baseScale * scaleFactor;
}

// Function to update bottle scale
function updateBottleScale(botellaObject) {
  if (!botellaObject) return;
  const scale = calculateBottleScale();
  botellaObject.scale.set(scale, scale, scale);
}

window.onload = () => {
  // Get the canvas element
  const canvas = document.getElementById('canvas3d');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Create a new application with minimal settings
  const app = new Application(canvas, {
    interactions: {
      hover: false,
      drag: false,
      scroll: false
    },
    camera: {
      controls: false,
      autoRotate: false,
      autoRotateSpeed: 0
    },
    animations: {
      autoPlay: false
    }
  });

  let botellaObject;
  let baseScale = calculateBottleScale();
  
  // Animation loop for continuous movement
  function animate() {
    if (botellaObject) {
      // Aplicamos todas las transformaciones con interpolación suave
      botellaObject.rotation.set(
        currentRotation.x,
        currentRotation.y,
        currentRotation.z
      );
      botellaObject.position.set(
        currentPosition.x,
        currentPosition.y,
        currentPosition.z
      );
      const finalScale = baseScale * currentScale;
      botellaObject.scale.set(finalScale, finalScale, finalScale);
    }
    requestAnimationFrame(animate);
  }

  // Load the scene
  console.log('Loading scene...');
  app.load('https://prod.spline.design/VkjLoeqnh6twow4i/scene.splinecode')
    .then(() => {
      console.log('Scene loaded successfully');
      
      // Find the bottle object
      const possibleNames = ['botella', 'Botella', 'BOTTLE', 'bottle', 'Pacharan', 'pacharan'];
      for (const name of possibleNames) {
        const obj = app.findObjectByName(name);
        if (obj) {
          console.log(`Found object with name: "${name}"`);
          botellaObject = obj;
          break;
        }
      }
      
      if (!botellaObject) {
        console.error('Bottle object not found');
        return;
      }

      // Initial scale setup
      updateBottleScale(botellaObject);

      // Start animation loop
      animate();

      // Handle window resize
      window.addEventListener('resize', () => {
        baseScale = calculateBottleScale();
      });

      // Configuración común para todas las secciones
      const sectionConfig = {
        scrub: {
          duration: 0.5, // Aumentamos la duración para más suavidad
          ease: "power2.inOut"
        },
        onUpdate: (self) => {
          // Obtener la última sección del documento
          const sections = document.querySelectorAll('section');
          const lastSection = sections[sections.length - 1];
          if (!lastSection) return;

          // Calcular el progreso basado en la posición actual del scroll
          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          
          // Calcular el punto de inicio y fin de la animación
          const startPoint = 0;
          const endPoint = lastSection.offsetTop + lastSection.offsetHeight;
          
          // Calcular el progreso normalizado (0 a 1)
          const rawProgress = (scrollPosition - startPoint) / (endPoint - startPoint);
          totalScrollProgress = Math.min(Math.max(rawProgress, 0), 1);
          
          // Aplicar una función de easing para suavizar la transición en ambas direcciones
          const easedProgress = easeInOutCubic(totalScrollProgress);
          
          // Interpolar suavemente entre los valores iniciales y finales
          const interpolate = (start, end, progress) => {
            // Asegurar que la interpolación funcione en ambas direcciones
            const diff = end - start;
            // Normalizar la diferencia para evitar saltos en la rotación
            const normalizedDiff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
            return start + normalizedDiff * progress;
          };
          
          // Aplicar interpolación a cada eje de rotación
          currentRotation.x = interpolate(currentRotation.x, finalRotation.x, easedProgress);
          currentRotation.y = interpolate(currentRotation.y, finalRotation.y, easedProgress);
          currentRotation.z = interpolate(currentRotation.z, finalRotation.z, easedProgress);
          
          // Mantener la posición Y constante
          currentPosition.y = 50;
        }
      };

      // Función de easing mejorada para ambas direcciones
      function easeInOutCubic(t) {
        // Asegurar que t esté entre 0 y 1
        t = Math.max(0, Math.min(1, t));
        // Aplicar easing en ambas direcciones con una curva más suave
        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      // Aplicar animación hasta la última sección
      gsap.to({}, {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: () => {
            const sections = document.querySelectorAll('section');
            const lastSection = sections[sections.length - 1];
            return lastSection ? `+=${lastSection.offsetTop + lastSection.offsetHeight}` : "+=100%";
          },
          ...sectionConfig
        }
      });

      // Fade out animation con soporte para scroll reverso
      if (botellaObject.material && typeof botellaObject.material.opacity !== 'undefined') {
        gsap.to(botellaObject.material, {
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: () => {
              const sections = document.querySelectorAll('section');
              const lastSection = sections[sections.length - 1];
              return lastSection ? `+=${lastSection.offsetTop + lastSection.offsetHeight}` : "+=100%";
            },
            scrub: {
              duration: 0.5,
              ease: "power2.inOut"
            },
            onUpdate: (self) => {
              // Fade out/in más gradual y suave en ambas direcciones
              const fadeStart = 0.85; // Aumentamos el punto de inicio del fade
              const fadeProgress = Math.max(0, (self.progress - fadeStart) / (1 - fadeStart));
              // Aplicar easing al fade para suavidad en ambas direcciones
              const easedFade = easeInOutCubic(fadeProgress);
              botellaObject.material.opacity = Math.max(0, 1 - easedFade);
            }
          }
        });
      } else {
        console.log('Material or opacity property not available on bottle object');
      }

      // Start the application
      app.play();
    })
    .catch((error) => {
      console.error('Error loading scene:', error);
    });
};
