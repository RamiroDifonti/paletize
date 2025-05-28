// schemeHandler.ts
// This file is responsible for handling the color scheme selection and updating the UI accordingly.

import { colorScheme } from "../constants/selects.js";
import { separationComplementary, separationAnalogous, separationTriad, separationSplit, separationSquare } from "../constants/schemeControls.js";

import { updateColorblind } from "../utils/colorblind.js";

// Function to update the color scheme based on the selected value
export function updateSeparation() {
  let separation: HTMLElement | null = null;
  if (colorScheme?.value === "triad") {
    separation = separationTriad;
    (separation.childNodes[1] as HTMLInputElement).value = "120";
    (separation.childNodes[3] as HTMLInputElement).value = "120";
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "complementary") {
    separation = separationComplementary;
    (separation.childNodes[1] as HTMLInputElement).value = "180";
    (separation.childNodes[3] as HTMLInputElement).value = "180";
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "analogous") {
    separation = separationAnalogous;
    (separation.childNodes[1] as HTMLInputElement).value = "10";
    (separation.childNodes[3] as HTMLInputElement).value = "10";
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "split-complementary") {
    separation = separationSplit;
    (separation.childNodes[1] as HTMLInputElement).value = "30";
    (separation.childNodes[3] as HTMLInputElement).value = "30";
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "square") {
    separation = separationSquare;
    (separation.childNodes[1] as HTMLInputElement).value = "90";
    (separation.childNodes[3] as HTMLInputElement).value = "90";
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