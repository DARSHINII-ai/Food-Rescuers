const COLORS = ['123, 216, 143', '255, 184, 77', '245, 243, 238'];
const LINK_DISTANCE = 130;

export function initGrainField(canvas) {
  const ctx = canvas.getContext('2d');
  const pointer = { x: -9999, y: -9999 };
  let width = 0;
  let height = 0;
  let particles = [];

  const makeParticle = () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: 1 + Math.random() * 2.2,
    speed: 0.15 + Math.random() * 0.45,
    sway: Math.random() * Math.PI * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 0.25 + Math.random() * 0.5,
  });

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(90, Math.round((width * height) / 22000));
    particles = Array.from({ length: count }, makeParticle);
  };

  const step = (p) => {
    p.sway += 0.01;
    p.y -= p.speed;
    p.x += Math.sin(p.sway) * 0.3;

    const dx = p.x - pointer.x;
    const dy = p.y - pointer.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 140 && distance > 0) {
      p.x += (dx / distance) * 1.6;
      p.y += (dy / distance) * 1.6;
    }

    if (p.y < -10) {
      p.y = height + 10;
      p.x = Math.random() * width;
    }
  };

  const frame = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i += 1) {
      const a = particles[i];
      step(a);
      for (let j = i + 1; j < particles.length; j += 1) {
        const b = particles[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < LINK_DISTANCE) {
          ctx.strokeStyle = `rgba(123, 216, 143, ${0.14 * (1 - distance / LINK_DISTANCE)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  };

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });

  resize();
  frame();
}
