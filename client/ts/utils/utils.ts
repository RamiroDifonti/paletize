// utils.ts
// This file contains the utility functions for the color wheel and palette generation
import { rgb } from "culori";
import { wcag, contrastS, contrastC, contrastL, select } from "../constants/selects.js";
import { analogousSlider, complementarySlider, splitSlider, triadSlider, squareSlider } from "../constants/sliders.js";

import { hslToRgb, oklchToRgb } from "./conversor.js";

// Limit sliders with min and max values from WCAG
export function limitColor(hueBranding: number, hue: number, saturation: number, lightness: number) {
  const wcagValue = wcag?.value == "aa" ? 4.5 : 7;
  let contrastValueFirst = contrastS.value;
  const contrastValueSecond = contrastL.value;
  let brandingRgb = hslToRgb(Number(hueBranding), Number(saturation), Number(lightness));
  const luminanceBranding = calculateLuminance(brandingRgb);
  const step = 0.01;
  let maxS = -1, maxL = -1;
  let minS = -1, minL = -1;
  let s = saturation, l = lightness / 100;
  if (select?.value === "oklch") {
    contrastValueFirst = contrastC.value;
    brandingRgb = oklchToRgb(Number(lightness), Number(saturation), Number(hueBranding));
    s /= 0.4;
  } else {
    s /= 100;
  }
  let changeL = true;

  let contrastValue;
  if (contrastValueFirst === "decrease") {
    if (contrastValueSecond === "decrease") {
      contrastValue = "depth";
    } else {
      contrastValue = "softness";
    }
  } else {
    if (contrastValueSecond === "decrease") {
      contrastValue = "impact";
    } else {
      contrastValue = "intensity";
    }
  }

  switch (contrastValue) {
    // s2 < s1, l2 < l1 (saturación baja, luminosidad baja)
    case "depth":
      while (l >= -0.01 && s >= -0.01) {
        let rgb2 = hslToRgb(hue, s * 100, l * 100);
        if (select?.value === "oklch") {
          rgb2 = oklchToRgb(Math.round(l*100) / 100, Math.round((s*0.4) * 100) / 100, hue);
        }
        const luminance2 = calculateLuminance(rgb2);
        const contrast = calculateContrast(luminanceBranding, luminance2);
        if (maxS !== -1 && (contrast < wcagValue || (Math.round(s*100) === 0 && Math.round(l*100) === 0))) {
          if (Math.round(s*100) === 0 && Math.round(l*100) === 0) {
            minS = 0;
            minL = 0;
            if (select?.value === "oklch") {
              return [maxS, Math.round(maxL), minS, Math.round(minL), contrast];
            } else {
              return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL), contrast];
            }
          }
          if ((Math.round(maxS) - Math.round(minS) < 2)  || (Math.round(maxL) - Math.round(minL) < 2)) {
            if (Math.round(s*100) !== minS) {
              s += step;
              l -= step;
            } else {
              s -= step;
              l += step;
            }
            let rgb2 = hslToRgb(hue, Math.round(s*100), Math.round(l*100));
            if (select?.value === "oklch") {
              rgb2 = oklchToRgb(Math.round(l*100) / 100, Math.round((s*0.4) * 100) / 100, hue);
            }
            const luminance2 = calculateLuminance(rgb2);
            const contrast = calculateContrast(luminanceBranding, luminance2);
            if (contrast >= wcagValue) {
              changeL = !changeL;
            } else {
              if (Math.round(s*100) === 0) {
                minS = 0;
              }
              if (Math.round(l*100) === 0) {
                minL = 0;
              }
              if (select?.value === "oklch") {
                return [maxS, Math.round(maxL), minS, Math.round(minL), contrast];
              } else {
                return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL), contrast];
              }
            }
          } else {
            if (Math.round(s*100) === 0) {
              minS = 0;
            }
            if (Math.round(l*100) === 0) {
              minL = 0;
            }
            if (select?.value === "oklch") {
              return [maxS, Math.round(maxL), minS, Math.round(minL), contrast];
            } else {
              return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL), contrast];
            }
          }
        } else if (maxS !== -1) {
          minL = l * 100;
          if (select?.value === "oklch") {
            minS = Math.round((s*0.4) * 100) / 100;
          } else {
            minS = s * 100;
          }
        }
        if (maxS === -1 && contrast >= wcagValue) {
          maxL = l * 100;
          if (select?.value === "oklch") {
            maxS = Math.round((s*0.4) * 100) / 100;
          } else {
            maxS = s * 100;
          }
        }
        if (Math.round(s*100) > Math.round(l*100)) {
          s -= step;
        } else if (Math.round(l*100) > Math.round(s*100)) {
          l -= step;
        } else {
          if (changeL) {
            l -= step;
            changeL = false;
          } else {
            s -= step;
            changeL = true;
          }
        }
      }
      break;
    // s2 > s1, l2 > l1 (saturación alta, luminosidad alta)
    case "intensity":
      while (l <= 1.01 && s <= 1.01) {
        let rgb2 = hslToRgb(hue, Math.round(s*100), Math.round(l*100));
        if (select?.value === "oklch") {
          rgb2 = oklchToRgb(Math.round(l*100) / 100, Math.round((s*0.4) * 100) / 100, hue);
        }
        const luminance2 = calculateLuminance(rgb2);
        const contrast = calculateContrast(luminanceBranding, luminance2);
        if (minS !== -1 && (contrast < wcagValue || (Math.round(s*100) === 100 && Math.round(l*100) === 100))) {
          if (Math.round(s*100) === 100 && Math.round(l*100) === 100) {
            maxS = 100;
            maxL = 100;
            if (select?.value === "oklch") {
              maxS = 0.4;
              return [maxS, Math.round(maxL), minS, Math.round(minL), contrast];
            } else {
              return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL), contrast];
            }
          }
          if ((Math.round(maxS) - Math.round(minS) < 2)  || (Math.round(maxL) - Math.round(minL) < 2)) {
            if (Math.round(s*100) !== minS) {
              s -= step;
              l += step;
            } else {
              s += step;
              l -= step;
            }
            let rgb2 = hslToRgb(hue, Math.round(s*100), Math.round(l*100));
            if (select?.value === "oklch") {
              rgb2 = oklchToRgb(Math.round(l*100) / 100, Math.round((s*0.4) * 100) / 100, hue);
            }
            const luminance2 = calculateLuminance(rgb2);
            const contrast = calculateContrast(luminanceBranding, luminance2);
            if (contrast >= wcagValue) {
              changeL = !changeL;
            } 
          } 
        } else if (minS !== -1) {
          maxL = l * 100;
          if (select?.value === "oklch") {
            maxS = Math.round((s*0.4) * 100) / 100;
          } else {
            maxS = s * 100;
          }
        }
        if (minS === -1 && contrast >= wcagValue) {
          minL = l * 100;
          if (select?.value === "oklch") {
            minS = Math.round((s*0.4) * 100) / 100;
          } else {
            minS = s * 100;
          }
          if (Math.round(s*100) >= 100 && Math.round(l*100) >= 100) {
            maxS = 100;
            maxL = 100;
            if (select?.value === "oklch") {
              maxS = 0.4;
              return [maxS, Math.round(maxL), minS, Math.round(minL), contrast];
            }
            return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL), contrast];
          }
        }
        if (Math.round(s*100) < Math.round(l*100)) {
          s += step;
        } else if (Math.round(l*100) < Math.round(s*100)) {
          l += step;
        } else {
          if (changeL) {
            l += step;
            changeL = false;
          } else {
            s += step;
            changeL = true;
          }
        }
      }
      break;
    // s2 < s1, l2 > l1 (saturación alta, luminosidad baja)
    case "softness":
      while (l <= 1.01 && s >= -0.01) {
        let rgb2 = hslToRgb(hue, s * 100, l * 100);
        if (select?.value === "oklch") {
          rgb2 = oklchToRgb(Math.round(l*100) / 100, Math.round((s*0.4) * 100) / 100, hue);
        }
        const luminance2 = calculateLuminance(rgb2);
        const contrast = calculateContrast(luminanceBranding, luminance2);
        if (maxS !== -1 && (contrast < wcagValue || (Math.round(s*100) === 0 && Math.round(l*100) === 100))) {
          if (Math.round(s*100) === 0 && Math.round(l*100) === 100) {
            minS = 0;
            maxL = 100;
            if (select?.value === "oklch") {
              return [maxS, Math.round(maxL), minS, Math.round(minL), contrast];
            } else {
              return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL), contrast];
            }
          }
          if ((Math.round(maxS) - Math.round(minS) < 2)  || (Math.round(maxL) - Math.round(minL) < 2)) {
            if (Math.round(s*100) !== minS) {
              s += step;
              l += step;
            } else {
              s -= step;
              l -= step;
            }
            let rgb2 = hslToRgb(hue, s * 100, l * 100);
            if (select?.value === "oklch") {
              rgb2 = oklchToRgb(Math.round(l*100) / 100, Math.round((s*0.4) * 100) / 100, hue);
            }
            const luminance2 = calculateLuminance(rgb2);
            const contrast = calculateContrast(luminanceBranding, luminance2);
            if (contrast >= wcagValue) {
              changeL = !changeL;
            } else {
              if (Math.round(s*100) === 100) {
                maxS = 100;
              }
              if (Math.round(l*100) === 0) {
                minL = 0;
              }
              if (select?.value === "oklch") {
                return [maxS, Math.round(maxL), minS, Math.round(minL), contrast];
              } else {
                return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL), contrast];
              }
            }
          } else {
            if (Math.round(s*100) === 100) {
              maxS = 100;
            }
            if (Math.round(l*100) === 0) {
              minL = 0;
            }
            if (select?.value === "oklch") {
              return [maxS, Math.round(maxL), minS, Math.round(minL), contrast];
            } else {
              return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL), contrast];
            }
          }
        } else if (maxS !== -1) {
          maxL = l * 100;
          if (select?.value === "oklch") {
            minS = Math.round((s*0.4) * 100) / 100;
          } else {
            minS = s * 100;
          }
        }
        if (maxS === -1 && contrast >= wcagValue) {
          minL = l * 100;
          if (select?.value === "oklch") {
            maxS = Math.round((s*0.4) * 100) / 100;
          } else {
            maxS = s * 100;
          }
        }
        const centerS = 100 - (100 - Math.round(s*100));
        const centerL = 100 - Math.round(l*100);
        if (centerS > centerL) {
          s -= step;
        } else if (centerL > centerS) {
          l += step;
        } else {
          if (changeL) {
            l += step;
            changeL = false;
          } else {
            s -= step;
            changeL = true;
          }
        }
      }
      break;
    // s2 > s1, l2 < l1 (saturación baja, luminosidad alta)
    case "impact":
      while (l >= -0.01 && s <= 1.01) {
        let rgb2 = hslToRgb(hue, s * 100, l * 100);
        if (select?.value === "oklch") {
          rgb2 = oklchToRgb(Math.round(l*100) / 100, Math.round((s*0.4) * 100) / 100, hue);
        }
        const luminance2 = calculateLuminance(rgb2);
        const contrast = calculateContrast(luminanceBranding, luminance2);
        if (minS !== -1 && (contrast < wcagValue || (Math.round(s*100) === 100 && Math.round(l*0) === 0))) {
          if (Math.round(s*100) === 100 && Math.round(l*100) === 0) {
            maxS = 100;
            minL = 0;
            if (select?.value === "oklch") {
              maxS = 0.4;
              return [maxS, Math.round(maxL), minS, Math.round(minL), contrast];
            } else {
              return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL), contrast];
            }
          }
          if ((Math.round(maxS) - Math.round(minS) < 2)  || (Math.round(maxL) - Math.round(minL) < 2)) {
            if (Math.round(s*100) !== minS) {
              s -= step;
              l -= step;
            } else {
              s += step;
              l += step;
            }
            let rgb2 = hslToRgb(hue, s * 100, l * 100);
            if (select?.value === "oklch") {
              rgb2 = oklchToRgb(Math.round(l*100) / 100, Math.round((s*0.4) * 100) / 100, hue);
            }
            const luminance2 = calculateLuminance(rgb2);
            const contrast = calculateContrast(luminanceBranding, luminance2);
            if (contrast >= wcagValue) {
              changeL = !changeL;
            } else {
              if (Math.round(s*100) === 0) {
                minS = 0;
              }
              if (Math.round(l*100) === 100) {
                maxL = 100;
              }
              if (select?.value === "oklch") {
                return [maxS, Math.round(maxL), minS, Math.round(minL), contrast];
              } else {
                return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL), contrast];
              }
            }
          } else {
            if (Math.round(s*100) === 0) {
              minS = 0;
            }
            if (Math.round(l*100) === 100) {
              maxL = 100;
            }
            if (select?.value === "oklch") {
              return [maxS, Math.round(maxL), minS, Math.round(minL), contrast];
            } else {
              return [Math.round(maxS), Math.round(maxL), Math.round(minS), Math.round(minL), contrast];
            }
          }
        } else if (minS !== -1) {
          minL = l * 100;
          if (select?.value === "oklch") {
            maxS = Math.round((s*0.4) * 100) / 100;
          } else {
            maxS = s * 100;
          }
        }
        if (minS === -1 && contrast >= wcagValue) {
          maxL = l * 100;
          if (select?.value === "oklch") {
            minS = Math.round((s*0.4) * 100) / 100;
          } else {
            minS = s * 100;
          }
        }
        const centerL = 100 - (100 - Math.round(l*100));
        const centerS = 100 - Math.round(s*100);
        if (centerS > centerL) {
          s += step;
        } else if (centerL > centerS) {
          l -= step;
        } else {
          if (changeL) {
            l -= step;
            changeL = false;
          } else {
            s += step;
            changeL = true;
          }
        }
      }
      break;
  }
  let rgb2 = hslToRgb(hue, s * 100, l * 100);
  if (select?.value === "oklch") {
    rgb2 = oklchToRgb(Math.round(l * 100) / 100, Math.round((s*0.4) * 100) / 100, hue);
  }

  const luminance2 = calculateLuminance(rgb2);
  const contrastNumber = calculateContrast(luminanceBranding, luminance2);
  if (contrastNumber >= wcagValue) {
    if (select?.value === "oklch") {
      return [0.4, 100, 0.4, 100, contrastNumber];
    } else {
      return [100, 100, 100, 100, contrastNumber];
    }
  }
  return [-1, -1, -1, -1, contrastNumber];
}

