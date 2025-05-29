// schemeHandler.ts
// This file is responsible for handling the color scheme selection and updating the UI accordingly.
import { colorScheme } from "../constants/selects.js";
import { separationComplementary, separationAnalogous, separationTriad, separationSplit, separationSquare } from "../constants/schemeControls.js";
import { updateColorblind } from "../utils/colorblind.js";
// Function to update the color scheme based on the selected value
export function updateSeparation(number = -1) {
    let separation = null;
    if ((colorScheme === null || colorScheme === void 0 ? void 0 : colorScheme.value) === "triad") {
        separation = separationTriad;
        const inputValue = number === -1 ? "120" : number.toString();
        separation.childNodes[1].value = inputValue;
        separation.childNodes[3].value = inputValue;
        separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
        separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
        separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
        separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
    }
    else if ((colorScheme === null || colorScheme === void 0 ? void 0 : colorScheme.value) === "complementary") {
        separation = separationComplementary;
        const inputValue = number === -1 ? "180" : number.toString();
        separation.childNodes[1].value = inputValue;
        separation.childNodes[3].value = inputValue;
        separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
        separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
        separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
        separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
    }
    else if ((colorScheme === null || colorScheme === void 0 ? void 0 : colorScheme.value) === "analogous") {
        separation = separationAnalogous;
        const inputValue = number === -1 ? "10" : number.toString();
        separation.childNodes[1].value = inputValue;
        separation.childNodes[3].value = inputValue;
        separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
        separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
        separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
        separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
    }
    else if ((colorScheme === null || colorScheme === void 0 ? void 0 : colorScheme.value) === "split-complementary") {
        separation = separationSplit;
        const inputValue = number === -1 ? "30" : number.toString();
        separation.childNodes[1].value = inputValue;
        separation.childNodes[3].value = inputValue;
        separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
        separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
        separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
        separationSquare.classList.contains("hidden") ? "" : separationSquare.classList.add("hidden");
    }
    else if ((colorScheme === null || colorScheme === void 0 ? void 0 : colorScheme.value) === "square") {
        separation = separationSquare;
        const inputValue = number === -1 ? "90" : number.toString();
        separation.childNodes[1].value = inputValue;
        separation.childNodes[3].value = inputValue;
        separationComplementary.classList.contains("hidden") ? "" : separationComplementary.classList.add("hidden");
        separationAnalogous.classList.contains("hidden") ? "" : separationAnalogous.classList.add("hidden");
        separationTriad.classList.contains("hidden") ? "" : separationTriad.classList.add("hidden");
        separationSplit.classList.contains("hidden") ? "" : separationSplit.classList.add("hidden");
    }
    else {
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
