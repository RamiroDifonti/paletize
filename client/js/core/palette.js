// palette.ts
// This file contains the logic for the palette in the HTML file
import { createAll, updateAll } from "./colorWheel.js";
import { exportColors, updateExports } from "../utils/conversor.js";
import { updateOneCircle } from "../handlers/handleCircles.js";
import { chromaSlider1, satSlider1, lightSlider1, hueSlider, analogousSlider, splitSlider, triadSlider, complementarySlider, squareSlider } from "../constants/sliders.js";
import { chromaValue1, satValue1, lightValue1, hueValue, analogousValue, splitValue, triadValue, complementaryValue, squareValue } from "../constants/values.js";
import { select } from "../constants/selects.js";
document.addEventListener("DOMContentLoaded", () => {
    // Contenedores de colores
    const colorContainers = document.querySelectorAll(".color-container");
    // Función para sincronizar slider y número
    const connectSliderWithNumber = (slider, numberInput, onChange, min = 0) => {
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
            if (val < Number(slider.min))
                val = Number(slider.min);
            if (val > Number(slider.max))
                val = Number(slider.max);
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
        const colorDiv = container.querySelector(".color");
        const editButton = container.querySelector(".edit-icon");
        const exportButton = container.querySelector(".export-icon");
        if (!colorDiv || !editButton || !exportButton)
            return;
        let colorId = colorDiv.id.split("-")[1]; // "1", "2", etc.
        const panel = container.querySelector(`#panel-${colorId}`);
        const satSlider = container.querySelector(`#saturation-${colorId}`);
        const lightSlider = container.querySelector(`#lightness-${colorId}`);
        const chromaSlider = container.querySelector(`#chroma-${colorId}`);
        const satNumber = container.querySelector(`#saturation-value-${colorId}`);
        const lightNumber = container.querySelector(`#lightness-value-${colorId}`);
        const chromaNumber = container.querySelector(`#chroma-value-${colorId}`);
        // Poner un texto si no cumple con el contraste
        const text = document.createElement("label");
        text.id = "contrast-text-" + colorId;
        text.innerText = `Contraste no accesible`;
        text.style.wordBreak = "break-word";
        text.style.textAlign = "center";
        container.childNodes[3].appendChild(text);
        // Mostrar/Ocultar panel al hacer clic
        editButton.addEventListener("click", () => {
            // Eliminar el panel de conversor si está visible
            document.querySelectorAll(".export-container").forEach((p) => {
                p.classList.remove("show");
            });
            // Mostrar u ocultar TODOS los panels
            const shouldShow = !panel.classList.contains("show");
            document.querySelectorAll(".editor-panel").forEach((p) => {
                if (shouldShow && p.getAttribute("palette") !== "1") {
                    p.classList.add("show");
                }
                else {
                    p.classList.remove("show");
                }
            });
            updateAll();
        });
        exportColors();
        exportButton.addEventListener("click", () => {
            // Eliminar el panel de edición si está visible
            document.querySelectorAll(".editor-panel").forEach((p) => {
                const shouldShow = p.classList.contains("show");
                if (shouldShow) {
                    p.classList.remove("show");
                }
            });
            document.querySelectorAll(".export-container").forEach((p) => {
                p.classList.contains("show") ? p.classList.remove("show") : p.classList.add("show");
            });
            updateExports();
        });
        // Función que actualiza el color en CSS
        const updateColor = () => {
            const colorElement = document.getElementById(`color-checkbox-${colorId}`);
            const parent = colorElement === null || colorElement === void 0 ? void 0 : colorElement.parentElement;
            if (!parent)
                return;
            if (satSlider.value !== satSlider.getAttribute("previousValue") && (satSlider.getAttribute("previousValue") !== null || satNumber.getAttribute("previousValue") !== null)) {
                satSlider.setAttribute("previousValue", satSlider.value);
                satNumber.setAttribute("previousValue", satSlider.value);
                let color = "black";
                const movingCircle = `circle-${color}-lh`;
                const stationaryCircle = `circle-${color}-sh`;
                const elements = document.querySelectorAll(`[id^="${movingCircle}"]`);
                const colorDiv = document.getElementById(`color-${colorId}`);
                elements.forEach((element, index) => {
                    const circle = element;
                    const circleLH = document.getElementById(`${stationaryCircle}-${index}`);
                    if (circle.style.backgroundColor === colorDiv.style.backgroundColor) {
                        const colorPalette = parent.childNodes[index];
                        const hue = colorPalette.getAttribute("h");
                        colorPalette.style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
                        colorDiv.style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
                        circle.style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
                        circleLH.style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
                        updateOneCircle(circle, satSlider.valueAsNumber);
                        return;
                    }
                });
                return;
            }
            else if (lightSlider.value !== lightSlider.getAttribute("previousValue") && (lightSlider.getAttribute("previousValue") !== null || lightNumber.getAttribute("previousValue") !== null)) {
                lightSlider.setAttribute("previousValue", lightSlider.value);
                lightNumber.setAttribute("previousValue", lightSlider.value);
                let color = "black";
                const movingCircle = `circle-${color}-sh`;
                const stationaryCircle = `circle-${color}-lh`;
                const elements = document.querySelectorAll(`[id^="${movingCircle}"]`);
                const colorDiv = document.getElementById(`color-${colorId}`);
                elements.forEach((element, index) => {
                    const circle = element;
                    const circleLH = document.getElementById(`${stationaryCircle}-${index}`);
                    if (circle.style.backgroundColor === colorDiv.style.backgroundColor) {
                        const colorPalette = parent.childNodes[index];
                        const hue = colorPalette.getAttribute("h");
                        let bgString = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
                        if (select.value === "oklch") {
                            bgString = `oklch(${lightSlider.value}% ${chromaSlider.value} ${hue})`;
                        }
                        colorPalette.style.backgroundColor = bgString;
                        colorDiv.style.backgroundColor = bgString;
                        circle.style.backgroundColor = bgString;
                        circleLH.style.backgroundColor = bgString;
                        updateOneCircle(circle, lightSlider.valueAsNumber);
                        return;
                    }
                });
                return;
            }
            else if (chromaSlider.value !== chromaSlider.getAttribute("previousValue") && (chromaSlider.getAttribute("previousValue") !== null || chromaNumber.getAttribute("previousValue") !== null)) {
                chromaSlider.setAttribute("previousValue", chromaSlider.value);
                chromaSlider.setAttribute("previousValue", chromaSlider.value);
                let color = "black";
                const stationaryCircle = `circle-${color}-sh`;
                const movingCircle = `circle-${color}-lh`;
                const elements = document.querySelectorAll(`[id^="${movingCircle}"]`);
                const colorDiv = document.getElementById(`color-${colorId}`);
                elements.forEach((element, index) => {
                    const circle = element;
                    const circleLH = document.getElementById(`${stationaryCircle}-${index}`);
                    if (circle.style.backgroundColor === colorDiv.style.backgroundColor) {
                        const colorPalette = parent.childNodes[index];
                        const hue = colorPalette.getAttribute("h");
                        colorPalette.style.backgroundColor = `oklch(${lightSlider.value}% ${chromaSlider.value} ${hue})`;
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
});
