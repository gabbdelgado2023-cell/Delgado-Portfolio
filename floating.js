const canvas = document.getElementById("floatingShapes");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Generate subtle outlined shapes
const shapes = [];
const shapeTypes = ["circle", "square", "triangle", "ring"];

for (let i = 0; i < 25; i++) {
  shapes.push({
    type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 15 + Math.random() * 30,
    speedX: (Math.random() - 0.5) * 0.2,
    speedY: (Math.random() - 0.5) * 0.2,
    color:
      Math.random() > 0.5 ? "rgba(255,255,255,0.08)" : "rgba(0, 0, 0, 0.05)",
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 0.015,
  });
}

function drawShape(shape) {
  ctx.save();
  ctx.translate(shape.x, shape.y);
  ctx.rotate(shape.rotation);
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = 1.2;
  ctx.beginPath();

  switch (shape.type) {
    case "circle":
      ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
      break;
    case "square":
      ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
      break;
    case "triangle":
      ctx.moveTo(0, -shape.size / 1.5);
      ctx.lineTo(shape.size / 1.5, shape.size / 1.5);
      ctx.lineTo(-shape.size / 1.5, shape.size / 1.5);
      ctx.closePath();
      break;
    case "ring":
      ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
      break;
  }

  ctx.stroke();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const shape of shapes) {
    shape.x += shape.speedX;
    shape.y += shape.speedY;
    shape.rotation += shape.rotationSpeed;

    // Wrap around edges
    if (shape.x < 0) shape.x = canvas.width;
    if (shape.x > canvas.width) shape.x = 0;
    if (shape.y < 0) shape.y = canvas.height;
    if (shape.y > canvas.height) shape.y = 0;

    drawShape(shape);
  }

  requestAnimationFrame(animate);
}

animate();
