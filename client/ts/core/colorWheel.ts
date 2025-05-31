// constants
import { select, wcag, contrastS, contrastC, contrastL, colorScheme, colorblind} from "../constants/selects.js";
import { firstWheelCanvas, secondWheelCanvas } from "../constants/canvas.js";
import { hslContainers, oklchContainers } from "../constants/containers.js";
import { palette1, palette2 } from "../constants/palette.js";
import { chromaSlider1, lightSlider1, satSlider1 } from "../constants/sliders.js";

// functions
import { hslToRgb, oklchToRgb, updateExports } from "../utils/conversor.js";
import { updateSeparation } from "../handlers/schemeHandler.js";
import { createCircles, updateCircles } from "../handlers/handleCircles.js";
import { updateColorblind } from "../utils/colorblind.js";
import { availableSecondPalette } from "../utils/utils.js";

// Eventos que actualizan la página
window.addEventListener("DOMContentLoaded", () => updateSeparation());
select?.addEventListener("change", createAll);
wcag?.addEventListener("change", updateAll);
contrastL?.addEventListener("change", updateAll);
contrastS?.addEventListener("change", updateAll);
contrastC?.addEventListener("change", updateAll);
colorblind?.addEventListener("change", () => {
  updateColorblind();
  updateAll();
});
colorScheme?.addEventListener("change", () => {
  // Si el esquema acepta variaciones en la separación de los colores, que se muestre
  updateSeparation();
  // Borrar los colores de las paletas
  palette1.innerHTML = "";
  palette2.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const slot = document.getElementById(`color-${i}`);
    if (slot) {
      slot.style.backgroundColor = "";
      slot.parentElement?.classList.add("hidden");
    }
  }
  createAll();
  updateAll();
});

function drawColorWheels() {
  // Comprobar si los canvas y sus contextos existen
  if (!firstWheelCanvas || !secondWheelCanvas) return;

  const saturationContext = firstWheelCanvas.getContext("2d", { willReadFrequently: false });
  const lightnessContext = secondWheelCanvas.getContext("2d", { willReadFrequently: false });
  if (!saturationContext || !lightnessContext) return;

  const container = firstWheelCanvas.parentElement;
  if (!container) return;

  // Configurar tamaño del canvas
  const size = Math.min(container.clientWidth, container.clientHeight);
  firstWheelCanvas.width = secondWheelCanvas.width = size;
  firstWheelCanvas.height = secondWheelCanvas.height = size;

  // Limpiar canvas
  saturationContext.clearRect(0, 0, size, size);
  lightnessContext.clearRect(0, 0, size, size);

  // Comprobar si es una rueda HSL o OKHCL
  if (!select) return;
  const representation = select.value as "hsl" | "oklch";
  
  if (representation === "hsl") {
    hslContainers.forEach(container => container.style.display = "flex");
    oklchContainers.forEach(container => container.style.display = "none");
    const lightness = lightSlider1;
    const saturation = satSlider1;
    generateWheelHSL(parseInt(lightness.value), false, firstWheelCanvas);
    generateWheelHSL(parseInt(saturation.value), true, secondWheelCanvas);
    
  } else if (representation === "oklch") {
    hslContainers.forEach(container => container.style.display = "none");
    oklchContainers.forEach(container => container.style.display = "flex");
    const lightness = lightSlider1;
    const chroma = chromaSlider1;
    generateWheelOKLCH(parseInt(lightness.value), false, firstWheelCanvas);
    generateWheelOKLCH(chroma.valueAsNumber, true, secondWheelCanvas);
  }
}

function generateWheelHSL(
  value: number,
  isSaturationWheel: boolean,
  canvas: HTMLCanvasElement,
): void {
  const text = canvas.parentElement?.childNodes[1] as HTMLLabelElement;
  if (!isSaturationWheel) {
    text.innerText =  "Rueda de color Matiz-Saturación";
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rect = canvas.parentElement!.getBoundingClientRect();
  const minDimension = Math.min(rect.width, rect.height);

  // Ajustar el tamaño con un margen opcional
  const size = 500;
  canvas.width = size;
  canvas.height = size;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2;

  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy) / radius;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const hue = (angle + 360) % 360;

          const index = (y * size + x) * 4;

          if (distance <= 1) {
              let saturation: number;
              let lightness: number;

              if (isSaturationWheel) {
                  saturation = value;
                  lightness = distance * 100;
              } else {
                  saturation = distance * 100;
                  lightness = value;
              }

              const [r, g, b] = hslToRgb(hue, saturation, lightness);

              data[index] = r;
              data[index + 1] = g;
              data[index + 2] = b;
              data[index + 3] = 255; // Alpha
          } else {
              data[index + 3] = 0; // Transparente fuera del círculo
          }
      }
  }

  ctx.putImageData(imageData, 0, 0);
}

function generateWheelOKLCH(
  value: number,
  isChromaWheel: boolean,
  canvas: HTMLCanvasElement,
  size: number = 300
): void {
  const text = canvas.parentElement?.childNodes[1] as HTMLLabelElement;
  if (!isChromaWheel) {
    text.innerText =  "Rueda de color Matiz-Croma";
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = size;
  canvas.height = size;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2;

  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy) / radius;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const hue = (angle + 360) % 360;

      const index = (y * size + x) * 4;

      if (distance <= 1) {
        let chroma: number;
        let lightness: number;
        if (isChromaWheel) {
          chroma = 0.4 * value;
          lightness = distance;
        } else {
          chroma = distance * 0.4;
          lightness = value / 100;
          
        }
        // Convertimos OKLCH a sRGB
        const [r, g, b] = oklchToRgb(lightness, chroma, hue);
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255; // Alpha
      } else {
        data[index] = 255;
        data[index + 1] = 255;
        data[index + 2] = 255;
        data[index + 3] = 0; // transparente fuera del círculo
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}


export function createAll() {
  drawColorWheels();
  createCircles(firstWheelCanvas.parentElement!, false);
  createCircles(secondWheelCanvas.parentElement!, true);
  updateExports();
  availableSecondPalette();
}
export function updateAll() {
  updateCircles(firstWheelCanvas.parentElement!, false);
  updateCircles(secondWheelCanvas.parentElement!, true);
  updateExports();
  availableSecondPalette();
}

// Exportar como si fuera módulo
window.addEventListener("resize", () => {
  updateAll();
});