// ---------- Animated DNA in the opening section ----------

const canvas = document.querySelector("#genome-canvas");
const context = canvas.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let canvasWidth = 0;
let canvasHeight = 0;
let animationFrame = 0;

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = canvas.clientWidth;
  canvasHeight = canvas.clientHeight;

  canvas.width = canvasWidth * pixelRatio;
  canvas.height = canvasHeight * pixelRatio;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function drawGenome(time = 0) {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  const compactScreen = canvasWidth < 780;
  const centerX = compactScreen ? canvasWidth * 0.72 : canvasWidth * 0.77;
  const strandHeight = compactScreen ? canvasHeight * 0.62 : canvasHeight * 0.84;
  const amplitude = compactScreen ? 48 : Math.min(canvasWidth * 0.09, 130);
  const startY = (canvasHeight - strandHeight) / 2;
  const points = compactScreen ? 28 : 42;
  const phase = prefersReducedMotion.matches ? 0 : time * 0.00065;

  for (let index = 0; index < points; index += 1) {
    const progress = index / (points - 1);
    const y = startY + progress * strandHeight;
    const wave = progress * Math.PI * 5 + phase;
    const xOne = centerX + Math.sin(wave) * amplitude;
    const xTwo = centerX + Math.sin(wave + Math.PI) * amplitude;
    const depth = (Math.cos(wave) + 1) / 2;

    context.beginPath();
    context.moveTo(xOne, y);
    context.lineTo(xTwo, y);
    context.strokeStyle = `rgba(197, 232, 247, ${0.16 + depth * 0.34})`;
    context.lineWidth = 1.2 + depth * 1.8;
    context.stroke();

    context.beginPath();
    context.arc(xOne, y, 2.2 + depth * 2.1, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 255, 255, ${0.38 + depth * 0.58})`;
    context.fill();

    context.beginPath();
    context.arc(xTwo, y, 2.2 + (1 - depth) * 2.1, 0, Math.PI * 2);
    context.fillStyle = `rgba(85, 191, 241, ${0.4 + (1 - depth) * 0.55})`;
    context.fill();
  }

  if (!prefersReducedMotion.matches) {
    animationFrame = window.requestAnimationFrame(drawGenome);
  }
}

function startGenomeAnimation() {
  window.cancelAnimationFrame(animationFrame);
  resizeCanvas();
  drawGenome();
}

window.addEventListener("resize", startGenomeAnimation);
prefersReducedMotion.addEventListener("change", startGenomeAnimation);
startGenomeAnimation();

// ---------- Reveal the CRISPR sequence while scrolling ----------

const processSteps = document.querySelectorAll(".process-step");

const stepObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        stepObserver.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.2
  }
);

processSteps.forEach((step) => stepObserver.observe(step));
