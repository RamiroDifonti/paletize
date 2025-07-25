// palette.ts
// This file contains the logic for the palette in the HTML file
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createAll, updateAll } from "./colorWheel.js";
import { exportColors } from "../utils/conversor.js";
import { updateOneCircle } from "../handlers/handleCircles.js";
import { chromaSlider1, satSlider1, lightSlider1, lightOklchSlider1, hueSlider, analogousSlider, splitSlider, triadSlider, complementarySlider, squareSlider } from "../constants/sliders.js";
import { chromaValue1, satValue1, lightValue1, lightOklchValue1, hueValue, analogousValue, splitValue, triadValue, complementaryValue, squareValue } from "../constants/values.js";
import { colorScheme, select, contrastC, contrastS, contrastL, wcag } from "../constants/selects.js";
import { loadPalette } from "../handlers/handlePalettes.js";
import { palette1, palette2 } from "../constants/palette.js";
import { updateSeparation } from "../handlers/schemeHandler.js";
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
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
    connectSliderWithNumber(lightOklchSlider1, lightOklchValue1, createAll);
    connectSliderWithNumber(analogousSlider, analogousValue, updateAll);
    connectSliderWithNumber(triadSlider, triadValue, updateAll);
    connectSliderWithNumber(complementarySlider, complementaryValue, updateAll);
    connectSliderWithNumber(splitSlider, splitValue, updateAll);
    connectSliderWithNumber(squareSlider, squareValue, updateAll);
    colorContainers.forEach((container) => {
        const colorDiv = container.querySelector(".color");
        const editButton = container.querySelector(".edit-icon");
        if (!colorDiv || !editButton)
            return;
        let colorId = colorDiv.id.split("-")[1]; // "1", "2", etc.
        const panel = container.querySelector(`#panel-${colorId}`);
        const satSlider = container.querySelector(`#saturation-${colorId}`);
        const lightSlider = container.querySelector(`#lightness-${colorId}`);
        const lightOklchSlider = container.querySelector(`#lightness-c-${colorId}`);
        const chromaSlider = container.querySelector(`#chroma-${colorId}`);
        const satNumber = container.querySelector(`#saturation-value-${colorId}`);
        const lightNumber = container.querySelector(`#lightness-value-${colorId}`);
        const lightOklchNumber = container.querySelector(`#lightness-c-value-${colorId}`);
        const chromaNumber = container.querySelector(`#chroma-value-${colorId}`);
        // Poner un texto si no cumple con el contraste
        const text = document.createElement("label");
        text.id = "contrast-text-" + colorId;
        text.innerText = `Contraste no accesible`;
        text.style.textAlign = "center";
        container.childNodes[3].appendChild(text);
        // Mostrar/Ocultar panel al hacer clic
        editButton.addEventListener("click", () => {
            // Eliminar el panel de conversor si está visible
            const expContainer = document.querySelectorAll(".export-container");
            // Mostrar u ocultar TODOS los panels
            const shouldShow = !panel.classList.contains("show");
            document.querySelectorAll(".editor-panel").forEach((p, index) => {
                if (shouldShow && p.getAttribute("palette") !== "1") {
                    p.classList.add("show");
                    expContainer[index].classList.remove("show");
                }
                else {
                    p.classList.remove("show");
                    expContainer[index].classList.add("show");
                }
            });
            updateAll();
        });
        exportColors();
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
                        colorPalette.childNodes[1].style.backgroundColor = `hsl(${hue}, ${satSlider.value}%, ${lightSlider.value}%)`;
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
                            bgString = `oklch(${lightSlider.value} ${chromaSlider.value} ${hue})`;
                        }
                        colorPalette.childNodes[1].style.backgroundColor = bgString;
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
                        colorPalette.childNodes[1].style.backgroundColor = `oklch(${lightOklchSlider.value} ${chromaSlider.value} ${hue})`;
                        colorDiv.style.backgroundColor = `oklch(${lightOklchSlider.value} ${chromaSlider.value} ${hue})`;
                        circle.style.backgroundColor = `oklch(${lightOklchSlider.value} ${chromaSlider.value} ${hue})`;
                        circleLH.style.backgroundColor = `oklch(${lightOklchSlider.value} ${chromaSlider.value} ${hue})`;
                        updateOneCircle(circle, chromaSlider.valueAsNumber);
                        return;
                    }
                });
                return;
            }
            else if (lightOklchSlider.value !== lightOklchSlider.getAttribute("previousValue") && (lightOklchSlider.getAttribute("previousValue") !== null || lightOklchNumber.getAttribute("previousValue") !== null)) {
                lightOklchSlider.setAttribute("previousValue", lightOklchSlider.value);
                lightOklchNumber.setAttribute("previousValue", lightOklchSlider.value);
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
                        let bgString = `oklch(${lightOklchSlider.value} ${chromaSlider.value} ${hue})`;
                        colorPalette.childNodes[1].style.backgroundColor = bgString;
                        colorDiv.style.backgroundColor = bgString;
                        circle.style.backgroundColor = bgString;
                        circleLH.style.backgroundColor = bgString;
                        updateOneCircle(circle, lightOklchSlider.valueAsNumber);
                        return;
                    }
                });
                return;
            }
        };
        // Sincronizar sliders y números
        connectSliderWithNumber(satSlider, satNumber, updateColor);
        connectSliderWithNumber(lightSlider, lightNumber, updateColor);
        connectSliderWithNumber(lightOklchSlider, lightOklchNumber, updateColor);
        connectSliderWithNumber(chromaSlider, chromaNumber, updateColor);
        // Inicializa el color
        createAll();
    });
    const id = window.location.href.split("/").pop();
    if (!id || id === "palette") {
        (_a = document.querySelector(".selection")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        return;
    }
    try {
        const res = yield fetch(`/api/palette/${id}`);
        const palette = yield res.json();
        document.querySelector('[name="name"]').value = palette.name;
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
                slot.childNodes[1].style.backgroundColor = "";
                (_b = slot.parentElement) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
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
            const checkboxes = document.querySelectorAll(".color-checkbox");
            palettes.forEach((color) => {
                const h = color.split(",")[0].split("(")[1].trim();
                const s = color.split(",")[1].split("%")[0].trim();
                const l = color.split(",")[2].split(")")[0].split("%")[0].trim();
                for (const checkbox of checkboxes) {
                    const colorBox = checkbox.parentElement;
                    if (colorBox.getAttribute("h") === h &&
                        colorBox.getAttribute("s") === s &&
                        colorBox.getAttribute("l") === l) {
                        checkbox.checked = true;
                        break;
                    }
                }
            });
        }
        else {
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
            const checkboxes = document.querySelectorAll(".color-checkbox");
            palettes.forEach((color) => {
                const h = color.split(" ")[2].trim().split(")")[0];
                const c = color.split(" ")[1].trim();
                const l = color.split(" ")[0].trim().split("%")[0].split("(")[1];
                for (const checkbox of checkboxes) {
                    const colorBox = checkbox.parentElement;
                    if (colorBox.getAttribute("h") === h &&
                        colorBox.getAttribute("s") === c &&
                        colorBox.getAttribute("l") === l) {
                        checkbox.checked = true;
                        break;
                    }
                }
            });
        }
        // createAll();
        const response = yield fetch("/api/profile", { credentials: "include" });
        if (!response.ok) {
            throw new Error("No autorizado");
        }
        const user = yield response.json();
        const like = document.getElementById("like");
        like.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
            if (like.children[0].classList.contains("bi-heart-fill")) {
                like.children[0].classList.add("bi-heart");
                like.children[0].classList.remove("bi-heart-fill");
            }
            else {
                like.children[0].classList.remove("bi-heart");
                like.children[0].classList.add("bi-heart-fill");
            }
            yield fetch(`/api/palette/like/${palette._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
        }));
        if (palette.likes.includes(user.id)) {
            like.children[0].classList.remove("bi-heart");
            like.children[0].classList.add("bi-heart-fill");
        }
        loadPalette(palette1, palette.colorScheme);
        loadPalette(palette2, palette.colorScheme);
        updateAll();
    }
    catch (error) {
        console.error("Error al cargar paleta:", error);
    }
}));