export function calculateColors(hue: string, scheme: string) {
  const colors = [];
  const hueNumber = parseInt(hue); // Convertir el valor de hue a número
  switch (scheme) {
      case "analogous":
          // Colores análogos (Hue ±30°)
          const angleAnalogous = Number(analogousSlider.value);
          colors.push(hueNumber);
          colors.push((hueNumber + angleAnalogous ) % 360);
          colors.push((hueNumber - angleAnalogous + 360) % 360);
          colors.push((hueNumber + angleAnalogous + angleAnalogous) % 360);
          colors.push((hueNumber - angleAnalogous - angleAnalogous + 360) % 360);
          break;
      case "complementary":  // +30 - 30
          // Colores complementarios (Hue +180°)
          const angleComplementary = Number(complementarySlider.value);
          colors.push(hueNumber);
          colors.push((hueNumber + angleComplementary) % 360);
          break;
      case "split-complementary": // 0 a 60
          // Split complementarios (Hue ±150°)
          const angleSplit = Number(splitSlider.value);
          colors.push(hueNumber);
          colors.push((hueNumber + angleSplit) % 360);
          colors.push((hueNumber - angleSplit + 360) % 360);
          break;
      case "triad":  // +30 -30
          // Triadas (Hue ±120°)
          const angleTriad = Number(triadSlider.value);
          colors.push(hueNumber);
          colors.push((hueNumber + angleTriad) % 360);
          colors.push((hueNumber - angleTriad + 360) % 360);
          break;
      case "square":  // +30 -30
          // Cuadrado (Hue ±90° y ±180°)
          const angleSquare = Number(squareSlider.value);
          colors.push(hueNumber);
          colors.push((hueNumber + angleSquare) % 360);
          colors.push((hueNumber + angleSquare + angleSquare) % 360);
          colors.push((hueNumber - angleSquare + 360) % 360);
          break;
      default:
          // Si no hay esquema, solo devuelve el tono base
          colors.push(hueNumber);
  }
  return colors;
}

