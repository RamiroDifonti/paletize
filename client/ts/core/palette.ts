// palette.ts
// This file contains the logic for the palette in the HTML file

import { createAll, updateAll } from "./colorWheel.js";
import { exportColors } from "../utils/conversor.js";
import { updateOneCircle } from "../handlers/handleCircles.js";
import { chromaSlider1, satSlider1, lightSlider1, hueSlider, analogousSlider, splitSlider, triadSlider, complementarySlider, squareSlider } from "../constants/sliders.js";
import { chromaValue1, satValue1, lightValue1, hueValue, analogousValue, splitValue, triadValue, complementaryValue, squareValue } from "../constants/values.js";
import { colorScheme, select, contrastC, contrastS, contrastL, wcag } from "../constants/selects.js";
import { loadPalette } from "../handlers/handlePalettes.js";
import { palette1, palette2 } from "../constants/palette.js";
import { updateSeparation } from "../handlers/schemeHandler.js";

document.addEventListener("DOMContentLoaded", async () => {
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
    connectSliderWithNumber(chromaSlider1, chromaValue1, createAll);
    connectSliderWithNumber(hueSlider, hueValue, createAll);

    connectSliderWithNumber(analogousSlider, analogousValue, updateAll);
    connectSliderWithNumber(triadSlider, triadValue, updateAll);
    connectSliderWithNumber(complementarySlider, complementaryValue, updateAll);
    connectSliderWithNumber(splitSlider, splitValue, updateAll);
    connectSliderWithNumber(squareSlider, squareValue, updateAll);
    
    colorContainers.forEach((container) => {
      const colorDiv = container.querySelector<HTMLElement>(".color");
      const editButton = container.querySelector<HTMLButtonElement>(".edit-icon");
      if (!colorDiv || !editButton) return;
  
      let colorId = colorDiv.id.split("-")[1]; // "1", "2", etc.
  
      const panel = container.querySelector<HTMLElement>(`#panel-${colorId}`)!;
      const satSlider = container.querySelector<HTMLInputElement>(`#saturation-${colorId}`)!;
      const lightSlider = container.querySelector<HTMLInputElement>(`#lightness-${colorId}`)!;
      const chromaSlider = container.querySelector<HTMLInputElement>(`#chroma-${colorId}`)!;

      const satNumber = container.querySelector<HTMLInputElement>(`#saturation-value-${colorId}`)!;
      const lightNumber = container.querySelector<HTMLInputElement>(`#lightness-value-${colorId}`)!;
      const chromaNumber = container.querySelector<HTMLInputElement>(`#chroma-value-${colorId}`)!;

      // Poner un texto si no cumple con el contraste
      const text = document.createElement("label");
      text.id = "contrast-text-" + colorId;
      text.innerText = `Contraste no accesible`;
      text.style.textAlign = "center";
      (container.childNodes[3] as HTMLElement).appendChild(text);
      
      // Mostrar/Ocultar panel al hacer clic
      editButton.addEventListener("click", () => {
        // Eliminar el panel de conversor si está visible
        const expContainer = document.querySelectorAll<HTMLElement>(".export-container");
        // Mostrar u ocultar TODOS los panels
        const shouldShow = !panel.classList.contains("show");
        document.querySelectorAll<HTMLElement>(".editor-panel").forEach((p, index) => {
          if (shouldShow && p.getAttribute("palette") !== "1") {
            p.classList.add("show");
            expContainer[index].classList.remove("show");
          } else {
            p.classList.remove("show");
            expContainer[index].classList.add("show");
          }
        });
        updateAll();
      });
      exportColors();

      // Función que actualiza el color en CSS
      const updateColor = () => {
        const colorElement = document.getElementById(`color-checkbox-${colorId}`) as HTMLElement;
        const parent = colorElement?.parentElement;
        if (!parent) return;

        if (satSlider.value !== satSlider.getAttribute("previousValue") && (satSlider.getAttribute("previousValue") !== null || satNumber.getAttribute("previousValue") !== null)) {
          satSlider.setAttribute("previousValue", satSlider.value);
          satNumber.setAttribute("previousValue", satSlider.value);
          let color = "black";
          const movingCircle = `circle-${color}-lh`;
          const stationaryCircle = `circle-${color}-sh`;

          const elements = document.querySelectorAll(`[id^="${movingCircle}"]`);
          const colorDiv = document.getElementById(`color-${colorId}`) as HTMLDivElement;
          elements.forEach((element, index) => {
            const circle = element as HTMLDivElement;
            const circleLH = document.getElementById(`${stationaryCircle}-${index}`) as HTMLDivElement;
            if (circle.style.backgroundColor === colorDiv.style.backgroundColor) {
              const colorPalette = parent.childNodes[index] as HTMLDivElement;
              const hue = colorPalette.getAttribute("h");
              (colorPalette.childNodes[1] as HTMLDivElement).style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
              colorDiv.style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
              circle.style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
              circleLH.style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
              updateOneCircle(circle, satSlider.valueAsNumber);
              return;
            }
          });
          return;
        } else if (lightSlider.value !== lightSlider.getAttribute("previousValue") && (lightSlider.getAttribute("previousValue") !== null || lightNumber.getAttribute("previousValue") !== null)) {
          lightSlider.setAttribute("previousValue", lightSlider.value);
          lightNumber.setAttribute("previousValue", lightSlider.value);
          let color = "black";
          const movingCircle = `circle-${color}-sh`;
          const stationaryCircle = `circle-${color}-lh`;

          const elements = document.querySelectorAll(`[id^="${movingCircle}"]`);
          const colorDiv = document.getElementById(`color-${colorId}`) as HTMLDivElement;
          elements.forEach((element, index) => {
            const circle = element as HTMLDivElement;
            const circleLH = document.getElementById(`${stationaryCircle}-${index}`) as HTMLDivElement;
            if (circle.style.backgroundColor === colorDiv.style.backgroundColor) {
              const colorPalette = parent.childNodes[index] as HTMLDivElement;
              const hue = colorPalette.getAttribute("h");
              let bgString = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
              if (select.value === "oklch") {
                bgString = `oklch(${lightSlider.value}% ${chromaSlider.value} ${hue})`;
              }
              (colorPalette.childNodes[1] as HTMLDivElement).style.backgroundColor = bgString;
              colorDiv.style.backgroundColor = bgString;
              circle.style.backgroundColor = bgString;
              circleLH.style.backgroundColor = bgString;
              updateOneCircle(circle, lightSlider.valueAsNumber);
              return;
            }
          });
          return;
        } else if (chromaSlider.value !== chromaSlider.getAttribute("previousValue") && (chromaSlider.getAttribute("previousValue") !== null || chromaNumber.getAttribute("previousValue") !== null)) {
          chromaSlider.setAttribute("previousValue", chromaSlider.value);
          chromaSlider.setAttribute("previousValue", chromaSlider.value);
          let color = "black";
          const stationaryCircle = `circle-${color}-sh`;
          const movingCircle = `circle-${color}-lh`;

          const elements = document.querySelectorAll(`[id^="${movingCircle}"]`);
          const colorDiv = document.getElementById(`color-${colorId}`) as HTMLDivElement;
          elements.forEach((element, index) => {
            const circle = element as HTMLDivElement;
            const circleLH = document.getElementById(`${stationaryCircle}-${index}`) as HTMLDivElement;
            if (circle.style.backgroundColor === colorDiv.style.backgroundColor) {
              const colorPalette = parent.childNodes[index] as HTMLDivElement;
              const hue = colorPalette.getAttribute("h");
              (colorPalette.childNodes[1] as HTMLDivElement).style.backgroundColor = `oklch(${lightSlider.value}% ${chromaSlider.value} ${hue})`;
              colorDiv.style.backgroundColor = `oklch(${lightSlider.value}% ${chromaSlider.value} ${hue})`;
              circle.style.backgroundColor = `oklch(${lightSlider.value}% ${chromaSlider.value} ${hue})`;
              circleLH.style.backgroundColor = `oklch(${lightSlider.value}% ${chromaSlider.value} ${hue})`;
              updateOneCircle(circle, chromaSlider.valueAsNumber);
              return;
            }
          });
          return;
        }
      };
  
      // Sincronizar sliders y números
      connectSliderWithNumber(satSlider, satNumber, updateColor);
      connectSliderWithNumber(lightSlider, lightNumber, updateColor);
      connectSliderWithNumber(chromaSlider, chromaNumber, updateColor);
      // Inicializa el color
      createAll();
    });
    
    const id = window.location.href.split("/").pop();
    if (!id || id === "palette") {
      document.querySelector(".selection")?.classList.add("hidden");
      return;
    }
    try {
      const res = await fetch(`/api/palette/${id}`);
      const palette = await res.json();
      (document.querySelector('[name="name"]') as HTMLInputElement).value = palette.name;
      select.value = palette.colorModel;

      contrastL.value = palette.secondContrast;
      colorScheme.value = palette.colorScheme;
      wcag.value = palette.wcagLevel;
      
      updateSeparation(palette.colorSeparation);
      // Borrar los colores de las paletas
      palette1.innerHTML = "";
      palette2.innerHTML = "";
      for (let i = 1; i <= 5; i++) {
        const slot = document.getElementById(`color-${i}`);
        if (slot) {
          (slot.childNodes[1] as HTMLDivElement).style.backgroundColor = "";
          slot.parentElement?.classList.add("hidden");
        }
      }
      if (palette.colorModel === "hsl") {
        const hBrand = palette.brandColor.split(",")[0].split("(")[1].trim();
        const sBrand = palette.brandColor.split(",")[1].split("%")[0].trim();
        const lBrand = palette.brandColor.split(",")[2].split(")")[0].split("%")[0].trim();
        
        satSlider1.value = sBrand;
        satValue1.value = sBrand;
        lightSlider1.value = lBrand;
        lightValue1.value = lBrand;
        hueSlider.value = hBrand;
        hueValue.value = hBrand;
        contrastS.value = palette.firstContrast;
        const palettes = palette.colors;

        createAll();
        updateAll();

        const checkboxes = document.querySelectorAll<HTMLInputElement>(".color-checkbox");
        palettes.forEach((color: string) => {
          const h = color.split(",")[0].split("(")[1].trim();
          const s = color.split(",")[1].split("%")[0].trim();
          const l = color.split(",")[2].split(")")[0].split("%")[0].trim();
          for (const checkbox of checkboxes) {
            const colorBox = checkbox.parentElement as HTMLDivElement;
            if (
              colorBox.getAttribute("h") === h &&
              colorBox.getAttribute("s") === s &&
              colorBox.getAttribute("l") === l
            ) {

              checkbox.checked = true;
              break;
            }
          }
        });
      } else {
        const hBrand = palette.brandColor.split(" ")[2].trim().split(")")[0];
        const sBrand = palette.brandColor.split(" ")[1].trim();
        const lBrand = palette.brandColor.split(" ")[0].trim().split("%")[0].split("(")[1];

        chromaSlider1.value = sBrand;
        chromaValue1.value = sBrand;
        lightSlider1.value = lBrand;
        lightValue1.value = lBrand;
        hueSlider.value = hBrand;
        hueValue.value = hBrand;
        contrastC.value = palette.firstContrast;
        const palettes = palette.colors;

        createAll();
        updateAll();
        
        const checkboxes = document.querySelectorAll<HTMLInputElement>(".color-checkbox");
        palettes.forEach((color: string) => {
          const h = color.split(" ")[2].trim().split(")")[0];
          const c = color.split(" ")[1].trim();
          const l = color.split(" ")[0].trim().split("%")[0].split("(")[1];
          for (const checkbox of checkboxes) {
            const colorBox = checkbox.parentElement as HTMLDivElement;
            if (
              colorBox.getAttribute("h") === h &&
              colorBox.getAttribute("s") === c &&
              colorBox.getAttribute("l") === l
            ) {
              checkbox.checked = true;
              break;
            }
          }
        });
      }
      // createAll();

      const response = await fetch("/api/profile", { credentials: "include" });
      if (!response.ok) {
          throw new Error("No autorizado");
      }
      const user = await response.json();
      const like = document.getElementById("like") as HTMLInputElement;
      like.addEventListener("click", async () => {
        if (like.children[0].classList.contains("bi-heart-fill")) {
          like.children[0].classList.add("bi-heart");
          like.children[0].classList.remove("bi-heart-fill");
        } else {
          like.children[0].classList.remove("bi-heart");
          like.children[0].classList.add("bi-heart-fill");
        }
        await fetch(`/api/palette/like/${palette._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
      });
      if(palette.likes.includes(user.id)) {
        like.children[0].classList.remove("bi-heart");
        like.children[0].classList.add("bi-heart-fill");
      }
      loadPalette(palette1, palette.colorScheme);
      loadPalette(palette2, palette.colorScheme);
      updateAll();
    } catch (error) {
    console.error("Error al cargar paleta:", error);
  }
});