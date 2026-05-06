const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d");

let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let bolts = [];

/* pick random point ON SCREEN EDGE */
function randomEdgePoint() {
  const side = Math.floor(Math.random() * 4);

  switch (side) {
    case 0: return { x: Math.random() * w, y: 0 };        // top
    case 1: return { x: w, y: Math.random() * h };        // right
    case 2: return { x: Math.random() * w, y: h };        // bottom
    case 3: return { x: 0, y: Math.random() * h };        // left
  }
}

/* generate lightning */
function generateBolt(x, y) {
  const start = randomEdgePoint();

  const steps = 6 + Math.floor(Math.random() * 4);
  const points = [];

  let sx = start.x;
  let sy = start.y;

  points.push({ x: sx, y: sy });

  for (let i = 1; i < steps; i++) {
    const t = i / steps;

    points.push({
      x: sx + (x - sx) * t + (Math.random() - 0.5) * 160,
      y: sy + (y - sy) * t + (Math.random() - 0.5) * 160
    });
  }

  points.push({ x, y });

  bolts.push({
    points,
    life: 1
  });
}

/* trigger */
function trigger(e) {
  const x = e.clientX || (e.touches && e.touches[0].clientX);
  const y = e.clientY || (e.touches && e.touches[0].clientY);
  if (x == null || y == null) return;

  generateBolt(x, y);
}

window.addEventListener("mousedown", trigger);
window.addEventListener("touchstart", trigger);

/* render */
function draw() {
  ctx.clearRect(0, 0, w, h);

  bolts.forEach(b => {
    b.life -= 0.09;

    const a = b.life;

    /* BLUE GLOW (stronger now) */
    ctx.shadowBlur = 18;
    ctx.shadowColor = `rgba(120,200,255,${a})`;

    ctx.strokeStyle = `rgba(120,200,255,${a * 0.65})`;
    ctx.lineWidth = 1.3;

    ctx.beginPath();
    ctx.moveTo(b.points[0].x, b.points[0].y);

    for (let i = 1; i < b.points.length; i++) {
      ctx.lineTo(b.points[i].x, b.points[i].y);
    }

    ctx.stroke();

    /* YELLOW CORE (stronger warm presence) */
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `rgba(255,235,160,${a})`;
    ctx.lineWidth = 0.75;

    ctx.beginPath();
    ctx.moveTo(b.points[0].x, b.points[0].y);

    for (let i = 1; i < b.points.length; i++) {
      ctx.lineTo(b.points[i].x, b.points[i].y);
    }

    ctx.stroke();
  });

  bolts = bolts.filter(b => b.life > 0);

  requestAnimationFrame(draw);
}

draw();