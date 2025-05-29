// schemeHandler.ts
// This file is responsible for handling the color scheme selection and updating the UI accordingly.

import { colorScheme } from "../constants/selects.js";
import { separationComplementary, separationAnalogous, separationTriad, separationSplit, separationSquare } from "../constants/schemeControls.js";

import { updateColorblind } from "../utils/colorblind.js";

// Function to update the color scheme based on the selected value
export function updateSeparation(number = -1) {
  let separation: HTMLElement | null = null;
  if (colorScheme?.value === "triad") {
    separation = separationTriad;
    const inputValue = number === -1 ? "120" : number.toString();
    (separation.childNodes[1] as HTMLInputElement).value = inputValue;
    (separation.childNodes[3] as HTMLInputElement).value = inputValue;
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "complementary") {
    separation = separationComplementary;
    const inputValue = number === -1 ? "180" : number.toString();
    (separation.childNodes[1] as HTMLInputElement).value = inputValue;
    (separation.childNodes[3] as HTMLInputElement).value = inputValue;
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "analogous") {
    separation = separationAnalogous;
    const inputValue = number === -1 ? "10" : number.toString();
    (separation.childNodes[1] as HTMLInputElement).value = inputValue;
    (separation.childNodes[3] as HTMLInputElement).value = inputValue;
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "split-complementary") {
    separation = separationSplit;
    const inputValue = number === -1 ? "30" : number.toString();
    (separation.childNodes[1] as HTMLInputElement).value = inputValue;
    (separation.childNodes[3] as HTMLInputElement).value = inputValue;
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "square") {
    separation = separationSquare;
    const inputValue = number === -1 ? "90" : number.toString();
    (separation.childNodes[1] as HTMLInputElement).value = inputValue;
    (separation.childNodes[3] as HTMLInputElement).value = inputValue;
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
  } else {
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  }
  if (separation) {
    separation.classList.remove("hidden");
  }
  updateColorblind();
}