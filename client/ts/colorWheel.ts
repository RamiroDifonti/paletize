const content = document.querySelector<HTMLElement>(".content");

const firstWheelCanvas = document.getElementById('color-wheel-1') as HTMLCanvasElement;
const secondWheelCanvas = document.getElementById('color-wheel-2') as HTMLCanvasElement;

const palette1 = document.getElementById("palette-1") as HTMLElement;
const palette2 = document.getElementById("palette-2") as HTMLElement;

const hslContainers = document.querySelectorAll<HTMLElement>(".slider-hsl");
const oklchContainers = document.querySelectorAll<HTMLElement>(".slider-oklch");

const colorScheme = document.querySelector<HTMLSelectElement>(".color-type");
const select = document.querySelector<HTMLSelectElement>(".representation-wheel");
const wcag = document.querySelector<HTMLSelectElement>(".wcag-selection");
const contrast = document.querySelector<HTMLInputElement>(".contrast-selection");
const colorblind = document.querySelector<HTMLInputElement>(".colorblind");

const separationTriad = document.getElementById("separation-triad") as HTMLElement;
const separationComplementary = document.getElementById("separation-complementary") as HTMLElement;
const separationAnalogous = document.getElementById("separation-analogous") as HTMLElement;
const separationSplit = document.getElementById("separation-split") as HTMLElement;
const separationSquare = document.getElementById("separation-square") as HTMLElement;
const triadSlider = document.getElementById("triad") as HTMLInputElement;
const complementarySlider = document.getElementById("complementary") as HTMLInputElement;
const analogousSlider = document.getElementById("analogous") as HTMLInputElement;
const splitSlider = document.getElementById("split") as HTMLInputElement;
const squareSlider = document.getElementById("square") as HTMLInputElement;

const satSlider1 = document.querySelector<HTMLInputElement>("#s-1");
const lightSlider1 = document.querySelector<HTMLInputElement>("#l-1");
const hueSlider = document.querySelector<HTMLInputElement>("#h");
const satSlider2 = document.querySelector<HTMLInputElement>("#s-2");
const lightSlider2 = document.querySelector<HTMLInputElement>("#l-2");

const BACKGROUND_COLOR = "#444"; // Color de fondo

// Matrices de transformación para el daltonismo
const colorBlindMatrices: Record<string, number[][]> = {
  protanopia: [
    [0.56667, 0.43333, 0],
    [0.55833, 0.44167, 0],
    [0,       0.24167, 0.75833]
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7,   0.3,   0],
    [0,     0.3,   0.7]
  ],
  tritanopia: [
    [0.95,  0.05,    0],
    [0,     0.43333, 0.56667],
    [0,     0.475,   0.525]
  ]
};

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

// Funcion para actualizar el daltonismo
function updateColorblind() {
  const colorblindValue = colorblind?.value!;
  palette1.classList.remove("colorblind", "protanopia", "deuteranopia", "tritanopia");
  palette2.classList.remove("colorblind", "protanopia", "deuteranopia", "tritanopia");
  const buttons = document.querySelectorAll<HTMLButtonElement>(".edit-icon");
  if (colorblindValue !== "none") {
    palette1.classList.add("colorblind", colorblindValue);
    palette2.classList.add("colorblind", colorblindValue);
    buttons.forEach((button) => {
      button.classList.remove("show");
    });
  } else {
    buttons.forEach((button) => {
      button.classList.add("show");
    });
  }
  updateAll();
}

// Función para actualizar el slider con la separación de los colores
function updateSeparation() {
  let separation: HTMLElement | null = null;
  if (colorScheme?.value === "triad") {
    separation = separationTriad;
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "complementary") {
    separation = separationComplementary;
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "analogous") {
    separation = separationAnalogous;
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "split-complementary") {
    separation = separationSplit;
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "square") {
    separation = separationSquare;
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
  } else {
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  }
  if (separation) {
    separation.classList.remove("hidden");
  }
  updateColorblind();
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

// Convertir HSL a RGB
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

// Convertir RGB a HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function createCircle(container : HTMLElement, id : string, color = "white") {
  let circle = document.getElementById(id);
  if (!circle) {
      circle = document.createElement("div");
      circle.classList.add("circle"); // Añadir clase para luego eliminar facilmente
      circle.id = id;
      circle.style.position = "absolute";
      circle.style.width = `20px`;
      circle.style.height = `20px`;
      circle.style.borderRadius = "50%";
      circle.style.border = `1px solid ${color}`;
      circle.style.zIndex = "10";

      container.appendChild(circle);
  }
  return circle;
}

