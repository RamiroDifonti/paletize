// handlePalettes.ts
// This file contains the functions to handle the palettes in the HTML file
import { colorblind, select, colorScheme, wcag } from "../constants/selects.js";
import { simulateColorBlind } from "../utils/colorblind.js";
import { palette1, palette2 } from "../constants/palette.js";
import { hueSlider, satSlider1, lightSlider1, chromaSlider1 } from "../constants/sliders.js";

import { calculateColors, limitColor, chooseTextColor, calculateLuminance, calculateContrast } from "../utils/utils.js";
import { updateExports, hslToRgb, oklchToRgb } from "../utils/conversor.js";
import { updateAll } from "../core/colorWheel.js";

// Crear las paletas
export function createPalette(container: HTMLElement, scheme : string) {
  const colorBoxs = container.querySelectorAll(".color-box");
  // Primero se comprueba si se los color-box ya están creados o no
  if (colorBoxs.length > 0) {
    const hue = hueSlider.value;
    let saturation = satSlider1.value;
    if (select?.value === "oklch") {
      saturation = chromaSlider1.value;
    }
    const lightness = lightSlider1.value;
    
    const hues = calculateColors(hue, scheme); 
    // Si ya existen, actualizamos los colores de fondo y comprobamos si su checkbox está marcado
    (colorBoxs as NodeListOf<HTMLDivElement>).forEach((colorBox, index) => {
      let adjustedHue = hues[index];

      const limits = limitColor(Number(hue), Number(adjustedHue), Number(saturation), Number(lightness));

      // Actualizar el rango WCAG
      const label = (colorBox.childNodes[0] as HTMLDivElement).childNodes[0] as HTMLLabelElement;
      if (limits[0] !== -1) {
        label.innerText = wcag.value === "aa" ? "AA" : "AAA";
      } else {
        label.innerText = "N/A";
      }
      let boxSaturation = Number(saturation);
      let boxLightness = Number(lightness);
      colorBox.setAttribute("contrast", limits[4].toFixed(3));
      if (container.id !== "palette-1") {
        if (limits[0] !== -1) {
          boxSaturation = limits[0] === 100 ? limits[2] : limits[0];
          boxLightness = limits[1] === 100 ? limits[3] : limits[1];
        }
      }
      if (container.classList.contains("colorblind")) {
        const colorblindType = colorblind?.value as "protanopia" | "deuteranopia" | "tritanopia";
        if (select?.value === "oklch") {
          [boxLightness, boxSaturation, adjustedHue] = simulateColorBlind(adjustedHue, boxSaturation, boxLightness, colorblindType);
        } else {
          [adjustedHue, boxSaturation, boxLightness] = simulateColorBlind(adjustedHue, boxSaturation, boxLightness, colorblindType);
        }
      }

      let bgString = `hsl(${adjustedHue}, ${boxSaturation}%, ${boxLightness}%)`;
      if (select?.value === "oklch") {
        bgString = `oklch(${boxLightness}% ${boxSaturation} ${adjustedHue})`;
      }
      (colorBox.childNodes[1] as HTMLDivElement).style.backgroundColor = bgString;
      colorBox.setAttribute("h", adjustedHue.toString());
      colorBox.setAttribute("s", boxSaturation.toString());
      colorBox.setAttribute("l", boxLightness.toString());
      const checkbox = colorBox.childNodes[2] as HTMLInputElement;
      // Si el checkbox está marcado, actualizamos el color en la paleta
      if (checkbox.checked) {
        updateColor(colorBox, limits);
      }
    });
  // Si no existen, creamos los nuevos colores
  } else {
    const hue = hueSlider.value;
    const hues = calculateColors(hue, scheme); 
    hues.forEach((adjustedHue, index) => {
      // Creamos un nuevo elemento div para cada color
      const colorBox = document.createElement("div");
      colorBox.classList.add("color-box");

      // Texto si es AA, AAA o N/A
      const colorText = document.createElement("div");
      colorText.classList.add("color-text");
      // Preview del color
      const colorPreview = document.createElement("div");
      colorPreview.classList.add("color-preview");
    
      // Creamos el checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      checkbox.classList.add("color-checkbox");
      colorBox.appendChild(colorText);
      colorBox.appendChild(colorPreview);
      colorBox.appendChild(checkbox);
      // Listener para manejar cuando se activa el checkbox
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          let saturation = satSlider1.value;
          if (select?.value === "oklch") {
            saturation = chromaSlider1.value;
          }
          const lightness = lightSlider1.value;
          const newHue = hueSlider.value;
          adjustedHue = calculateColors(hueSlider.value, scheme)[index];
          const limits = limitColor(Number(newHue), Number(adjustedHue), Number(saturation), Number(lightness));
          let boxSaturation = Number(saturation);
          let boxLightness = Number(lightness);
          if (limits[0] !== -1 && container.id !== "palette-1") {
            boxSaturation = limits[0] === 100 ? limits[2] : limits[0];
            boxLightness = limits[1] === 100 ? limits[3] : limits[1];
          }
          if (container.classList.contains("colorblind")) {
            const colorblindType = colorblind?.value as "protanopia" | "deuteranopia" | "tritanopia";
            if (select?.value === "oklch") {
              [boxLightness, boxSaturation, adjustedHue] = simulateColorBlind(adjustedHue, boxSaturation, boxLightness, colorblindType);
            } else {
              [adjustedHue, boxSaturation, boxLightness] = simulateColorBlind(adjustedHue, boxSaturation, boxLightness, colorblindType);
            }
          }
          let bgString = `hsl(${adjustedHue}, ${boxSaturation}%, ${boxLightness}%)`;
          if (select?.value === "oklch") {
            bgString = `oklch(${boxLightness}% ${boxSaturation} ${adjustedHue})`;
          }
          (colorBox.childNodes[1] as HTMLDivElement).style.backgroundColor = bgString;
          colorBox.setAttribute("h", adjustedHue.toString());
          colorBox.setAttribute("s", boxSaturation.toString());
          colorBox.setAttribute("l", boxLightness.toString());
          addColor(colorBox, limits);
          // Updatear el conversor de colores
          updateExports();
        } else {
          removeColor(colorBox);
        }
      });

      // Creamos el texto para el color de marca
      if (index === 0 && container.id === "palette-1") {
        const text = document.createElement("label");
        text.innerText = `Brand`;
        text.style.position = "absolute";
        text.style.alignSelf = "flex-end";
        // Cambiar el color del texto para que sea adecuado dependiendo del color de fondo
        colorPreview.appendChild(text);
        colorBox.setAttribute("branding", "true");
      }
      const saturation = satSlider1.value;
      const lightness = lightSlider1.value;
      const textColor = chooseTextColor([Number(hue), Number(saturation), Number(lightness)]);
      const limits = limitColor(Number(hue), Number(adjustedHue), Number(saturation), Number(lightness));
      const label = document.createElement("label");
      if (limits[0] !== -1) {
        label.innerText = wcag.value === "aa" ? "AA" : "AAA";
      } else {
        label.innerText = "N/A";
      }
      colorText.appendChild(label);
      colorPreview.style.color = textColor;
      container.appendChild(colorBox);
    });
  }
}

