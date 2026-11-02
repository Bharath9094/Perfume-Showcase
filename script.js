const canvas = document.querySelector("#formation-canvas");
const context = canvas.getContext("2d");
const formationButtons = [...document.querySelectorAll(".formation-choice")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const notes = [
  { name: "TEA", color: "#b7834e" },
  { name: "BIRCH", color: "#dfc18d" },
  { name: "LEATHER", color: "#8f4732" },
  { name: "RESIN", color: "#bb9b54" },
  { name: "IRIS", color: "#9b7181" },
  { name: "SMOKE", color: "#82716a" },
  { name: "MOSS", color: "#6d7751" },
  { name: "AMBER", color: "#d2974d" },
];
let width = 0;
let height = 0;
let pixelRatio = 1;
let rotation = 0;
let targetRotation = 0;
let pointerDown = false;
let previousX = 0;
let activeFormation = "orbit";
let scrollProgress = 0;
let frame = 0;

function resizeCanvas() {
  const bounds = canvas.getBoundingClientRect();
  pixelRatio = Math.min(window.devicePixelRatio || 1, 1.7);
  width = bounds.width;
  height = bounds.height;
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function getPoint(index, time) {
  const count = 88;
  const t = index / count;
  const angle = t * Math.PI * 2;
  const movement = Math.sin(time * 0.0007 + index * 0.12) * 0.035;
  let x;
  let y;
  let z;

  if (activeFormation === "spiral") {
    const spiralAngle = t * Math.PI * 5 + time * 0.00035;
    const radius = 0.2 + t * 1.25;
    x = Math.cos(spiralAngle) * radius;
    y = (t - 0.5) * 1.55;
    z = Math.sin(spiralAngle) * radius;
  } else if (activeFormation === "bloom") {
    const petal = Math.cos(angle * 5);
    const radius = 0.68 + petal * 0.39 + movement;
    x = Math.cos(angle) * radius;
    y = Math.sin(angle) * radius * 0.74;
    z = Math.sin(angle * 5) * 0.43 + Math.sin(angle * 2) * 0.12;
  } else {
    const band = index % 4;
    const radius = 0.83 + band * 0.16 + movement;
    const tilt = band * 0.52;
    x = Math.cos(angle + tilt) * radius;
    y = Math.sin(angle + tilt) * radius * (0.53 + band * 0.055);
    z = Math.sin(angle * 2 + tilt) * 0.25 + (band - 1.5) * 0.12;
  }

  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  const turnedX = x * cosine - z * sine;
  const turnedZ = x * sine + z * cosine;
  const tilt = -0.13;
  const tiltedY = y * Math.cos(tilt) - turnedZ * Math.sin(tilt);
  const tiltedZ = y * Math.sin(tilt) + turnedZ * Math.cos(tilt);
  const perspective = 1 / (1.7 + tiltedZ);
  const scale = Math.min(width, height) * 0.37;

  return {
    x: width / 2 + turnedX * perspective * scale,
    y: height / 2 + tiltedY * perspective * scale,
    depth: tiltedZ,
    size: Math.max(1.2, (2.1 + (tiltedZ + 0.6) * 2.4) * perspective),
    alpha: Math.max(0.18, Math.min(0.88, 0.6 + tiltedZ * 0.34)),
  };
}

function drawBottle() {
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = Math.min(width * 0.13, height * 0.18, 82);
  const bottleWidth = scale * 1.15;
  const bottleHeight = scale * 1.62;
  const y = centerY - bottleHeight / 2;

  context.save();
  context.translate(centerX, centerY);
  context.scale(1 + scrollProgress * 0.07, 1 + scrollProgress * 0.07);
  context.translate(-centerX, -centerY);

  const bodyGradient = context.createLinearGradient(centerX - bottleWidth / 2, 0, centerX + bottleWidth / 2, 0);
  bodyGradient.addColorStop(0, "rgba(255,255,255,.78)");
  bodyGradient.addColorStop(0.16, "rgba(238,207,167,.45)");
  bodyGradient.addColorStop(0.45, "rgba(171,83,40,.35)");
  bodyGradient.addColorStop(0.78, "rgba(255,241,211,.57)");
  bodyGradient.addColorStop(1, "rgba(255,255,255,.84)");

  context.shadowColor = "rgba(80,40,25,.2)";
  context.shadowBlur = 18;
  context.fillStyle = bodyGradient;
  context.strokeStyle = "rgba(255,255,255,.92)";
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(centerX - bottleWidth / 2, y + bottleHeight * 0.24, bottleWidth, bottleHeight * 0.76, [bottleWidth * 0.29, bottleWidth * 0.29, bottleWidth * 0.21, bottleWidth * 0.21]);
  context.fill();
  context.stroke();
  context.shadowBlur = 0;

  const labelWidth = bottleWidth * 0.68;
  const labelHeight = bottleHeight * 0.29;
  const labelX = centerX - labelWidth / 2;
  const labelY = y + bottleHeight * 0.47;
  context.fillStyle = "#d9bb8a";
  context.fillRect(labelX, labelY, labelWidth, labelHeight);
  context.strokeStyle = "rgba(105,65,35,.7)";
  context.lineWidth = 1;
  context.strokeRect(labelX + 3, labelY + 3, labelWidth - 6, labelHeight - 6);
  context.fillStyle = "#58391f";
  context.textAlign = "center";
  context.font = "7px Manrope, sans-serif";
  context.fillText("É C O R C E", centerX, labelY + 12);
  context.font = "17px Georgia, serif";
  context.fillText("Cuir Brûlé", centerX, labelY + 31);

  const neckWidth = bottleWidth * 0.3;
  const capWidth = bottleWidth * 0.52;
  context.fillStyle = "#b08a48";
  context.fillRect(centerX - neckWidth / 2, y + bottleHeight * 0.15, neckWidth, bottleHeight * 0.12);
  context.fillStyle = "#ded0ad";
  context.fillRect(centerX - neckWidth / 2 - 4, y + bottleHeight * 0.24, neckWidth + 8, 5);
  const capGradient = context.createLinearGradient(centerX - capWidth / 2, 0, centerX + capWidth / 2, 0);
  capGradient.addColorStop(0, "#593b2b");
  capGradient.addColorStop(0.33, "#bd9062");
  capGradient.addColorStop(0.7, "#65442f");
  capGradient.addColorStop(1, "#39291f");
  context.fillStyle = capGradient;
  context.beginPath();
  context.roundRect(centerX - capWidth / 2, y, capWidth, bottleHeight * 0.19, capWidth * 0.4);
  context.fill();
  context.restore();
}

function render(time) {
  frame = requestAnimationFrame(render);
  if (reducedMotion && frame > 1) cancelAnimationFrame(frame);
  rotation += (targetRotation - rotation) * 0.055;
  if (!pointerDown && !reducedMotion) targetRotation += 0.0014;

  context.clearRect(0, 0, width, height);
  context.save();
  context.strokeStyle = "rgba(110,26,30,.12)";
  context.setLineDash([2, 7]);
  context.beginPath();
  context.ellipse(width / 2, height / 2, Math.min(width, height) * 0.33, Math.min(width, height) * 0.21, -0.13, 0, Math.PI * 2);
  context.stroke();
  context.setLineDash([]);
  context.restore();

  const points = Array.from({ length: 88 }, (_, index) => ({ ...getPoint(index, time), index }));

  for (let index = 0; index < points.length - 1; index += 1) {
    const point = points[index];
    const next = points[(index + 1) % points.length];
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(next.x, next.y);
    context.strokeStyle = `rgba(140,90,58,${point.alpha * 0.17})`;
    context.lineWidth = 0.7;
    context.stroke();
  }

  points.sort((a, b) => a.depth - b.depth);
  for (const point of points) {
    context.beginPath();
    context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
    context.fillStyle = notes[Math.floor(point.index / 11) % notes.length].color;
    context.globalAlpha = point.alpha;
    context.fill();
  }
  context.globalAlpha = 1;
  drawBottle();
}

canvas.addEventListener("pointerdown", (event) => {
  pointerDown = true;
  previousX = event.clientX;
  canvas.setPointerCapture(event.pointerId);
});
canvas.addEventListener("pointermove", (event) => {
  if (!pointerDown) return;
  targetRotation += (event.clientX - previousX) * 0.008;
  previousX = event.clientX;
});
canvas.addEventListener("pointerup", () => { pointerDown = false; });
canvas.addEventListener("pointercancel", () => { pointerDown = false; });

formationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFormation = button.dataset.formation;
    formationButtons.forEach((choice) => {
      const selected = choice === button;
      choice.classList.toggle("is-active", selected);
      choice.setAttribute("aria-pressed", String(selected));
    });
  });
});
formationButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.classList.contains("is-active"))));

const formationSection = document.querySelector(".formation-section");
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    scrollProgress = Math.min(1, Math.max(0, (window.innerHeight - entry.boundingClientRect.top) / (window.innerHeight + entry.boundingClientRect.height)));
  }
});
observer.observe(formationSection);
window.addEventListener("scroll", () => {
  const bounds = formationSection.getBoundingClientRect();
  scrollProgress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)));
}, { passive: true });

const resizeObserver = new ResizeObserver(resizeCanvas);
resizeObserver.observe(canvas);
resizeCanvas();
requestAnimationFrame(render);

document.querySelector(".buy-button").addEventListener("click", () => {
  document.querySelector("#formation").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
});