function createCircles(wheel: HTMLElement, isSaturationWheel: boolean) {
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
  if (isSaturationWheel) {
    wheelText = "lh";
    positionY += (firstWheelCanvas.clientHeight / 2);
  } else {
    wheelText = "sh";
    positionY += (secondWheelCanvas.clientHeight / 2); 
  }

  // Limpiar círculos existentes
  const existingCircles = wheel.querySelectorAll(".circle");
  existingCircles.forEach(circle => circle.remove());

  const hues = calculateColors(baseHue, colorScheme.value);
  const colorsWhite = Array.from(palette1.children).map((colorBox, index) => {
    const color = window.getComputedStyle(colorBox).backgroundColor;
    let distance;
    if (isSaturationWheel) {
      distance = Number(colorBox.getAttribute("s")) / 100; // Luminosidad normalizada
    } else {
      distance = Number(colorBox.getAttribute("l")) / 100; // Luminosidad normalizada
    }
    return { color, distance, index };
  });
  colorsWhite.forEach(({ color, distance, index }) => {
    const hue = hues[index % hues.length];
    const radian = (hue * Math.PI) / 180;
    const circle = createCircle(wheel, `circle-white-${wheelText}-${index}`, "white");
    const x = positionX - (circle.clientWidth / 2) + distance * radius * Math.cos(radian); // Coordenada X
    const y = positionY - (circle.clientWidth / 2) + distance * radius * Math.sin(radian); // Coordenada Y
    circle.setAttribute("positionX", (positionX - (circle.clientWidth / 2)).toString());
    circle.setAttribute("positionY", (positionY - (circle.clientWidth / 2)).toString());
    circle.setAttribute("radius", radius.toString());
    circle.setAttribute("radian", radian.toString());

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.backgroundColor = color;
  });
  // Obtener colores de palette2 (círculos negros)
  const colorsBlack = Array.from(palette2.children).map((colorBox, index) => {
    const color = window.getComputedStyle(colorBox).backgroundColor;
    let distance;
    if (isSaturationWheel) {
      distance = Number(colorBox.getAttribute("s")) / 100; // Luminosidad normalizada
    } else {
      distance = Number(colorBox.getAttribute("l")) / 100; // Luminosidad normalizada
    }
    return { color, distance, index };
  });
  colorsBlack.forEach(({ color, distance, index }) => {
    const hue = hues[index % hues.length];
    const radian = (hue * Math.PI) / 180;
    const circle = createCircle(wheel, `circle-black-${wheelText}-${index}`, "black");
    const x = positionX - (circle.clientWidth / 2) + distance * radius * Math.cos(radian); // Coordenada X
    const y = positionY - (circle.clientWidth / 2) + distance * radius * Math.sin(radian); // Coordenada Y
    circle.setAttribute("positionX", (positionX - (circle.clientWidth / 2)).toString());
    circle.setAttribute("positionY", (positionY - (circle.clientWidth / 2)).toString());
    circle.setAttribute("radius", radius.toString());
    circle.setAttribute("radian", radian.toString());
    circle.setAttribute("distance", distance.toString());

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.backgroundColor = color;
  });
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
  if (isSaturationWheel) {
    wheelText = "lh";
    positionY += (firstWheelCanvas.clientHeight / 2);
  } else {
    wheelText = "sh";
    positionY += (secondWheelCanvas.clientHeight / 2); 
  }

  const hues = calculateColors(baseHue, colorScheme.value);
  const colorsWhite = Array.from(palette1.children).map((colorBox, index) => {
    const color = window.getComputedStyle(colorBox).backgroundColor;
    let distance;
    if (isSaturationWheel) {
      distance = Number(colorBox.getAttribute("s")) / 100; // Luminosidad normalizada
    } else {
      distance = Number(colorBox.getAttribute("l")) / 100; // Luminosidad normalizada
    }
    return { color, distance, index };
  });
  colorsWhite.forEach(({ color, index }) => {
    const hue = hues[index % hues.length];
    const radian = (hue * Math.PI) / 180;
    const circle =  document.getElementById(`circle-white-${wheelText}-${index}`)! as HTMLDivElement;
    const distance = Number(circle.getAttribute("distance"));
    const x = positionX - (circle.clientWidth / 2) + distance * radius * Math.cos(radian); // Coordenada X
    const y = positionY - (circle.clientWidth / 2) + distance * radius * Math.sin(radian); // Coordenada Y
    circle.setAttribute("positionX", (positionX - (circle.clientWidth / 2)).toString());
    circle.setAttribute("positionY", (positionY - (circle.clientWidth / 2)).toString());
    circle.setAttribute("radius", radius.toString());
    circle.setAttribute("radian", radian.toString());

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.backgroundColor = color;
  });
  // Obtener colores de palette2 (círculos negros)
  const colorsBlack = Array.from(palette2.children).map((colorBox, index) => {
    const color = window.getComputedStyle(colorBox).backgroundColor;
    let distance;
    if (isSaturationWheel) {
      distance = Number(colorBox.getAttribute("s")) / 100; // Luminosidad normalizada
    } else {
      distance = Number(colorBox.getAttribute("l")) / 100; // Luminosidad normalizada
    }
    return { color, distance, index };
  });
  colorsBlack.forEach(({ color, distance, index }) => {
    const hue = hues[index % hues.length];
    const radian = (hue * Math.PI) / 180;
    const circle = document.getElementById(`circle-black-${wheelText}-${index}`)! as HTMLDivElement;
    const x = positionX - (circle.clientWidth / 2) + distance * radius * Math.cos(radian); // Coordenada X
    const y = positionY - (circle.clientWidth / 2) + distance * radius * Math.sin(radian); // Coordenada Y
    circle.setAttribute("positionX", (positionX - (circle.clientWidth / 2)).toString());
    circle.setAttribute("positionY", (positionY - (circle.clientWidth / 2)).toString());
    circle.setAttribute("radius", radius.toString());
    circle.setAttribute("radian", radian.toString());

    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.style.backgroundColor = color;
  });
}


