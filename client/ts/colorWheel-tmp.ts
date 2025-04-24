const content = document.querySelector<HTMLElement>(".content");

const firstWheelCanvas = document.getElementById('color-wheel-1') as HTMLCanvasElement;
const secondWheelCanvas = document.getElementById('color-wheel-2') as HTMLCanvasElement;

const palette1 = document.getElementById("palette-1") as HTMLElement;
const palette2 = document.getElementById("palette-2") as HTMLElement;

const hslContainers = document.querySelectorAll<HTMLElement>(".slider-hsl");
const oklchContainers = document.querySelectorAll<HTMLElement>(".slider-oklch");

const colorScheme = document.querySelector<HTMLSelectElement>(".color-type");
const select = document.querySelector<HTMLSelectElement>(".representation-wheel");

const separationTriad = document.getElementById("separation-triad") as HTMLElement;
const separationComplementary = document.getElementById("separation-complementary") as HTMLElement;
const separationAnalogous = document.getElementById("separation-analogous") as HTMLElement;
const separationSplit = document.getElementById("separation-split") as HTMLElement;
const triadSlider = document.getElementById("triad") as HTMLInputElement;
const complementarySlider = document.getElementById("complementary") as HTMLInputElement;
const analogousSlider = document.getElementById("analogous") as HTMLInputElement;
const splitSlider = document.getElementById("split") as HTMLInputElement;

const satSlider1 = document.querySelector<HTMLInputElement>("#s-1");
const lightSlider1 = document.querySelector<HTMLInputElement>("#l-1");
const hueSlider = document.querySelector<HTMLInputElement>("#h");
const satSlider2 = document.querySelector<HTMLInputElement>("#s-2");
const lightSlider2 = document.querySelector<HTMLInputElement>("#l-2");
const hueValue = document.querySelector<HTMLInputElement>("#h-value");
const satValue1 = document.querySelector<HTMLInputElement>("#s-1-value");
const lightValue1 = document.querySelector<HTMLInputElement>("#l-1-value");
const satValue2 = document.querySelector<HTMLInputElement>("#s-2-value");
const lightValue2 = document.querySelector<HTMLInputElement>("#l-2-value");

let selectedColorId: number | null = 1; // Por defecto, color 1 seleccionado

const BACKGROUND_COLOR = "#444"; // Color de fondo del canvas
const CIRCLE_RADIUS = 20;

// Dibujar rueda de color
// TODO: Estudiar el cambio por un canvas para mejorar la velocidad de renderizado
// TODO: Cambiar la rueda para que se recargue cuando se mueve el tamaño de la página
//       https://www.w3schools.com/Js/js_events.asp

window.addEventListener("DOMContentLoaded", updateSeparation);
select?.addEventListener("change", updateAll);
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
    }
  }
  updateAll();
});

// Función para actualizar el slider con la separación de los colores
function updateSeparation() {
  let separation: HTMLElement | null = null;
  if (colorScheme?.value === "triad") {
    separation = separationTriad;
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
  } else if (colorScheme?.value === "complementary") {
    separation = separationComplementary;
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
  } else if (colorScheme?.value === "analogous") {
    separation = separationAnalogous;
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
  } else if (colorScheme?.value === "split-complementary") {
    separation = separationSplit;
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
  } else {
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
  }
  if (separation) {
    separation.classList.remove("hidden");
  }
}

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

// Convertir HSL a RGB para poder utilizar ImageData
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
      Math.round(f(0) * 255),
      Math.round(f(8) * 255),
      Math.round(f(4) * 255),
  ];
}

function createCircle(container : HTMLElement, id : string, color = "white") {
  let circle = document.getElementById(id);
  if (!circle) {
      circle = document.createElement("div");
      circle.classList.add("circle"); // Añadir clase para luego eliminar facilmente
      circle.id = id;
      circle.style.position = "absolute";
      circle.style.width = `${CIRCLE_RADIUS}px`;
      circle.style.height = `${CIRCLE_RADIUS}px`;
      circle.style.borderRadius = "50%";
      circle.style.border = `1px solid ${color}`;
      circle.style.zIndex = "10";

      container.appendChild(circle);
  }
  return circle;
}

