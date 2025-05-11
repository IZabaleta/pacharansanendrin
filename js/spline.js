import { Application } from '../node_modules/@splinetool/runtime/build/runtime.js';

// GSAP is already loaded via script tags in HTML
const { gsap, ScrollTrigger } = window;

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Variables para el movimiento
const initialRotation = { 
  x: -4 * (Math.PI / 180),  // Convertir -4 grados a radianes
  y: 353 * (Math.PI / 180), // Convertir 353 grados a radianes
  z: 360 * (Math.PI / 180)  // Convertir 360 grados a radianes
};
let currentRotation = { ...initialRotation };

// --- CONFIGURACIÓN DE ESCALA Y POSICIÓN ---
const CONFIG = {
  // Posición vertical (ajustada para que sea visible en la web)
  yOffset: 250,  // Volvemos a un valor que sabemos que funciona
  
  // Escalas base para cada dispositivo
  scales: {
    mobile: 2.9,    // Sin cambios
    tablet: 7.0,    // Sin cambios
    desktop: 6.5    // Sin cambios
  },
  
  // Porcentaje de altura que debe ocupar la botella en la pantalla
  heightPercentages: {
    mobile: 50,     // Sin cambios
    tablet: 66,     // Sin cambios
    desktop: 40     // Sin cambios
  },
  
  // Ajustes específicos por dispositivo
  deviceAdjustments: {
    mobile: 0.85,   // Sin cambios
    tablet: 1.0,    // Sin cambios
    desktop: 0.95   // Sin cambios
  },
  
  // Límites de escala
  scaleLimits: {
    mobile: {
      min: 2.5,     // Sin cambios
      max: 3.5      // Sin cambios
    },
    tablet: {
      min: 4.8,     // Sin cambios
      max: 8.4      // Sin cambios
    },
    desktop: {
      min: 4.5,     // Sin cambios
      max: 7.7      // Sin cambios
    }
  }
};

// --- AJUSTE: Centrado vertical ---
function getCenteredYPosition(offset = 0) {
  return offset;
}

let currentPosition = { 
  x: 0,
  y: getCenteredYPosition(CONFIG.yOffset),
  z: 0 
};
let currentScale = 1;

// Nueva variable para la posición Y fija
const fixedYPosition = getCenteredYPosition(CONFIG.yOffset);
let hasReachedFixedPosition = false;

// Valores finales para la rotación (iguales a los iniciales para mantener la misma posición)
const finalRotation = {
  x: initialRotation.x + Math.PI * 4, // Añadir dos vueltas completas (4π radianes)
  y: initialRotation.y + Math.PI * 4,
  z: initialRotation.z + Math.PI * 4
};

// Función simplificada para calcular la escala
function calculateBottleScale() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  
  // Determinar el tipo de dispositivo
  const isMobile = vw <= 768;
  const isTablet = vw > 768 && vw <= 1024;
  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  
  // Obtener configuración específica del dispositivo
  const baseScale = CONFIG.scales[deviceType];
  const heightPercentage = CONFIG.heightPercentages[deviceType] / 100;
  const deviceAdjustment = CONFIG.deviceAdjustments[deviceType];
  const { min, max } = CONFIG.scaleLimits[deviceType];
  
  // Calcular la altura objetivo
  const targetHeight = vh * heightPercentage;
  
  // Calcular la escala base
  let finalScale = (targetHeight / 1000) * baseScale;
  
  // Aplicar ajuste específico del dispositivo
  finalScale *= deviceAdjustment;
  
  // Aplicar límites de escala específicos del dispositivo
  finalScale = Math.min(Math.max(finalScale, min), max);
  
  // Log para debugging
  console.log(`Device: ${deviceType}, Scale: ${finalScale.toFixed(2)}, Viewport: ${vw}x${vh}, Height%: ${heightPercentage * 100}%`);
  
  return finalScale;
}

// Function to update bottle scale
function updateBottleScale(botellaObject) {
  if (!botellaObject) return;
  
  const scale = calculateBottleScale();
  console.log('Updating bottle scale:', scale, 'for viewport:', window.innerWidth, 'x', window.innerHeight, 
    'device type:', window.innerWidth <= 768 ? 'mobile' : window.innerWidth <= 1024 ? 'tablet' : 'desktop');
  
  // Aplicamos la escala con una transición más suave
  gsap.to(botellaObject.scale, {
    x: scale,
    y: scale,
    z: scale,
    duration: 0.8, // Aumentamos la duración para una transición más suave
    ease: "power2.inOut" // Cambiamos a inOut para una transición más suave
  });
}