function updateOneCircle(circle: HTMLDivElement, distance: number) {
  const normalizedDistance = distance / 100; // Luminosidad normalizada
  const posX = circle.getAttribute("positionX");
  const posY = circle.getAttribute("positionY");
  const radius = circle.getAttribute("radius");
  const radian = circle.getAttribute("radian");
  const x = Number(posX) + normalizedDistance * Number(radius) * Math.cos(Number(radian)); // Coordenada X
  const y = Number(posY) + normalizedDistance * Number(radius) * Math.sin(Number(radian)); // Coordenada Y
  circle.setAttribute("distance", normalizedDistance.toString());

  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
}

// Crear las paletas
function createPalette(container: HTMLElement, hue: string, saturation: string, lightness: string, scheme : string) {
  const colorBoxs = container.querySelectorAll(".color-box");
  // Primero se comprueba si se los color-box ya están creados o no
  if (colorBoxs.length > 0) {
    const hues = calculateColors(hue, scheme); 
    // Si ya existen, actualizamos los colores de fondo y comprobamos si su checkbox está marcado
    (colorBoxs as NodeListOf<HTMLDivElement>).forEach((colorBox, index) => {
      let adjustedHue = hues[index];
      const limits = limitColor(Number(hue), Number(adjustedHue), Number(saturation), Number(lightness));

      let boxSaturation = Number(saturation);
      let boxLightness = Number(lightness);
      if (limits[0] !== -1) {
        boxSaturation = limits[0] === 100 ? limits[2] : limits[0];
        boxLightness = limits[1] === 100 ? limits[3] : limits[1];
      }
      if (container.classList.contains("colorblind")) {
        const colorblindType = colorblind?.value as "protanopia" | "deuteranopia" | "tritanopia";
        [adjustedHue, boxSaturation, boxLightness] = simulateColorBlind(adjustedHue, boxSaturation, boxLightness, colorblindType);
      }
      const hslString = `hsl(${adjustedHue}, ${boxSaturation}%, ${boxLightness}%)`;
      colorBox.style.backgroundColor = hslString;
      colorBox.setAttribute("h", adjustedHue.toString());
      colorBox.setAttribute("s", boxSaturation.toString());
      colorBox.setAttribute("l", boxLightness.toString());
      const checkbox = colorBox.childNodes[0] as HTMLInputElement;
      // Si el checkbox está marcado, actualizamos el color en la paleta
      if (checkbox.checked) {
        updateColor(colorBox, limits);
      }
    });
  // Si no existen, creamos los nuevos colores
  } else {
    const hues = calculateColors(hue, scheme); 
    hues.forEach((adjustedHue, index) => {
      // Creamos un nuevo elemento div para cada color
      const limits = limitColor(Number(hue), Number(adjustedHue), Number(saturation), Number(lightness));
      const colorBox = document.createElement("div");
      colorBox.classList.add("color-box");
      let boxSaturation = Number(saturation);
      let boxLightness = Number(lightness);
      if (limits[0] !== -1) {
        boxSaturation = limits[0] === 100 ? limits[2] : limits[0];
        boxLightness = limits[1] === 100 ? limits[3] : limits[1];
      }
      if (container.classList.contains("colorblind")) {
        const colorblindType = colorblind?.value as "protanopia" | "deuteranopia" | "tritanopia";
        [adjustedHue, boxSaturation, boxLightness] = simulateColorBlind(adjustedHue, boxSaturation, boxLightness, colorblindType);
      }
      const hslString = `hsl(${adjustedHue}, ${boxSaturation}%, ${boxLightness}%)`;
      colorBox.style.backgroundColor = hslString;
      // Creamos el checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("color-checkbox");
    
      // Listener para manejar cuando se activa el checkbox
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          colorBox.setAttribute("h", adjustedHue.toString());
          colorBox.setAttribute("s", boxSaturation.toString());
          colorBox.setAttribute("l", boxLightness.toString());
          addColor(colorBox, limits);
        } else {
          removeColor(colorBox);
        }
      });

      colorBox.appendChild(checkbox);
      // Creamos el texto para el color de marca
      if (index === 0 && container.id === "palette-1") {
        const text = document.createElement("label");
        text.innerText = `Brand`;
        text.style.position = "absolute";
        text.style.alignSelf = "flex-end";
        colorBox.appendChild(text);
        // Cambiar el color del texto para que sea adecuado dependiendo del color de fondo
        const textColor = chooseTextColor([Number(hue), Number(saturation), Number(lightness)]);
        colorBox.style.color = textColor;
        colorBox.setAttribute("branding", "true");
      } else if (index === 0 && container.id === "palette-2") {
        colorBox.setAttribute("branding", "secondary");
      }
      container.appendChild(colorBox);
    });
  }
}

