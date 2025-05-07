document.addEventListener("DOMContentLoaded", () => {
    const wrappers = document.querySelectorAll(".img-wrapper");

    wrappers.forEach(wrapper => {
      Draggable.create(wrapper, {
        type: "x,y",
        edgeResistance: 0.65,
        inertia: true,
        allowContextMenu: true, 
        onPress() {
          this.startX = this.x;
          this.startY = this.y;
        },
        
      });
    });
  });