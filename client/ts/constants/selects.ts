// selects.ts
// This file contains the constants for the selects in the HTML file

export const colorScheme = document.querySelector<HTMLSelectElement>(".color-type")!;
export const select = document.querySelector<HTMLSelectElement>(".representation-wheel")!;
export const wcag = document.querySelector<HTMLSelectElement>(".wcag-selection")!;
export const contrast = document.querySelector<HTMLInputElement>(".contrast-selection")!;
export const colorblind = document.querySelector<HTMLInputElement>(".colorblind")!;