// Limitar los sliders en base al WCAG
function limitColor(hueBranding: number, hue: number, saturation: number, lightness: number) {
  if (hue === hueBranding) {
    return [-1, -1, -1, -1];
  }
  const wcagValue = wcag?.value == "aa" ? 4.5 : 7;
  const contrastValue = contrast?.value;

  const brandingRgb = hslToRgb(Number(hueBranding), Number(saturation), Number(lightness));
  const luminanceBranding = calculateLuminance(brandingRgb);
  const step = 0.01;
  let maxS = -1, maxL = -1;
  let minS = -1, minL = -1;
  let s = saturation / 100, l = lightness / 100;
  let changeL = true;
  switch (contrastValue) {
    // s2 < s1, l2 < l1 (saturación baja, luminosidad baja)
    case "depth":
      changeL = l > s ? false : true;
      while (l >= -0.01 && s >= -0.01) {
        const rgb2 = hslToRgb(hue, s * 100, l * 100);
        const luminance2 = calculateLuminance(rgb2);
        const contrast = calculateContrast(luminanceBranding, luminance2);
        if (maxS !== -1 && (contrast < wcagValue || (Math.round(s*100) === 0 && Math.round(l*100) === 0))) {
          if (Math.round(l*100) === 0) {
            minL = 0;
          }
          if (Math.round(s*100) === 0) {
            minS = 0;
          }
          console.log(contrast);
          console.log(Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL));
          return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL)];
        } else {
          minS = s * 100;
          minL = l * 100;
        }
        if (maxS === -1 && contrast >= wcagValue) {
          maxS = s * 100;
          maxL = l * 100;
        }
        if (Math.round(s*100) === 0) {
          l -= step;
        } else if (Math.round(l*100) === 0) {
          s -= step;
        } else {
          if (changeL) {
            l -= step;
            changeL = false;
          } else {
            s -= step;
            changeL = true;
          }
        }
      }
      break;
    // s2 > s1, l2 > l1 (saturación alta, luminosidad alta)
    case "intensity":
      changeL = l < s ? false : true;
      while (l <= 1.01 && s <= 1.01) {
        const rgb2 = hslToRgb(hue, s * 100, l * 100);
        const luminance2 = calculateLuminance(rgb2);
        const contrast = calculateContrast(luminanceBranding, luminance2);
        if (minS !== -1 && (contrast < wcagValue || (Math.round(s*100) === 100 && Math.round(l*100) === 100))) {
          if (Math.round(s*100) === 100) {
            maxS = 100;
          }
          if (Math.round(l*100) === 100) {
            maxL = 100;
          }
          return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL)];
        } else {
          maxS = s * 100;
          maxL = l * 100;
        }
        if (minS === -1 && contrast >= wcagValue) {
          minS = s * 100;
          minL = l * 100;
        }
        if (Math.round(s*100) === 100) {
          l += step;
        } else if (Math.round(l*100) === 100) {
          s += step;
        } else {
          if (changeL) {
            l += step;
            changeL = false;
          } else {
            s += step;
            changeL = true;
          }
        }
      }
      break;
    // s2 < s1, l2 > l1 (saturación alta, luminosidad baja)
    case "softness":
      while (l <= 1.01 && s >= -0.01) {
        const rgb2 = hslToRgb(hue, s * 100, l * 100);
        const luminance2 = calculateLuminance(rgb2);
        const contrast = calculateContrast(luminanceBranding, luminance2);
        if (maxS !== -1 && (contrast < wcagValue || (Math.round(s*100) === 0 && Math.round(l*100) === 100))) {
          if (Math.round(s*100) === 0) {
            minS = 0;
          }
          if (Math.round(l*100) === 100) {
            maxL = 100;
          }
          return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL)];
        } else {
          minS = s * 100;
          maxL = l * 100;
        }
        if (maxS === -1 && contrast >= wcagValue) {
          maxS = s * 100;
          minL = l * 100;
        }
        if (Math.round(s*100) === 0) {
          l += step;
        } else if (Math.round(l*100) === 100) {
          s -= step;
        } else {
          if (changeL) {
            l += step;
            changeL = false;
          } else {
            s -= step;
            changeL = true;
          }
        }
      }
      break;
    // s2 > s1, l2 < l1 (saturación baja, luminosidad alta)
    case "impact":
      while (l >= -0.01 && s <= 1.01) {
        const rgb2 = hslToRgb(hue, s * 100, l * 100);
        const luminance2 = calculateLuminance(rgb2);
        const contrast = calculateContrast(luminanceBranding, luminance2);
        if (minS !== -1 && (contrast < wcagValue || (Math.round(s*100) === 100 && Math.round(l*0) === 0))) {
          if (Math.round(s*100) === 100) {
            maxS = 100;
          }
          if (Math.round(l*100) === 0) {
            minL = 0;
          }
          return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL)];
        } else {
          maxS = s * 100;
          minL = l * 100;
        }
        if (minS === -1 && contrast >= wcagValue) {
          minS = s * 100;
          maxL = l * 100;
        }
        if (Math.round(s*100) === 100) {
          l -= step;
        } else if (Math.round(l*100) === 0) {
          s += step;
        } else {
          if (changeL) {
            l -= step;
            changeL = false;
          } else {
            s += step;
            changeL = true;
          }
        }
      }
      break;
  }
  return [-1, -1, -1, -1];
}

