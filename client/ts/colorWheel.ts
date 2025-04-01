const wheelSaturationCanvas = document.getElementById('color-wheel-saturation') as HTMLCanvasElement;
const wheelLigthnessCanvas = document.getElementById('color-wheel-lightness') as HTMLCanvasElement;
const TOTAL_COLORS = 5; // Total de colores a mostrar
const WHEEL_PROPORTION = 0.8; // Proporción de la rueda de color (80% del canvas)
let selectedColorId: number | null = 1; // Por defecto, color 1 seleccionado
const LIGHTNESS = getSelectedLightness();
const SATURATION = getSelectedSaturation();
const BACKGROUND_COLOR = "#444"; // Color de fondo del canvas

// Dibujar rueda de color
// TODO: Estudiar el cambio por un canvas para mejorar la velocidad de renderizado
// TODO: Cambiar la rueda para que se recargue cuando se mueve el tamaño de la página
//       https://www.w3schools.com/Js/js_events.asp
function drawColorWheels() {
  // Comprobar si los canvas y sus contextos existen
  if (!wheelSaturationCanvas || !wheelLigthnessCanvas) return;

  const saturationContext = wheelSaturationCanvas.getContext("2d", { willReadFrequently: false });
  const lightnessContext = wheelLigthnessCanvas.getContext("2d", { willReadFrequently: false });
  if (!saturationContext || !lightnessContext) return;

  const container = wheelSaturationCanvas.parentElement;
  if (!container) return;

  // Configurar tamaño del canvas
  const size = Math.min(container.clientWidth, container.clientHeight);
  const radius = size / 2;
  const center = { x: radius, y: radius };
  const limitedRadius = radius * WHEEL_PROPORTION;
  wheelSaturationCanvas.width = wheelLigthnessCanvas.width = size;
  wheelSaturationCanvas.height = wheelLigthnessCanvas.height = size;

  // Limpiar canvas
  saturationContext.clearRect(0, 0, size, size);
  lightnessContext.clearRect(0, 0, size, size);

  // 1. Dibujar canvas
  drawCanvasWheel(saturationContext, size, center, limitedRadius, LIGHTNESS, true);
  drawCanvasWheel(lightnessContext, size, center, limitedRadius, SATURATION, false);

  // 2. Dibujar puntos
  drawAllColorDots();
}

// Rueda de color
function drawCanvasWheel(
  ctx: CanvasRenderingContext2D,
  size: number,
  center: { x: number; y: number },
  radius: number,
  fixedValue: number,
  isSaturationWheel: boolean
) {
  const step = 3; // Incremento de píxeles
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const dx = x - center.x;
      const dy = y - center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > radius) continue;
      const angle = Math.atan2(dy, dx);
      const hue = ((angle * 180 / Math.PI) + 360) % 360;
      // Calcular saturación y luminosidad según el tipo de rueda
      let saturation, lightness;
      if (isSaturationWheel) {
        saturation = (distance / radius) * 100;
        lightness = fixedValue;
      } else {
        saturation = fixedValue;
        lightness = 100 - ((distance / radius) * 100);
      }

      // Dibujar directamente con HSL
      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.fillRect(x, y, step, step);  // Se usa rectángulo porque es más eficiente
    }
  }
  // Borde para suavizar los cortes de la rueda
  ctx.save();
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = BACKGROUND_COLOR;
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.restore();
}

// Dibujar los puntos de los colores
function drawAllColorDots() {
  const points = [];

  // Recolectar datos de todos los puntos
  for (let i = 1; i <= TOTAL_COLORS; i++) {
    const h = parseInt((document.getElementById(`hue-${i}`) as HTMLInputElement)?.value || "0");
    const s = parseInt((document.getElementById(`saturation-${i}`) as HTMLInputElement)?.value || "0");
    const l = parseInt((document.getElementById(`lightness-${i}`) as HTMLInputElement)?.value || "50");
    points.push({ h, s, l, id: i });
  }

  // Dibujar todas las líneas primero
  points.forEach(point => {
    drawColorLine(wheelSaturationCanvas, point.h, point.s, point.l, point.id);
  });

  // Dibujar puntos
  points.forEach(point => {
    drawColorDot(wheelSaturationCanvas, point.h, point.s, point.l, point.id);
  });
}

function drawColorLine(canvas: HTMLCanvasElement, hue: number, saturation: number, lightness: number, id: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = centerX * WHEEL_PROPORTION;
  const angleRad = (hue * Math.PI) / 180;
  const distance = radius * (saturation / 100);
  const x = centerX + Math.cos(angleRad) * distance;
  const y = centerY + Math.sin(angleRad) * distance;

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.restore();
}