function updateCircles(wheel: HTMLElement, isSaturationWheel: boolean) {
  // Primero actualizar las paletas para luego obtener sus colores
  updatePalettes();
  const canvas = wheel.querySelector<HTMLCanvasElement>("canvas");
  if (!canvas || !colorScheme || !hueSlider || !lightSlider1 || !lightSlider2
      || !satSlider1 || !satSlider2) return;
  const baseHue = hueSlider.value; // Obtener el valor del slider de tono
  const radius = canvas.clientWidth / 2
  const positionX = wheel.clientWidth / 2;
  const rectCanvas = canvas.getBoundingClientRect();
  const rectWheel = wheel.getBoundingClientRect();
  // Estamos restando el padding que tiene la rueda con el div, ya que si no salen descentrados los puntos
  // También diferenciamos de las distintas ruedas
  let positionY = rectCanvas.y - rectWheel.y;
  let wheelText = "";
  let slider1;
  let slider2;
  if (isSaturationWheel) {
    wheelText = "lh";
    positionY += (firstWheelCanvas.clientHeight / 2);
    slider1 = satSlider1;
    slider2 = satSlider2;
  } else {
    wheelText = "sh";
    positionY += (secondWheelCanvas.clientHeight / 2); 
    slider1 = lightSlider1;
    slider2 = lightSlider2;
  }

  // Limpiar círculos existentes
  const existingCircles = wheel.querySelectorAll(".circle");
  existingCircles.forEach(circle => circle.remove());

  const hues = calculateColors(baseHue, colorScheme.value);

  const colorsWhite = Array.from(palette1.children).map((colorBox, index) => {
    const color = window.getComputedStyle(colorBox).backgroundColor;
    const lightness = parseInt(slider1.value) / 100; // Luminosidad normalizada
    return { color, lightness, index };
  });
  colorsWhite.forEach(({ color, lightness, index }) => {
    const hue = hues[index % hues.length];
    const radian = (hue * Math.PI) / 180;
    const circle = createCircle(wheel, `circle-white-${wheelText}-${index}`, "white");
    const x = positionX - (circle.clientWidth / 2) + lightness * radius * Math.cos(radian); // Coordenada X
    const y = positionY - (circle.clientWidth / 2) + lightness * radius * Math.sin(radian); // Coordenada Y
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.backgroundColor = color;
  });
  // Obtener colores de palette2 (círculos negros)
  const colorsBlack = Array.from(palette2.children).map((colorBox, index) => {
    const color = window.getComputedStyle(colorBox).backgroundColor;
    const lightness = parseInt(slider2.value) / 100; // Luminosidad normalizada
    return { color, lightness, index };
  });
  colorsBlack.forEach(({ color, lightness, index }) => {
    const hue = hues[index % hues.length];
    const radian = (hue * Math.PI) / 180;
    const circle = createCircle(wheel, `circle-black-${wheelText}-${index}`, "black");
    const x = positionX - (circle.clientWidth / 2) + lightness * radius * Math.cos(radian); // Coordenada X
    const y = positionY - (circle.clientWidth / 2) + lightness * radius * Math.sin(radian); // Coordenada Y
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.backgroundColor = color;
  });
}

// Crear las paletas
let uuid = 0; // Contador para los colores
function createPalette(container: HTMLElement, hue: string, saturation: string, lightness: string, scheme : string) {

  const colorBoxs = container.querySelectorAll(".color-box");
  // Primero se comprueba si se los color-box ya están creados o no
  if (colorBoxs.length > 0) {
    const hues = calculateColors(hue, scheme); 
    // Si ya existen, actualizamos los colores de fondo y comprobamos si su checkbox está marcado
    (colorBoxs as NodeListOf<HTMLDivElement>).forEach((colorBox, index) => {
      const adjustedHue = hues[index];
      const hslString = `hsl(${adjustedHue}, ${saturation}%, ${lightness}%)`;
      colorBox.style.backgroundColor = hslString;
      const checkbox = colorBox.childNodes[0] as HTMLInputElement;
      // Si el checkbox está marcado, actualizamos el color en la paleta
      if (checkbox.checked) {
        updateColor(colorBox, adjustedHue.toString(), saturation, lightness);
      }
    });
  // Si no existen, creamos los nuevos colores
  } else {
    const hues = calculateColors(hue, scheme); 
    hues.forEach(adjustedHue => {
      // Creamos un nuevo elemento div para cada color
      const colorBox = document.createElement("div");
      colorBox.classList.add("color-box");
      const hslString = `hsl(${adjustedHue}, ${saturation}%, ${lightness}%)`;
      colorBox.style.backgroundColor = hslString;
      // Creamos el checkbox
      const checkbox = document.createElement("input");
      (checkbox as any).h = adjustedHue;
      (checkbox as any).s = saturation;
      (checkbox as any).l = lightness;
      checkbox.type = "checkbox";
      checkbox.classList.add("color-checkbox");
  
      // Listener para manejar cuando se activa el checkbox
      const originalHandler = function (this: HTMLInputElement) {
        if (this.checked) {
          addColor(colorBox, this, adjustedHue.toString(), saturation, lightness);
        } else {
          removeColor(colorBox, this);
        }
      };
      checkbox.addEventListener("change", originalHandler);

      colorBox.appendChild(checkbox);
      container.appendChild(colorBox);
    });
  }
}

