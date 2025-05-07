import { Application } from '@splinetool/runtime';

document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('san-endrin');
    
    const app = new Application(canvas);
    
    app
    .load('https://prod.spline.design/VkjLoeqnh6twow4i/scene.splinecode')
    .then(() => {
      const botella = app.findObjectByName('botella');
    })
    .catch((error) => {
      console.error('Error cargando la escena Spline:', error);
    });

});