// Simular el daltonismo en un color HSL
function simulateColorBlind (
  h: number,
  s: number,
  l: number,
  type: "protanopia" | "deuteranopia" | "tritanopia"
): [number, number, number] {
  const rgb = hslToRgb(h, s, l);
  const matrix = colorBlindMatrices[type];

  const [r, g, b] = rgb.map(v => v / 255);
  const rBlind = r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2];
  const gBlind = r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2];
  const bBlind = r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2];

  const rgbSim = [
    Math.round(Math.min(1, rBlind) * 255),
    Math.round(Math.min(1, gBlind) * 255),
    Math.round(Math.min(1, bBlind) * 255)
  ];
  return rgbToHsl(rgbSim[0], rgbSim[1], rgbSim[2]);
}

// Función para añadir un color a la paleta
function addColor(hslColor: HTMLDivElement, limits: number[]) {
  // Leemos todos los colores de la paleta y comprobamos si hay espacio,
  // si no hay espacio, se desmarca el checkbox y se muestra un mensaje
  const hue = hslColor.getAttribute("h");
  const saturation = hslColor.getAttribute("s");
  const lightness = hslColor.getAttribute("l");
  const isBranding = hslColor.getAttribute("branding") === "true" ? true : false;
  let satValue = limits[0] === 100 ? limits[2] : limits[0];
  let lightValue = limits[1] === 100 ? limits[3] : limits[1];
  let maxS = limits[0];
  let maxL = limits[1];
  let minS = limits[2];
  let minL = limits[3];
  if (maxS === -1 || maxL === -1 || minS === -1 || minL === -1) {
    maxS = 100;
    maxL = 100;
    minS = 0;
    minL = 0;
    satValue = Number(saturation);
    lightValue = Number(lightness);
  }
  // Calcular el contraste del color y almacenarlo en un atributo
  for (let i = 1; i <= 5; i++) {
    const slot = document.getElementById(`color-${i}`);
    // El primer if es por si el usuario intenta añadir el color de branding
    // después de haber añadido otros colores
    if (isBranding && slot && slot.style.backgroundColor !== "") {
      let colors: Array<HTMLDivElement> = [];
      for (let i = 1; i <= 4; i++) {
        const colorCheckbox = document.getElementById(`color-checkbox-${i}`) as HTMLDivElement;
        if (colorCheckbox) {
          colors.push(colorCheckbox);
        }
      }

      RemoveAllColors();
      addColor(hslColor, limits);
      for (let i = 0; i < colors.length; i++) {
        const limits = limitColor(Number(hue), Number(colors[i].getAttribute("h")), Number(colors[i].getAttribute("s")), Number(colors[i].getAttribute("l")));
        addColor(colors[i], limits);
      }
      return;
    } else if (slot && slot.style.backgroundColor === "") {
      // Cambiar fondo
      slot.style.backgroundColor = hslColor.style.backgroundColor;

      const textColor = chooseTextColor([Number(hue), Number(saturation), Number(lightness)]);
      slot.style.color = textColor;
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
                  element.value = hue!;
                } else if (type === "lightness") {
                  element.min = minL.toString();
                  element.max = maxL.toString();
                  element.value = lightValue.toString() ;
                } else {
                  element.min = minS.toString();
                  element.max = maxS.toString();
                  element.value = satValue.toString();
                }
              }
            });
          }
        }
      });
      return;
    }
  }
  alert("No puedes agregar más de 5 colores a la paleta.");

  (hslColor.childNodes[0] as HTMLInputElement).checked = false;  
}

