// colorblind.ts
// This file contains the code for the colorblindness functionality
import { updateAll } from "../core/colorWheel.js";
import { palette1, palette2 } from "../constants/palette.js";
import { hslToRgb, rgbToHsl } from "./conversor.js";

const colorblind = document.querySelector<HTMLInputElement>(".colorblind");
// Colorblindness matrices for different types of colorblindness
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

// Function to update the colorblindness simulation
export function updateColorblind() {
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
}

// Simulate colorblindness for a given HSL color
export function simulateColorBlind (
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