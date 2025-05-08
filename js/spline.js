import { Application } from '@splinetool/runtime';

const canvas = document.getElementById('canvas3d');
const app = new Application(canvas);

app.load('https://prod.spline.design/VkjLoeqnh6twow4i/scene.splinecode')
  .then(() => {
    const botella = app.findObjectByName('botella');
    console.log('Objeto botella:', botella);

    // Ejemplo: animación simple
    if (botella) {
      botella.rotation.y += Math.PI / 4;
    }
  })
  .catch((err) => {
    console.error('Error al cargar la escena:', err);
  });