window.onload = () => {
  const canvas = document.getElementById('canvas3d');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const app = new Application(canvas, {
    interactions: { hover: false, drag: false, scroll: false },
    camera: { controls: false, autoRotate: false, autoRotateSpeed: 0 },
    animations: { autoPlay: false }
  });

  let botellaObject;
  let baseScale = calculateBottleScale();
  
  // Función para la animación inicial de entrada
  function animateInitialEntry(botellaObject) {
    if (!botellaObject) return;

    // Configurar posición inicial (un poco más arriba para que sea visible)
    const startY = fixedYPosition - 100; // Reducimos la distancia inicial
    botellaObject.position.set(currentPosition.x, startY, currentPosition.z);
    
    // Configurar opacidad inicial
    if (botellaObject.material) {
      botellaObject.material.opacity = 0;
      botellaObject.material.transparent = true;
    }

    // Crear la animación de entrada
    gsap.to(botellaObject.position, {
      y: fixedYPosition,
      duration: 1.5,
      ease: "power2.out"
    });

    // Animación de fade in
    if (botellaObject.material) {
      gsap.to(botellaObject.material, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.inOut"
      });
    }
  }

  function animate() {
    if (botellaObject) {
      botellaObject.rotation.set(currentRotation.x, currentRotation.y, currentRotation.z);
      botellaObject.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
      const finalScale = baseScale * currentScale;
      botellaObject.scale.set(finalScale, finalScale, finalScale);

      // Log cada 60 frames (aproximadamente cada segundo)
      if (Math.random() < 0.016) {  // 1/60 probabilidad
        console.log('Estado actual de la botella:', {
          position: {
            x: botellaObject.position.x,
            y: botellaObject.position.y,
            z: botellaObject.position.z
          },
          rotation: {
            x: botellaObject.rotation.x * (180 / Math.PI),
            y: botellaObject.rotation.y * (180 / Math.PI),
            z: botellaObject.rotation.z * (180 / Math.PI)
          },
          scale: botellaObject.scale.x
        });
      }
    }
    requestAnimationFrame(animate);
  }

  console.log('Loading scene...');
  // Añadir timestamp para evitar caché
  const timestamp = new Date().getTime();
  app.load(`https://prod.spline.design/VkjLoeqnh6twow4i/scene.splinecode?t=${timestamp}`)
    .then(() => {
      console.log('Scene loaded successfully');
      
      // Buscar la botella
      const possibleNames = [
        'botella', 'Botella', 'BOTTLE', 'bottle', 
        'Pacharan', 'pacharan', 'Botella_Pacharan', 
        'botella_pacharan', 'Botella_Pacharan_New',
        'botella_pacharan_new'
      ];
      
      let found = false;
      for (const name of possibleNames) {
        const obj = app.findObjectByName(name);
        if (obj) {
          console.log(`Found object with name: "${name}"`);
          botellaObject = obj;
          found = true;
          break;
        }
      }

      if (!found) {
        console.error('Bottle object not found. Available objects:', app.scene.children.map(obj => obj.name));
        return;
      }

      // Aplicar la animación inicial
      animateInitialEntry(botellaObject);
      
      updateBottleScale(botellaObject);
      animate();

      // Aseguramos que la escala se actualice en los eventos de cambio de tamaño y orientación
      window.addEventListener('resize', () => {
        calculateBottleScale();
        // Añadimos un pequeño delay para asegurar que la orientación se ha actualizado
        setTimeout(calculateBottleScale, 100);
      });

      window.addEventListener('orientationchange', () => {
        // Esperamos a que la orientación se complete
        setTimeout(calculateBottleScale, 100);
      });

      const sections = document.querySelectorAll('section');
      const calculateTotalHeight = () => {
        const docHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight,
          document.body.clientHeight,
          document.documentElement.clientHeight
        );
        return docHeight + 500;
      };

      const totalHeight = calculateTotalHeight();

      // Animación principal - rotación doble vuelta
      gsap.to({}, {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: `+=${totalHeight}`,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;

            // Rotación simple y directa
            const interpolate = (start, end, progress) => {
              // Asegurar que la rotación sea suave y continua
              let diff = end - start;
              // Normalizar la diferencia para evitar saltos
              if (diff > Math.PI) diff -= Math.PI * 2;
              if (diff < -Math.PI) diff += Math.PI * 2;
              return start + diff * progress;
            };

            // Aplicar rotación
            currentRotation.x = interpolate(initialRotation.x, finalRotation.x, progress);
            currentRotation.y = interpolate(initialRotation.y, finalRotation.y, progress);
            currentRotation.z = interpolate(initialRotation.z, finalRotation.z, progress);

            // Mantener la posición Y constante en fixedYPosition
            currentPosition.y = fixedYPosition;

            // Actualizar la posición y rotación de la botella
            if (botellaObject) {
              botellaObject.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
              botellaObject.rotation.set(currentRotation.x, currentRotation.y, currentRotation.z);
              botellaObject.updateMatrix();
            }
          }
        }
      });

      // Fade out
      if (botellaObject.material && typeof botellaObject.material.opacity !== 'undefined') {
        gsap.to(botellaObject.material, {
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: `+=${totalHeight}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const fadeStart = 0.9;
              const fadeProgress = Math.max(0, (self.progress - fadeStart) / (1 - fadeStart));
              botellaObject.material.opacity = Math.max(0, Math.min(1, 1 - fadeProgress));
            }
          }
        });
      } else {
        console.log('Material or opacity property not available on bottle object');
      }

      app.play();
    })
    .catch((error) => {
      console.error('Error loading scene:', error);
    });
};
