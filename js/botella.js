let botella;
let rotY = 0;
let autoRotY = 0; 
let dragRotX = 0;
let dragRotY = 0;
let dragInertiaX = 0;
let dragInertiaY = 0;
let isDragging = false;
let lastMouseX, lastMouseY;

function preload() {
  botella = loadModel('./imgs/pacharan_san_endrin.obj', true);
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('botella-pacharan');
  noStroke();

  gsap.registerPlugin(ScrollTrigger);

  gsap.to({}, {
    scrollTrigger: {
      trigger: "section-hero",
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        rotY = radians(self.progress * 720);
      }
    }
  });

  gsap.to(botella, {
    scrollTrigger: {
      trigger: "#botella-pacharan",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onEnter: () => {
        gsap.to(botella.scale, {x: 1, y: 1, z: 1, ease: "expo.inOut"});
        gsap.to(botella.rotation, {x: Math.PI * 2, ease: "expo.inOut"});
      },
      onLeave: () => {
        gsap.to(botella.scale, {x: 0, y: 0, z: 0, ease: "expo.out"});
        gsap.to(botella.rotation, {x: Math.PI, ease: "expo.out"});
      },
    }
  });
}

function draw() {
  clear();

  if (botella) {
    ambientLight(150);
    directionalLight(255, 255, 255, 0, 1, -1);

    // Autogiro suave
    autoRotY += 0.005;

    // Aplicar inercia si no estamos arrastrando
    if (!isDragging) {
      dragRotY += dragInertiaX;
      dragRotX += dragInertiaY;

      // Frenar inercia suavemente
      dragInertiaX *= 0.95;
      dragInertiaY *= 0.95;
    }

    rotateX(PI + dragRotX);
    rotateY(PI + rotY + autoRotY + dragRotY);

    let scaleFactor;
    if (windowWidth > 1200) {
      scaleFactor = Math.min(windowWidth / 1600, windowHeight / 1000); 
      scaleFactor = Math.max(scaleFactor, 1.4); 
    } else if (windowWidth > 768) {
      scaleFactor = Math.min(windowWidth / 1024, windowHeight / 768); 
      scaleFactor = Math.max(scaleFactor, 0.6); 
    } else {
      scaleFactor = Math.min(windowWidth / 480, windowHeight / 800);  
      scaleFactor = Math.max(scaleFactor, 0.7); 
    }

    scale(scaleFactor * 2.4); 
    model(botella);
  } else {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Cargando el modelo...", 0, 0);
  }
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseDragged() {
  let deltaX = mouseX - lastMouseX;
  let deltaY = mouseY - lastMouseY;

  dragRotY += deltaX * 0.01;
  dragRotX += deltaY * 0.01;

  dragInertiaX = deltaX * 0.01;
  dragInertiaY = deltaY * 0.01;

  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
