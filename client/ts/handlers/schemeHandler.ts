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
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "complementary") {
    separation = separationComplementary;
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "analogous") {
    separation = separationAnalogous;
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "split-complementary") {
    separation = separationSplit;
    separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
    separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
    separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
    separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
  } else if (colorScheme?.value === "square") {
    separation = separationSquare;
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