function drawColorDot(canvas: HTMLCanvasElement, hue: number, saturation: number, lightness: number, id: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = centerX * WHEEL_PROPORTION;
  const dotRadius = radius * 0.15; // 15% del radio de la rueda
  const angleRad = (hue * Math.PI) / 180;
  const distance = radius * (saturation / 100);
  const x = centerX + Math.cos(angleRad) * distance;
  const y = centerY + Math.sin(angleRad) * distance;
  ctx.save();

  // Sombra
  ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Borde blanco
  ctx.beginPath();
  ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Relleno del punto
  ctx.beginPath();
  ctx.arc(x, y, dotRadius - 2, 0, Math.PI * 2);
  ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  ctx.fill();

  ctx.restore();
}

// Refrescar puntos en el canvas
function refreshDots() {
  if (!wheelSaturationCanvas) return;

  const ctx = wheelSaturationCanvas.getContext('2d');
  if (!ctx) return;

  drawColorWheels();
  drawAllColorDots();
}

// Actualizar colores desde el panel de edición
function setupColorUpdate(id: number) {
  // Obtener elementos
  const elements = {
    hue: document.getElementById(`hue-${id}`) as HTMLInputElement,
    hueValue: document.getElementById(`hue-value-${id}`) as HTMLInputElement,
    saturation: document.getElementById(`saturation-${id}`) as HTMLInputElement,
    saturationValue: document.getElementById(`saturation-value-${id}`) as HTMLInputElement,
    lightness: document.getElementById(`lightness-${id}`) as HTMLInputElement,
    lightnessValue: document.getElementById(`lightness-value-${id}`) as HTMLInputElement
  };

  // Validar elementos
  if (!Object.values(elements).every(el => el !== null)) {
    console.error(`Elementos para color ${id} no encontrados`);
    return;
  }

  // Variables para controlar el rendimiento
  let lastUpdate = 0;
  const UPDATE_INTERVAL = 50; // ms
  let animationFrameId: number | null = null;

  // Función para actualizar el punto
  const updateDot = () => {
    const now = Date.now();
    if (now - lastUpdate < UPDATE_INTERVAL) return;
    lastUpdate = now;

    const h = parseInt(elements.hue.value);
    const s = parseInt(elements.saturation.value);
    const l = parseInt(elements.lightness.value);

    if (isNaN(h) || isNaN(s) || isNaN(l)) return;

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(() => {
      refreshDots();
      animationFrameId = null;
    });
  };

  // Manejador de eventos optimizado
  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const isValueInput = target.id.includes('-value-');
    const type = target.id.split('-')[0] as 'hue' | 'saturation' | 'lightness';

    // Sincronizar valores
    if (isValueInput) {
      elements[type].value = target.value;
    } else {
      elements[`${type}Value`].value = target.value;
    }

    updateDot();
  };

  // Asignar eventos
  const inputs = [
    elements.hue, elements.hueValue,
    elements.saturation, elements.saturationValue,
    elements.lightness, elements.lightnessValue
  ];

  inputs.forEach(input => {
    input.addEventListener('input', handleInputChange);
  });

  // Inicialización
  updateDot();
}

// Obtener la luminosidad del color seleccionado
function getSelectedLightness(): number {
  const id = selectedColorId ?? 1;
  const lightnessInput = document.getElementById(`lightness-${id}`) as HTMLInputElement;
  return parseInt(lightnessInput?.value || '50');
}

// Obtener la saturación del color seleccionado
function getSelectedSaturation(): number {
  const id = selectedColorId ?? 1;
  const saturationInput = document.getElementById(`saturation-${id}`) as HTMLInputElement;
  return parseInt(saturationInput?.value || '50');
}

/// main
// Dibujar la rueda inicialmente con sus colores
for (let i = 1; i <= TOTAL_COLORS; i++) {
  setupColorUpdate(i);
  const container = document.getElementById(`color-container-${i}`);

  container?.addEventListener('click', () => {
    // Quitar clase "selected" de todos
    for (let j = 1; j <= TOTAL_COLORS; j++) {
      document.getElementById(`color-container-${j}`)?.classList.remove('selected');
    }

    // Añadir al seleccionado
    container.classList.add('selected');

    // Actualizar ID seleccionado si es necesario
    selectedColorId = i;
  });
}