// Función para calcular el valor de la luminosidad de un solo color
export function calculateLuminance(color: Array<number>): number {
  // Paso 1
  let red = color[0] / 255;
  let green = color[1] / 255;
  let blue = color[2] / 255;

  // Paso 2 y 3
  red = red <= 0.03928 ? red / 12.92 : Math.pow((red + 0.055) / 1.055, 2.4);
  green = green <= 0.03928 ? green / 12.92 : Math.pow((green + 0.055) / 1.055, 2.4);
  blue = blue <= 0.03928 ? blue / 12.92 : Math.pow((blue + 0.055) / 1.055, 2.4);

  // Paso 4
  return(0.2126 * red + 0.7152 * green + 0.0722 * blue);
}

// Función para calcular el contraste entre dos colores según su luminosidad
export function calculateContrast(l1: number, l2: number): number {
  return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
}

// Función para calcular el contraste entre dos colores
export function calculateColorContrast(color1: Array<number>, color2: Array<number>): number {
  let l1 = calculateLuminance(color1);
  let l2 = calculateLuminance(color2);
  // Paso 5: El mas grande en el numerador
  [l1, l2] = [Math.max(l1, l2), Math.min(l1, l2)];
  return (l1 + 0.05) / (l2 + 0.05);
}

// Función para calcular el color blanco (devuelve el color en hsl)
export function calculateWhite(hue: number) {
  return [hue, 20, 95];
}

// Función para calcular el color negro (devuelve el color en hsl)
export function calculateBlack(hue: number) {
  return [hue, 10, 10];
}

// Función que elige si el texto es blanco o negro en base al fondo pasado
export function chooseTextColor(background: number[]) {
  const white = calculateWhite(background[0]);
  const black = calculateBlack(background[0]);
  const rgbBackground = hslToRgb(background[0], background[1], background[2]);
  const rgbWhite = hslToRgb(white[0], white[1], white[2]);
  const rgbBlack = hslToRgb(black[0], black[1], black[2]);
  const c1 = calculateColorContrast(rgbBackground, rgbWhite);
  const c2 = calculateColorContrast(rgbBackground, rgbBlack);
  return c1 > c2 ? `hsl(${white[0]}, ${white[1]}%, ${white[2]}%)` : `hsl(${black[0]}, ${black[1]}%, ${black[2]}%)`;
}