// palette.ts
// This file contains the logic for the palette in the HTML file

import { createAll, updateAll } from "./colorWheel.js";
import { exportColors, updateExports } from "../utils/conversor.js";
import { updateOneCircle } from "../handlers/handleCircles.js";
import { satSlider1, lightSlider1, hueSlider, analogousSlider, splitSlider, triadSlider, complementarySlider, squareSlider } from "../constants/sliders.js";
import { satValue1, lightValue1, hueValue, analogousValue, splitValue, triadValue, complementaryValue, squareValue } from "../constants/values.js";

document.addEventListener("DOMContentLoaded", () => {
    // Contenedores de colores
    const colorContainers = document.querySelectorAll<HTMLElement>(".color-container");

    // Función para sincronizar slider y número
    const connectSliderWithNumber = (
      slider: HTMLInputElement,
      numberInput: HTMLInputElement,
      onChange: () => void,
      min: number = 0
    ) => {
      // Slider mueve número
      slider.addEventListener("input", () => {
        if (min != 0) {
          numberInput.min = min.toString();
        }
        if (slider.valueAsNumber < min) {
          slider.value = min.toString();
        }
        numberInput.setAttribute("previousValue", numberInput.value);
        numberInput.value = slider.value;
        onChange();
      });
  
      // Número mueve slider
      numberInput.addEventListener("input", () => {
        slider.setAttribute("previousValue", slider.value);
        let val = Number(numberInput.value);
        if (val < Number(slider.min)) val = Number(slider.min);
        if (val > Number(slider.max)) val = Number(slider.max);
        slider.value = val.toString();
        onChange();
      });
    };
    connectSliderWithNumber(satSlider1, satValue1, createAll);
    connectSliderWithNumber(lightSlider1, lightValue1, createAll);
    connectSliderWithNumber(hueSlider, hueValue, createAll);

    connectSliderWithNumber(analogousSlider, analogousValue, updateAll);
    connectSliderWithNumber(triadSlider, triadValue, updateAll);
    connectSliderWithNumber(complementarySlider, complementaryValue, updateAll);
    connectSliderWithNumber(splitSlider, splitValue, updateAll);
    connectSliderWithNumber(squareSlider, squareValue, updateAll);
    
    colorContainers.forEach((container) => {
      const colorDiv = container.querySelector<HTMLElement>(".color");
      const editButton = container.querySelector<HTMLButtonElement>(".edit-icon");
      const exportButton = container.querySelector<HTMLButtonElement>(".export-icon");
      if (!colorDiv || !editButton || !exportButton) return;
  
      let colorId = colorDiv.id.split("-")[1]; // "1", "2", etc.
  
      const panel = container.querySelector<HTMLElement>(`#panel-${colorId}`);
      const satSlider = container.querySelector<HTMLInputElement>(`#saturation-${colorId}`);
      const lightSlider = container.querySelector<HTMLInputElement>(`#lightness-${colorId}`);
  
      const satNumber = container.querySelector<HTMLInputElement>(`#saturation-value-${colorId}`);
      const lightNumber = container.querySelector<HTMLInputElement>(`#lightness-value-${colorId}`);
      
      // Poner un texto si no cumple con el contraste
      const text = document.createElement("label");
      if (colorId !== "1") {
        text.id = "contrast-text-" + colorId;
        text.innerText = `No cumple con ningún contraste`;
        text.style.wordBreak = "break-word";
        text.style.textAlign = "center";
        (container.childNodes[3] as HTMLElement).appendChild(text);
      }
      
      if (
        !panel || !satSlider || !lightSlider || !satNumber || !lightNumber
      ) return;
  
      // Mostrar/Ocultar panel al hacer clic
      editButton.addEventListener("click", () => {
        // Eliminar el panel de conversor si está visible
        document.querySelectorAll<HTMLElement>(".export-container").forEach((p) => {
          p.classList.remove("show");
        });
        // Mostrar u ocultar TODOS los panels
        const shouldShow = !panel.classList.contains("show");
        document.querySelectorAll<HTMLElement>(".editor-panel").forEach((p) => {
          if (shouldShow && p.getAttribute("branding") !== "true") {
            p.classList.add("show");
          } else {
            p.classList.remove("show");
          }
        });
        updateAll();
      });
      exportColors();
      exportButton.addEventListener("click", () => {
        // Eliminar el panel de edición si está visible
        document.querySelectorAll<HTMLElement>(".editor-panel").forEach((p) => {
          const shouldShow = p.classList.contains("show");
            if (shouldShow) {
              p.classList.remove("show");
            }
        });
        document.querySelectorAll<HTMLElement>(".export-container").forEach((p) => {
          p.classList.contains("show") ? p.classList.remove("show") : p.classList.add("show");
        });
        updateExports();
      });

      // Función que actualiza el color en CSS
      const updateColor = () => {
        const colorElement = document.getElementById(`color-checkbox-${colorId}`) as HTMLElement;
        const parent = colorElement?.parentElement;
        if (!parent) return;

        if (satSlider.value !== satSlider.getAttribute("previousValue") && (satSlider.getAttribute("previousValue") !== null || satNumber.getAttribute("previousValue") !== null)) {
          satSlider.setAttribute("previousValue", satSlider.value);
          satNumber.setAttribute("previousValue", satSlider.value);
          let color
          let wheelText;
          if (parent?.id === "palette-1") {
            wheelText = "lh";
            color = "white";
          } else {
            wheelText = "sh";
            color = "black";
          }
          const circleString = `circle-${color}-${wheelText}`;
          const elements = document.querySelectorAll(`[id^="${circleString}"]`);
          const colorDiv = document.getElementById(`color-${colorId}`) as HTMLDivElement;
          elements.forEach((element, index) => {
            const circle = element as HTMLDivElement;
            if (circle.style.backgroundColor === colorDiv.style.backgroundColor) {
              const colorPalette = parent.childNodes[index] as HTMLDivElement;
              const hue = colorPalette.getAttribute("h");
              colorPalette.style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
              colorDiv.style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
              circle.style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
              // Solo se deberia mover si el color circulo es de la paleta derecha
              if (parent?.id === "palette-1" && color === "white") {
                updateOneCircle(circle, satSlider.valueAsNumber);
              }
              return;
            }
          });
          return;
        } else if (lightSlider.value !== lightSlider.getAttribute("previousValue") && (lightSlider.getAttribute("previousValue") !== null || lightNumber.getAttribute("previousValue") !== null)) {
          lightSlider.setAttribute("previousValue", lightSlider.value);
          lightNumber.setAttribute("previousValue", lightSlider.value);
          let color
          let wheelText;
          if (parent?.id === "palette-1") {
            wheelText = "lh";
            color = "white";
          } else {
            wheelText = "sh";
            color = "black";
          }

          const circleString = `circle-${color}-${wheelText}`;
          const elements = document.querySelectorAll(`[id^="${circleString}"]`);
          const colorDiv = document.getElementById(`color-${colorId}`) as HTMLDivElement;
          elements.forEach((element, index) => {
            const circle = element as HTMLDivElement;
            if (circle.style.backgroundColor === colorDiv.style.backgroundColor) {
              const colorPalette = parent.childNodes[index] as HTMLDivElement;
              const hue = colorPalette.getAttribute("h");
              colorPalette.style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
              colorDiv.style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
              circle.style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
              // Solo se deberia mover si el color circulo es de la paleta izquierda
              if (parent?.id === "palette-2" && color === "black") {
                updateOneCircle(circle, lightSlider.valueAsNumber);
              }
              return;
            }
          });
          return;
        }
      };
  
      // Sincronizar sliders y números
      connectSliderWithNumber(satSlider, satNumber, updateColor);
      connectSliderWithNumber(lightSlider, lightNumber, updateColor);
  
      // Inicializa el color
      createAll();
    });
});