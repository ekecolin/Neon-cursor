const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const trailLength = 20;
const trailColor = "0,255,255"; // RGB values for cyan color
const trail = [];

const particles = [];
const particleCount = 100;
const particleLifetime = 1000; // milliseconds

function draw() {
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw trail
  for (let i = 0; i < trail.length; i++) {
    const alpha = 1 - i / trail.length;
    ctx.save();
    ctx.beginPath();
    ctx.arc(trail[i].x, trail[i].y, 10, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${trailColor},${alpha})`;
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw particles
  const now = Date.now();
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    const age = now - particle.creationTime;
    if (age > particleLifetime) {
      particles.splice(i, 1); // Remove old particles
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particle.color},${1 - age / particleLifetime})`;
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      particle.x += particle.vx;
      particle.y += particle.vy;
    }
  }

  window.requestAnimationFrame(draw);
}

function addTrailPoint(x, y) {
  trail.push({ x, y });
  if (trail.length > trailLength) {
    trail.shift();
  }
}

function createFireworks(x, y) {
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 2;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const size = Math.random() * 3 + 2;
    const color = `255,${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)}`; // Random color
    particles.push({
      x,
      y,
      vx,
      vy,
      size,
      color,
      creationTime: Date.now()
    });
  }
}

let mouseX = 0,
  mouseY = 0;
const startDrawing = (e) => {
  const newX = e.clientX;
  const newY = e.clientY;
  addTrailPoint(newX, newY);
  mouseX = newX;
  mouseY = newY;
};

canvas.addEventListener("mousemove", startDrawing);
canvas.addEventListener("click", (e) => {
  createFireworks(e.clientX, e.clientY);
});

window.onload = () => {
  window.requestAnimationFrame(draw);
};
