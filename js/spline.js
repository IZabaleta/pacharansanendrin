const splineViewer = document.getElementById('splineViewer');

// Desactivar la rotación de la cámara y el zoom
splineViewer.addEventListener('load', () => {
  const viewer = splineViewer.shadowRoot.querySelector('canvas');
  if (viewer) {
    // Prevenir el zoom con la ruedita del ratón
    viewer.addEventListener('wheel', (event) => {
      event.preventDefault();  // Desactiva el zoom
    }, { passive: false });

    // Prevenir la rotación de la cámara
    viewer.addEventListener('mousedown', (event) => {
      event.preventDefault();  // Desactiva la rotación al hacer clic y mover
    });
  }
});
