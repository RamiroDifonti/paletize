// selects.ts
// This file contains the constants for the selects in the HTML file
export const colorScheme = document.querySelector<HTMLSelectElement>(".color-type")!;
export const select = document.querySelector<HTMLSelectElement>(".representation-wheel")!;
export const wcag = document.querySelector<HTMLSelectElement>(".wcag-selection")!;
export const contrastS = document.querySelector<HTMLInputElement>(".contrast-selection-s")!;
export const contrastC = document.querySelector<HTMLInputElement>(".contrast-selection-c")!;
export const contrastL = document.querySelector<HTMLInputElement>(".contrast-selection-l")!;
export const colorblind = document.querySelector<HTMLInputElement>(".colorblind")!;