// En el checkbox se guarda el número del color al que pertenece, en base a eso
// lo eliminamos de la paleta
function removeColor(hslColor: HTMLDivElement) {
  
  const hslColorId = hslColor.id.split("-")[2];
  const id = parseInt(hslColorId);
  const slot = document.getElementById(`color-${id}`);
  if (slot) {
    hslColor.id = "";
    slot.style.backgroundColor = "";
    slot.parentElement?.classList.add("hidden");
  }
}

// Eliminar toda la paleta (usado cuando se modifica el branding)
function RemoveAllColors() {
  const colorBoxs = document.querySelectorAll(".color-box");
  const colors = document.querySelectorAll(".color");
  colorBoxs.forEach((colorBox, index) => {
    colorBox.id = "";
    if (colors[index]) {
      (colors[index] as HTMLDivElement).style.backgroundColor = "";
      (colors[index] as HTMLDivElement).parentElement?.classList.add("hidden");
    }
  });
}

// Función para actualizar un color a la paleta
function updateColor(hslColor: HTMLDivElement, limits: number[]) {

  const color = hslColor.style.backgroundColor;
  const hslColorId = hslColor.id.split("-")[2];
  const id = parseInt(hslColorId);
  const slot = document.getElementById(`color-${id}`);

  const hue = hslColor.getAttribute("h");
  const saturation = hslColor.getAttribute("s");
  const lightness = hslColor.getAttribute("l");

  let satValue = limits[0] === 100 ? limits[2] : limits[0];
  let lightValue = limits[1] === 100 ? limits[3] : limits[1];
  let maxS = limits[0];
  let maxL = limits[1];
  let minS = limits[2];
  let minL = limits[3];


  if (maxS === -1 || maxL === -1 || minS === -1 || minL === -1) {
    maxS = 100;
    maxL = 100;
    minS = 0;
    minL = 0;
    satValue = Number(saturation);
    lightValue = Number(lightness);
    hslColor.setAttribute("s", satValue.toString());
    hslColor.setAttribute("l", lightValue.toString());
  } else {
    hslColor.setAttribute("s", maxS.toString());
    hslColor.setAttribute("l", maxL.toString());
  }
  // Si el color es el de branding, se actualiza el color de la paleta
  if (slot) {
    // Cambiar el color del texto para que sea adecuado dependiendo del color que se añada
    const textColor = chooseTextColor([Number(hue), Number(saturation), Number(lightness)]);
    (slot as HTMLElement).style.color = textColor;
    (hslColor as HTMLElement).style.color = textColor;
    slot.style.backgroundColor = color;
    const text = document.getElementById("contrast-text-" + id);
    if (text) {
      if (limits[0] === -1) {
        text.classList.remove("hidden");
      } else {
        text.classList.add("hidden");
      }
    }
    const editBox = slot.parentElement!.childNodes[3].childNodes;
    editBox.forEach((child) => {
      if (child instanceof HTMLElement) {
        if (child.classList.contains("slider-container")) {
          if (select!.value === "hsl") {
            child.childNodes.forEach((element) => {
              if (element instanceof HTMLInputElement) {
                const type = element.id.split("-")[0];
                if (type === "hue") {
                  element.value = hue!;
                } else if (type === "lightness") {
                  element.min = minL.toString();
                  element.max = maxL.toString();
                  element.value = lightValue.toString();
                } else {
                  element.min = minS.toString();
                  element.max = maxS.toString();
                  element.value = satValue.toString();
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
          colors.push((hueNumber - angleAnalogous + 360) % 360);
          colors.push((hueNumber + angleAnalogous + angleAnalogous) % 360);
          colors.push((hueNumber - angleAnalogous - angleAnalogous + 360) % 360);
          break;
      case "complementary":  // +30 - 30
          // Colores complementarios (Hue +180°)
          const angleComplementary = Number(complementarySlider.value);
          colors.push(hueNumber);
          colors.push((hueNumber + angleComplementary) % 360);
          break;
      case "split-complementary": // 0 a 60
          // Split complementarios (Hue ±150°)
          const angleSplit = Number(splitSlider.value);
          colors.push(hueNumber);
          colors.push((hueNumber + angleSplit) % 360);
          colors.push((hueNumber - angleSplit + 360) % 360);
          break;
      case "triad":  // +30 -30
          // Triadas (Hue ±120°)
          const angleTriad = Number(triadSlider.value);
          colors.push(hueNumber);
          colors.push((hueNumber + angleTriad) % 360);
          colors.push((hueNumber - angleTriad + 360) % 360);
          break;
      case "square":  // +30 -30
          // Cuadrado (Hue ±90° y ±180°)
          const angleSquare = Number(squareSlider.value);
          colors.push(hueNumber);
          colors.push((hueNumber + angleSquare) % 360);
          colors.push((hueNumber + angleSquare + angleSquare) % 360);
          colors.push((hueNumber - angleSquare + 360) % 360);
          break;
      default:
          // Si no hay esquema, solo devuelve el tono base
          colors.push(hueNumber);
  }
  return colors;
}

// Función para calcular el valor de la luminosidad de un solo color
function calculateLuminance(color: Array<number>): number {
  // Paso 1
  let red = color[0] / 255;
  let green = color[1] / 255;
  let blue = color[2] / 255;

  // Paso 2 y 3
  red = red <= 0.03928 ? red / 12.92 : Math.pow((red + 0.055) / 1.055, 2.4);
  green = green <= 0.03928 ? green / 12.92 : Math.pow((green + 0.055) / 1.055, 2.4);
  blue = blue <= 0.03928 ? blue / 12.92 : Math.pow((blue + 0.055) / 1.055, 2.4);

  // Paso 4
  return(0.2126 * red + 0.7152 * green + 0.0722 * blue);
}

// Función para calcular el contraste entre dos colores según su luminosidad
function calculateContrast(l1: number, l2: number): number {
  return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
}

// Función para calcular el contraste entre dos colores
function calculateColorContrast(color1: Array<number>, color2: Array<number>): number {
  let l1 = calculateLuminance(color1);
  let l2 = calculateLuminance(color2);
  // Paso 5: El mas grande en el numerador
  [l1, l2] = [Math.max(l1, l2), Math.min(l1, l2)];
  return (l1 + 0.05) / (l2 + 0.05);
}

// Función para calcular el color blanco (devuelve el color en hsl)
function calculateWhite(hue: number) {
  return [hue, 20, 95];
}

// Función para calcular el color negro (devuelve el color en hsl)
function calculateBlack(hue: number) {
  return [hue, 10, 10];
}

// Función que elige si el texto es blanco o negro en base al fondo pasado
function chooseTextColor(background: number[]) {
  const white = calculateWhite(background[0]);
  const black = calculateBlack(background[0]);
  const rgbBackground = hslToRgb(background[0], background[1], background[2]);
  const rgbWhite = hslToRgb(white[0], white[1], white[2]);
  const rgbBlack = hslToRgb(black[0], black[1], black[2]);
  const c1 = calculateColorContrast(rgbBackground, rgbWhite);
  const c2 = calculateColorContrast(rgbBackground, rgbBlack);
  return c1 > c2 ? `hsl(${white[0]}, ${white[1]}%, ${white[2]}%)` : `hsl(${black[0]}, ${black[1]}%, ${black[2]}%)`;
}

function updatePalettes() {
  if (!colorScheme || !satSlider1 || !lightSlider1
  || !hueSlider || !satSlider2 || !lightSlider2) return;
  // Actualizamos las dos paletas con los valores actuales de los sliders y esquema
  createPalette(palette1, hueSlider.value, satSlider1.value, lightSlider1.value, colorScheme.value);
  createPalette(palette2, hueSlider.value, satSlider2.value, lightSlider2.value, colorScheme.value);
}

function createAll() {
  drawColorWheels();
  createCircles(firstWheelCanvas.parentElement!, false);
  createCircles(secondWheelCanvas.parentElement!, true);
}
function updateAll() {
  updateCircles(firstWheelCanvas.parentElement!, false);
  updateCircles(secondWheelCanvas.parentElement!, true);
}

// Exportar como si fuera módulo
(window as any).updateAll = updateAll; 
window.addEventListener("resize", () => {
  updateAll();
});