// Cargar las paletas
// Crear las paletas
export function loadPalette(container: HTMLElement, scheme : string) {
  const colorBoxs = container.querySelectorAll(".color-box");
  // Primero se comprueba si se los color-box ya están creados o no
  const hue = hueSlider.value;
  let saturation = satSlider1.value;
  if (select?.value === "oklch") {
    saturation = chromaSlider1.value;
  }
  const lightness = lightSlider1.value;

  const hues = calculateColors(hue, scheme); 
  // Si ya existen, actualizamos los colores de fondo y comprobamos si su checkbox está marcado
  (colorBoxs as NodeListOf<HTMLDivElement>).forEach((colorBox, index) => {
    let adjustedHue = hues[index];
    const limits = limitColor(Number(hue), Number(adjustedHue), Number(saturation), Number(lightness));

    let boxSaturation = Number(saturation);
    let boxLightness = Number(lightness);

    if (container.id !== "palette-1") {
      if (limits[0] !== -1) {
        boxSaturation = limits[0] === 100 ? limits[2] : limits[0];
        boxLightness = limits[1] === 100 ? limits[3] : limits[1];
      }
    }
    if (container.classList.contains("colorblind")) {
      const colorblindType = colorblind?.value as "protanopia" | "deuteranopia" | "tritanopia";
      if (select?.value === "oklch") {
        [boxLightness, boxSaturation, adjustedHue] = simulateColorBlind(adjustedHue, boxSaturation, boxLightness, colorblindType);
      } else {
        [adjustedHue, boxSaturation, boxLightness] = simulateColorBlind(adjustedHue, boxSaturation, boxLightness, colorblindType);
      }
    }

    let bgString = `hsl(${adjustedHue}, ${boxSaturation}%, ${boxLightness}%)`;
    if (select?.value === "oklch") {
      bgString = `oklch(${boxLightness}% ${boxSaturation} ${adjustedHue})`;
    }
    (colorBox.childNodes[1] as HTMLDivElement).style.backgroundColor = bgString;
    colorBox.setAttribute("h", adjustedHue.toString());
    colorBox.setAttribute("s", boxSaturation.toString());
    colorBox.setAttribute("l", boxLightness.toString());
    const checkbox = colorBox.childNodes[2] as HTMLInputElement;
    // Si el checkbox está marcado, actualizamos el color en la paleta
    if (checkbox.checked) {
      addColor(colorBox, limits);
    }
  });
}
// Función para añadir un color a la paleta
function addColor(hslColor: HTMLDivElement, limits: number[]) {
  // Leemos todos los colores de la paleta y comprobamos si hay espacio,
  // si no hay espacio, se desmarca el checkbox y se muestra un mensaje
  const hue = hslColor.getAttribute("h");
  const saturation = hslColor.getAttribute("s");
  const lightness = hslColor.getAttribute("l");
  const isBranding = hslColor.getAttribute("branding") === "true" ? true : false;
  let maxS = 100;
  if (select?.value === "oklch") {
    maxS = 0.4;
  }
  let maxL = 100;
  let minS = 0;
  let minL = 0;
  let satValue = Number(saturation);
  let lightValue = Number(lightness);
  hslColor.setAttribute("s", satValue.toString());
  hslColor.setAttribute("l", lightValue.toString());

  if ((hslColor.parentElement as HTMLDivElement).id !== "palette-1") {
    maxS = limits[0];
    maxL = limits[1];
    minS = limits[2];
    minL = limits[0] === -1 ? -1 : limits[3];
    satValue = limits[0] === 100 ? limits[2] : limits[0];
    if (select?.value === "oklch") {
      satValue = limits[0] === 0.4 ? limits[2] : limits[0];
    }
    lightValue = limits[1] === 100 ? limits[3] : limits[1];
    if (limits[0] !== -1) hslColor.setAttribute("s", maxS.toString());
    if (limits[0] !== -1) hslColor.setAttribute("l", maxL.toString());
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
      updateAll();
      return;
    } else if (slot && slot.style.backgroundColor === "") {
      // Cambiar fondo
      slot.setAttribute("h", hue!);
      slot.setAttribute("s", (satValue.toString() === "-1") ? saturation! : satValue.toString());
      slot.setAttribute("l", (lightValue.toString() === "-1") ? lightness! : lightValue.toString());
      slot.style.backgroundColor = (hslColor.childNodes[1] as HTMLDivElement).style.backgroundColor;

      const textColor = chooseTextColor([Number(hue), Number(satValue), Number(lightValue)]);
      slot.style.color = textColor;
      const text = document.getElementById("contrast-text-" + i);
      if (text) {
        if ((hslColor.parentElement as HTMLDivElement).id !== "palette-1") {
          slot.setAttribute("contrast", limits[4].toFixed(3));
          if (limits[0] === -1) {
            text.classList.remove("hidden");
            text.innerText = `Contraste no accesible: ${limits[4].toFixed(3)}`;
            (text.parentElement as HTMLDivElement).style.paddingBottom = "5%";
            (text.parentElement as HTMLDivElement).style.paddingTop = "5%";
          } else {
            text.classList.add("hidden");
            (text.parentElement as HTMLDivElement).style.paddingBottom = "15%";
            (text.parentElement as HTMLDivElement).style.paddingTop = "15%";
          } 
        } else {
          text.classList.contains("hidden") ? "" : text.classList.add("hidden");

          if (select?.value === "oklch") {
            const hueValue = hueSlider.value;
            const rgbBranding = oklchToRgb(Number(lightness) / 100, Number(saturation), Number(hueValue));
            const rgb = oklchToRgb(Number(lightness) / 100, Number(saturation), Number(hue));
            const l1 = calculateLuminance(rgbBranding);
            const l2 = calculateLuminance(rgb);
            const contrast = calculateContrast(l1, l2);
            slot.setAttribute("contrast", contrast.toFixed(3));
          } else {
            const hueValue = hueSlider.value;
            const rgbBranding = hslToRgb(Number(hueValue), Number(saturation), Number(lightness));
            const rgb = hslToRgb(Number(hue), Number(saturation), Number(lightness));
            const l1 = calculateLuminance(rgbBranding);
            const l2 = calculateLuminance(rgb);
            const contrast = calculateContrast(l1, l2);
            slot.setAttribute("contrast", contrast.toFixed(3));
          }
        }
      }
      // Que se muestre el padre
      slot.parentElement?.classList.remove("hidden");
      hslColor.id = "color-checkbox-" + i;
      const editBox = slot.parentElement!.childNodes[3];
      if ((hslColor.parentElement as HTMLDivElement).id === "palette-1") {
        if ((slot.childNodes[1] as HTMLInputElement).classList.contains("show")) {
          (slot.childNodes[1] as HTMLInputElement).classList.remove("show");
        }
        if ((editBox as HTMLElement).classList.contains("show")) {
          (editBox as HTMLElement).classList.remove("show");
        }
        (editBox as HTMLElement).setAttribute("palette", "1");
      } else {
        if (!(slot.childNodes[1] as HTMLInputElement).classList.contains("show")) {
          (slot.childNodes[1] as HTMLInputElement).classList.add("show");
        }
        (editBox as HTMLElement).setAttribute("palette", "2");
      }
      editBox.childNodes.forEach((child) => {
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
  (hslColor.childNodes[2] as HTMLInputElement).checked = false;  
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
    slot.style.color = "";
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
      ((colors[index] as HTMLDivElement).childNodes[1] as HTMLDivElement).style.backgroundColor = "";
      (colors[index] as HTMLDivElement).style.color = "";
      (colors[index] as HTMLDivElement).parentElement?.classList.add("hidden");
    }
  });
}