// Función para añadir un color a la paleta
function addColor(hslColor: HTMLDivElement, checkbox: HTMLInputElement, hue: string, saturation: string, lightness: string) {
  // Leemos todos los colores de la paleta y comprobamos si hay espacio,
  // si no hay espacio, se desmarca el checkbox y se muestra un mensaje
  for (let i = 1; i <= 5; i++) {
    const slot = document.getElementById(`color-${i}`);
    if (slot && slot.style.backgroundColor === "") {
      // Cambiar fondo
      slot.style.backgroundColor = hslColor.style.backgroundColor;
      // Que se muestre el padre
      slot.parentElement?.classList.remove("hidden");
      hslColor.id = "color-checkbox-" + i;

      const editBox = slot.parentElement!.childNodes[3].childNodes;
      editBox.forEach((child) => {
        if (child instanceof HTMLElement) {
          if (child.classList.contains("slider-container")) {
            child.childNodes.forEach((element) => {
              if (element instanceof HTMLInputElement) {
                const type = element.id.split("-")[0];
                if (type === "hue") {
                  element.value = hue;
                } else if (type === "lightness") {
                  element.value = lightness;
                } else {
                  element.value = saturation;
                }
              }
            });
          }
        }
      });

      // Para tratar el color de branding en un futuro
      if (i === 1) {
        console.log("Este es el color de branding");
      }
      return;
    }
  }
  alert("No puedes agregar más de 5 colores a la paleta.");
  checkbox.checked = false;  
}

// En el checkbox se guarda el número del color al que pertenece, en base a eso
// lo eliminamos de la paleta
function removeColor(hslColor: HTMLDivElement, checkbox: HTMLInputElement) {
  const hslColorId = hslColor.id.split("-")[2];
  const id = parseInt(hslColorId);
  const slot = document.getElementById(`color-${id}`);
  if (slot) {
    hslColor.id = "";
    slot.style.backgroundColor = "";
    // Que se oculte el padre
    slot.parentElement?.classList.add("hidden");
    if (id === 1) {
      // cambiar color-checkbox-x de palette-y, color-x y color-container-x
      for (let i = 2; i <= 5; i++) {
        const colorCheckbox = document.getElementById(`color-checkbox-${i}`);
        const colorContainer = document.getElementById(`color-container-${i}`)!;
        if (colorCheckbox) {
          hslColor.id = "color-checkbox-1";
          colorCheckbox.id = "";
          slot.parentElement?.classList.remove("hidden");
          slot.style.backgroundColor = colorCheckbox.style.backgroundColor;
          (colorContainer.childNodes[1] as HTMLDivElement).style.backgroundColor = "";
          colorContainer.classList.add("hidden");
          checkbox.checked = true;
          (colorCheckbox.childNodes[0] as HTMLInputElement).checked = false;
          let tmp : string[] = ["","",""];
          // Actualizar colores globables y sus hijos
          colorContainer.childNodes[3].childNodes.forEach((child) => {
            if (child instanceof HTMLElement) {
              if (child.classList.contains("slider-container")) {
                child.childNodes.forEach((element) => {
                  if (element instanceof HTMLInputElement) {
                    const type = element.id.split("-");
                    if (type[0] === "hue") {
                      hueSlider!.value = element.value;
                      hueValue!.value = element.value;
                      tmp[0] = element.value;
                    } else if (type[0] === "lightness") {
                      lightSlider1!.value = element.value;
                      lightValue1!.value = element.value;
                      tmp[1] = element.value;
                    } else {
                      tmp[2] = element.value;
                    }
                  }
                });
              }
            }
          });
          slot.parentElement!.childNodes[3].childNodes.forEach((child) => {
            if (child instanceof HTMLElement) {
              if (child.classList.contains("slider-container")) {
                child.childNodes.forEach((element) => {
                  if (element instanceof HTMLInputElement) {
                    const type = element.id.split("-");
                    if (type[0] === "hue") {
                      element.value = tmp[0];
                    } else if (type[0] === "lightness") {
                      element.value = tmp[1];
                    } else {
                      element.value = tmp[2]
                    }
                  }
                });
              }
            }
          });
          updateAll();

          // return;
        }
      }
    }
  }
}

