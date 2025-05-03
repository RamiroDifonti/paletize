// constants
import { select, wcag, contrast, colorScheme, colorblind} from "../constants/selects.js";
import { firstWheelCanvas, secondWheelCanvas } from "../constants/canvas.js";
import { hslContainers, oklchContainers } from "../constants/containers.js";
import { palette1, palette2 } from "../constants/palette.js";

// functions
import { hslToRgb } from "../utils/conversor.js";
import { updateSeparation } from "../handlers/schemeHandler.js";
import { createCircles, updateCircles } from "../handlers/handleCircles.js";
import { updateColorblind } from "../utils/colorblind.js";

const BACKGROUND_COLOR = "#444"; // Color de fondo



// Eventos que actualizan la página
window.addEventListener("DOMContentLoaded", updateSeparation);
select?.addEventListener("change", createAll);
wcag?.addEventListener("change", updateAll);
contrast?.addEventListener("change", updateAll);
colorblind?.addEventListener("change", updateColorblind);
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
    const lightness = document.getElementById("l-1") as HTMLInputElement;
    const saturation = document.getElementById("s-1") as HTMLInputElement;
    generateWheelHSL(parseInt(lightness.value), false, firstWheelCanvas);
    generateWheelHSL(parseInt(saturation.value), true, secondWheelCanvas);
    
  } else if (representation === "oklch") {
    hslContainers.forEach(container => container.style.display = "none");
    oklchContainers.forEach(container => container.style.display = "flex");
  }
}

function generateWheelHSL(
  value: number,
  isSaturationWheel: boolean,
  canvas: HTMLCanvasElement,
  size: number = 400
): void {
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



export function createAll() {
  drawColorWheels();
  createCircles(firstWheelCanvas.parentElement!, false);
  createCircles(secondWheelCanvas.parentElement!, true);
}
export function updateAll() {
  updateCircles(firstWheelCanvas.parentElement!, false);
  updateCircles(secondWheelCanvas.parentElement!, true);
}

// Exportar como si fuera módulo
// (window as any).updateAll = updateAll; 
window.addEventListener("resize", () => {
  updateAll();
});