// Función para actualizar un color a la paleta
function updateColor(hslColor: HTMLDivElement, limits: number[]) {
  const color = (hslColor.childNodes[1] as HTMLDivElement).style.backgroundColor;
  const hslColorId = hslColor.id.split("-")[2];
  const id = parseInt(hslColorId);
  const slot = document.getElementById(`color-${id}`);

  // Modificar si cambia el limite

  const hue = hslColor.getAttribute("h");
  const saturation = hslColor.getAttribute("s");
  const lightness = hslColor.getAttribute("l");
  let maxS = 100;
  if (select?.value === "oklch") {
    maxS = 0.4;
  }
  let maxL = 100;
  let minS = 0;
  let minL = 0;
  let satValue = Number(saturation);
  let lightValue = Number(lightness);
  hslColor.setAttribute("s", satValue.toString());
  hslColor.setAttribute("l", lightValue.toString());
  if ((hslColor.parentElement as HTMLDivElement).id !== "palette-1") {
    maxS = limits[0];
    maxL = limits[1];
    minS = limits[2];
    minL = limits[0] === -1 ? -1 : limits[3];
    satValue = limits[0] === 100 ? limits[2] : limits[0];
    if (select?.value === "oklch") {
      satValue = limits[0] === 0.4 ? limits[2] : limits[0];
    }
    lightValue = limits[1] === 100 ? limits[3] : limits[1];
    if (maxS !== -1) hslColor.setAttribute("s", maxS.toString());
    if (maxS !== -1) hslColor.setAttribute("l", maxL.toString());
    slot?.setAttribute("contrast", limits[4].toFixed(3));
  } else {
    if (select?.value === "oklch") {
      const hueValue = hueSlider.value;
      const rgbBranding = oklchToRgb(Number(lightness) / 100, Number(saturation), Number(hueValue));
      const rgb = oklchToRgb(Number(lightness) / 100, Number(saturation), Number(hue));
      const l1 = calculateLuminance(rgbBranding);
      const l2 = calculateLuminance(rgb);
      const contrast = calculateContrast(l1, l2);
      slot?.setAttribute("contrast", contrast.toFixed(3));
    } else {
      const hueValue = hueSlider.value;
      const rgbBranding = hslToRgb(Number(hueValue), Number(saturation), Number(lightness));
      const rgb = hslToRgb(Number(hue), Number(saturation), Number(lightness));
      const l1 = calculateLuminance(rgbBranding);
      const l2 = calculateLuminance(rgb);
      const contrast = calculateContrast(l1, l2);
      slot?.setAttribute("contrast", contrast.toFixed(3));
    }
  }
  slot?.setAttribute("h", hue!);
  slot?.setAttribute("s", (satValue.toString() === "-1") ? saturation! : satValue.toString());
  slot?.setAttribute("l", (lightValue.toString() === "-1") ? lightness! : lightValue.toString());

  if (slot) {
    // Cambiar el color del texto para que sea adecuado dependiendo del color que se añada
    const textColor = chooseTextColor([Number(hue), Number(saturation), Number(lightness)]);
    (slot as HTMLElement).style.color = textColor;
    (hslColor.childNodes[1] as HTMLDivElement).style.color = textColor;
    slot.style.backgroundColor = color;
    const text = document.getElementById("contrast-text-" + id);
    if (text) {
      if ((hslColor.parentElement as HTMLDivElement).id !== "palette-1") {
        if (limits[0] === -1) {
          text.classList.remove("hidden");
          text.innerText = `Contraste no accesible: ${limits[4].toFixed(3)}`;
          (text.parentElement as HTMLDivElement).style.paddingBottom = "5%";
          (text.parentElement as HTMLDivElement).style.paddingTop = "5%";
        } else {
          text.classList.add("hidden");
          (text.parentElement as HTMLDivElement).style.paddingBottom = "15%";
          (text.parentElement as HTMLDivElement).style.paddingTop = "15%";
        } 
      } else {
        text.classList.contains("hidden") ? "" : text.classList.add("hidden");
      }
    }
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
                element.value = lightValue.toString();
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
  }
}

export function updatePalettes() {
  // Actualizamos las dos paletas con los valores actuales de los sliders y esquema
  createPalette(palette1, colorScheme.value);
  createPalette(palette2, colorScheme.value);
}