// handlePalettes.ts
// This file contains the functions to handle the palettes in the HTML file
import { colorblind, select, colorScheme } from "../constants/selects.js";
import { simulateColorBlind } from "../utils/colorblind.js";
import { palette1, palette2 } from "../constants/palette.js";
import { hueSlider, satSlider1, lightSlider1, satSlider2, lightSlider2 } from "../constants/sliders.js";

import { calculateColors, limitColor, chooseTextColor } from "../utils/utils.js";
import { updateExports } from "../utils/conversor.js";
import { hsl } from "culori";

// Crear las paletas
export function createPalette(container: HTMLElement, hue: string, saturation: string, lightness: string, scheme : string) {
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
      if (colorBox.getAttribute("branding") !== "true" && colorBox.getAttribute("branding") !== "secondary") {
        if (limits[0] !== -1) {
          boxSaturation = limits[0] === 100 ? limits[2] : limits[0];
          boxLightness = limits[1] === 100 ? limits[3] : limits[1];
        }
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
      colorBox.setAttribute("h", adjustedHue.toString());
      colorBox.setAttribute("s", boxSaturation.toString());
      colorBox.setAttribute("l", boxLightness.toString());
      // Creamos el checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("color-checkbox");
    
      // Listener para manejar cuando se activa el checkbox
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          addColor(colorBox, limits);
          // Updatear el conversor de colores
          updateExports();
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

// Función para añadir un color a la paleta
function addColor(hslColor: HTMLDivElement, limits: number[]) {
  // Leemos todos los colores de la paleta y comprobamos si hay espacio,
  // si no hay espacio, se desmarca el checkbox y se muestra un mensaje
  const hue = hslColor.getAttribute("h");
  const saturation = hslColor.getAttribute("s");
  const lightness = hslColor.getAttribute("l");
  const isBranding = hslColor.getAttribute("branding") === "true" ? true : false;
  let maxS = 100;
  let maxL = 100;
  let minS = 0;
  let minL = 0;
  let satValue = Number(saturation);
  let lightValue = Number(lightness);
  hslColor.setAttribute("s", satValue.toString());
  hslColor.setAttribute("l", lightValue.toString());

  if (hslColor.getAttribute("branding") !== "true" && hslColor.getAttribute("branding") !== "secondary") {
    maxS = limits[0];
    maxL = limits[1];
    minS = limits[2];
    minL = limits[3];
    satValue = limits[0] === 100 ? limits[2] : limits[0];
    lightValue = limits[1] === 100 ? limits[3] : limits[1];
    hslColor.setAttribute("s", maxS.toString());
    hslColor.setAttribute("l", maxL.toString());
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

      const textColor = chooseTextColor([Number(hue), Number(satValue), Number(lightValue)]);
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
      (colors[index] as HTMLDivElement).style.backgroundColor = "";
      (colors[index] as HTMLDivElement).style.color = "";
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


  let maxS = 100;
  let maxL = 100;
  let minS = 0;
  let minL = 0;
  let satValue = Number(saturation);
  let lightValue = Number(lightness);
  hslColor.setAttribute("s", satValue.toString());
  hslColor.setAttribute("l", lightValue.toString());
  if (hslColor.getAttribute("branding") !== "true" && hslColor.getAttribute("branding") !== "secondary") {
    maxS = limits[0];
    maxL = limits[1];
    minS = limits[2];
    minL = limits[3];
    satValue = limits[0] === 100 ? limits[2] : limits[0];
    lightValue = limits[1] === 100 ? limits[3] : limits[1];
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
      if (hslColor.getAttribute("branding") !== "true" && hslColor.getAttribute("branding") !== "secondary") {
        if (limits[0] === -1) {
          text.classList.remove("hidden");
        } else {
          text.classList.add("hidden");
        } 
      } else {
        text.classList.contains("hidden") ? "" : text.classList.add("hidden");
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

export function updatePalettes() {
  // Actualizamos las dos paletas con los valores actuales de los sliders y esquema
  createPalette(palette1, hueSlider.value, satSlider1.value, lightSlider1.value, colorScheme.value);
  createPalette(palette2, hueSlider.value, satSlider2.value, lightSlider2.value, colorScheme.value);
}