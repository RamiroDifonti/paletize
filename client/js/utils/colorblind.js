// colorblind.ts
// This file contains the code for the colorblindness functionality
import { palette1, palette2 } from "../constants/palette.js";
import { select } from "../constants/selects.js";
import { hslToRgb, oklchToRgb, rgbToHsl, rgbToOklch } from "./conversor.js";
const colorblind = document.querySelector(".colorblind");
// Colorblindness matrices for different types of colorblindness
const colorBlindMatrices = {
    protanopia: [
        [0.56667, 0.43333, 0],
        [0.55833, 0.44167, 0],
        [0, 0.24167, 0.75833]
    ],
    deuteranopia: [
        [0.625, 0.375, 0],
        [0.7, 0.3, 0],
        [0, 0.3, 0.7]
    ],
    tritanopia: [
        [0.95, 0.05, 0],
        [0, 0.43333, 0.56667],
        [0, 0.475, 0.525]
    ]
};
// Function to update the colorblindness simulation
export function updateColorblind() {
    const colorblindValue = colorblind === null || colorblind === void 0 ? void 0 : colorblind.value;
    palette1.classList.remove("colorblind", "protanopia", "deuteranopia", "tritanopia");
    palette2.classList.remove("colorblind", "protanopia", "deuteranopia", "tritanopia");
    const buttons = document.querySelectorAll(".edit-icon");
    if (colorblindValue !== "none") {
        palette1.classList.add("colorblind", colorblindValue);
        palette2.classList.add("colorblind", colorblindValue);
        buttons.forEach((button) => {
            button.classList.remove("show");
        });
    }
    else {
        buttons.forEach((button) => {
            button.classList.add("show");
        });
    }
}
// Simulate colorblindness for a given HSL color
export function simulateColorBlind(h, s, l, type) {
    let rgb = hslToRgb(h, s, l);
    if (select.value === "oklch") {
        rgb = oklchToRgb(l / 100, s, h);
    }
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
    if (select.value === "oklch") {
        let [l, c, h] = rgbToOklch(rgbSim[0], rgbSim[1], rgbSim[2]);
        if (h === undefined) {
            h = 0;
        }
        c = Math.round(c * 100) / 100;
        return [Math.round(l * 100), c, Math.round(h)];
    }
    else {
        return rgbToHsl(rgbSim[0], rgbSim[1], rgbSim[2]);
    }
}
