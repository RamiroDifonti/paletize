// handleCircles.ts
// This file contains the functions to handle the circles in the color wheels and palettes
import { colorScheme, select } from "../constants/selects.js";
import { hueSlider } from "../constants/sliders.js";
import { firstWheelCanvas, secondWheelCanvas } from "../constants/canvas.js";
import { palette1, palette2 } from "../constants/palette.js";
import { updatePalettes } from "./handlePalettes.js";
import { calculateColors } from "../utils/utils.js";
function createCircle(container, id, color = "white") {
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
export function createCircles(wheel, isSaturationWheel) {
    // Primero actualizar las paletas para luego obtener sus colores
    updatePalettes();
    const canvas = wheel.querySelector("canvas");
    const baseHue = hueSlider.value; // Obtener el valor del slider de tono
    const radius = canvas.clientWidth / 2;
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
    }
    else {
        wheelText = "sh";
        positionY += (secondWheelCanvas.clientHeight / 2);
    }
    // Limpiar círculos existentes
    const existingCircles = wheel.querySelectorAll(".circle");
    existingCircles.forEach(circle => circle.remove());
    const hues = calculateColors(baseHue, colorScheme.value);
    const colorsWhite = Array.from(palette1.children).map((colorBox, index) => {
        const color = colorBox.childNodes[1].style.backgroundColor;
        let distance;
        if (isSaturationWheel) {
            if (select.value === "oklch") {
                distance = Number(colorBox.getAttribute("s")) / 0.4; // Luminosidad normalizada
            }
            else {
                distance = Number(colorBox.getAttribute("s")) / 100; // Luminosidad normalizada
            }
        }
        else {
            if (select.value === "oklch") {
                distance = Number(colorBox.getAttribute("l")); // Luminosidad normalizada
            }
            else {
                distance = Number(colorBox.getAttribute("l")) / 100; // Luminosidad normalizada
            }
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
        const color = colorBox.childNodes[1].style.backgroundColor;
        let distance;
        if (isSaturationWheel) {
            if (select.value === "oklch") {
                distance = Number(colorBox.getAttribute("s")) / 0.4; // Luminosidad normalizada
            }
            else {
                distance = Number(colorBox.getAttribute("s")); // Luminosidad normalizada
            }
        }
        else {
            if (select.value === "oklch") {
                distance = Number(colorBox.getAttribute("l")); // Luminosidad normalizada
            }
            else {
                distance = Number(colorBox.getAttribute("l")) / 100; // Luminosidad normalizada
            }
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
export function updateCircles(wheel, isSaturationWheel) {
    // Primero actualizar las paletas para luego obtener sus colores
    updatePalettes();
    const canvas = wheel.querySelector("canvas");
    if (!canvas)
        return;
    const baseHue = hueSlider.value; // Obtener el valor del slider de tono
    const radius = canvas.clientWidth / 2;
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
    }
    else {
        wheelText = "sh";
        positionY += (secondWheelCanvas.clientHeight / 2);
    }
    const hues = calculateColors(baseHue, colorScheme.value);
    const colorsWhite = Array.from(palette1.children).map((colorBox, index) => {
        const color = colorBox.childNodes[1].style.backgroundColor;
        let distance;
        if (isSaturationWheel) {
            if (select.value === "oklch") {
                distance = Number(colorBox.getAttribute("s")) / 0.4; // Luminosidad normalizada
            }
            else {
                distance = Number(colorBox.getAttribute("s")) / 100; // Luminosidad normalizada
            }
        }
        else {
            if (select.value === "oklch") {
                distance = Number(colorBox.getAttribute("l")); // Luminosidad normalizada
            }
            else {
                distance = Number(colorBox.getAttribute("l")) / 100; // Luminosidad normalizada
            }
        }
        return { color, distance, index };
    });
    colorsWhite.forEach(({ color, distance, index }) => {
        const hue = hues[index % hues.length];
        const radian = (hue * Math.PI) / 180;
        const circle = document.getElementById(`circle-white-${wheelText}-${index}`);
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
        const color = colorBox.childNodes[1].style.backgroundColor;
        let distance;
        if (isSaturationWheel) {
            if (select.value === "oklch") {
                distance = Number(colorBox.getAttribute("s")) / 0.4; // Luminosidad normalizada
            }
            else {
                distance = Number(colorBox.getAttribute("s")) / 100; // Luminosidad normalizada
            }
        }
        else {
            if (select.value === "oklch") {
                distance = Number(colorBox.getAttribute("l")); // Luminosidad normalizada
            }
            else {
                distance = Number(colorBox.getAttribute("l")) / 100; // Luminosidad normalizada
            }
        }
        return { color, distance, index };
    });
    colorsBlack.forEach(({ color, distance, index }) => {
        const hue = hues[index % hues.length];
        const radian = (hue * Math.PI) / 180;
        const circle = document.getElementById(`circle-black-${wheelText}-${index}`);
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
export function updateOneCircle(circle, distance) {
    let normalizedDistance;
    if (select.value === "oklch") {
        if (circle.id.includes("lh")) {
            normalizedDistance = distance / 0.4; // Luminosidad normalizada
        }
        else {
            normalizedDistance = distance; // Luminosidad normalizada
        }
    }
    else {
        normalizedDistance = distance / 100; // Luminosidad normalizada
    }
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