// Función para actualizar un color a la paleta
function updateColor(hslColor: HTMLDivElement, hue: string, saturation: string, lightness: string) {
  const color = hslColor.style.backgroundColor;
  const hslColorId = hslColor.id.split("-")[2];
  const id = parseInt(hslColorId);
  const slot = document.getElementById(`color-${id}`);
  if (slot) {
    slot.style.backgroundColor = color;
    const editBox = slot.parentElement!.childNodes[3].childNodes;
    editBox.forEach((child) => {
      if (child instanceof HTMLElement) {
        if (child.classList.contains("slider-container")) {
          if (select!.value === "hsl") {
            child.childNodes.forEach((element) => {
              if (element instanceof HTMLInputElement) {
                const type = element.id.split("-")[0];
                if (type === "hue") {
                  element.value = hue;
                } else if (type === "lightness") {
                  element.value = lightness;
                } else {
                  element.value = saturation;
                }
              }
            });
          } else if (select!.value === "oklch") {

          }
          // Aquí puedes hacer lo que quieras con child
        }
      }
    });
  }
}

function calculateColors(hue: string, scheme: string) {
  const colors = [];
  const hueNumber = parseInt(hue); // Convertir el valor de hue a número
  switch (scheme) {
      case "analogous":
          // Colores análogos (Hue ±30°)
          const angleAnalogous = Number(analogousSlider.value);
          colors.push(hueNumber);
          colors.push((hueNumber + angleAnalogous ) % 360);
          colors.push((hueNumber - angleAnalogous) % 360);
          colors.push((hueNumber + angleAnalogous + angleAnalogous) % 360);
          colors.push((hueNumber - angleAnalogous - angleAnalogous) % 360);
          break;
      case "complementary":
          // Colores complementarios (Hue +180°)
          const angleComplementary = Number(complementarySlider.value);
          colors.push(hueNumber);
          colors.push((hueNumber + angleComplementary) % 360);
          break;
      case "split-complementary":
          // Split complementarios (Hue ±150°)
          const angleSplit = Number(splitSlider.value);
          colors.push(hueNumber);
          colors.push((hueNumber + angleSplit) % 360);
          colors.push((hueNumber - angleSplit + 360) % 360);
          break;
      case "triad":
          // Triadas (Hue ±120°)
          const angleTriad = Number(triadSlider.value);
          colors.push(hueNumber);
          colors.push((hueNumber + angleTriad) % 360);
          colors.push((hueNumber - angleTriad + 360) % 360);
          break;
      case "square":
          // Cuadrado (Hue ±90° y ±180°)
          colors.push(hueNumber);
          colors.push((hueNumber + 90) % 360);
          colors.push((hueNumber + 180) % 360);
          colors.push((hueNumber - 90 + 360) % 360);
          break;
      default:
          // Si no hay esquema, solo devuelve el tono base
          colors.push(hueNumber);
  }
  return colors;
}

function updatePalettes() {
  if (!colorScheme || !satSlider1 || !lightSlider1
  || !hueSlider || !satSlider2 || !lightSlider2) return;
  // Actualizamos las dos paletas con los valores actuales de los sliders y esquema
  createPalette(palette1, hueSlider.value, satSlider1.value, lightSlider1.value, colorScheme.value);
  createPalette(palette2, hueSlider.value, satSlider2.value, lightSlider2.value, colorScheme.value);
  // Actualizamos los círculos con los colores de las paletas
}

function updateAll() {
  drawColorWheels();
  updateCircles(firstWheelCanvas.parentElement!, false);
  updateCircles(secondWheelCanvas.parentElement!, true);
}
// Exportar como si fuera módulo
(window as any).updateAll = updateAll; 
window.addEventListener("resize", () => {
  updateAll();
});