// Convertir HSL a RGB
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
      Math.round(f(0) * 255),
      Math.round(f(8) * 255),
      Math.round(f(4) * 255),
  ];
}

// Convertir RGB a HSL
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }

  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

// Convertir SRGB a OKLAB
export function srgbToOklab (r: number, g: number, b: number): [number, number, number] {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
	const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
	const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return [0.2104542553*l_ + 0.7936177850*m_ - 0.0040720468*s_,
          1.9779984951*l_ - 2.4285922050*m_ + 0.4505937099*s_,
          0.0259040371*l_ + 0.7827717662*m_ - 0.8086757660*s_];
}

// Convertir Lab a OKLCH
export function okLabToOklch(l: number, a: number, b: number): [number, number, number | undefined] {
  if (a === undefined) a = 0;
  if (b === undefined) b = 0;

  const c = Math.sqrt(a * a + b * b);
  let h = undefined;
  if (c) {
    h = Math.atan2(b, a) * (180 / Math.PI);
    h = h % 360 < 0 ? h + 360 : h;
  }
  return [l, c, h];
}

// Convertir RGB a OKLCH
export function rgbToOklch(red: number, green: number, blue: number): [number, number, number | undefined] {
  const rNorm = red / 255;
  red = rNorm <= 0.04045
    ? rNorm / 12.92
    : Math.pow((rNorm + 0.055) / 1.055, 2.4);
  const gNorm = green / 255;
  green = gNorm <= 0.04045
    ? gNorm / 12.92
    : Math.pow((gNorm + 0.055) / 1.055, 2.4);
  const bNorm = blue / 255;
  blue = bNorm <= 0.04045
    ? bNorm / 12.92
    : Math.pow((bNorm + 0.055) / 1.055, 2.4);

  const [l, a, b] =srgbToOklab(red, green, blue);
  return okLabToOklch(l, a, b);
}

export function ExportColors() {
  const containers = document.querySelectorAll('[id^="color-container-"]');
  containers.forEach((container) => {
    const content = document.createElement("div");
    content.classList.add("export-container");
    content.style.display = "flex";
    content.style.flexDirection = "column";
    const bgColor = (container.childNodes[1] as HTMLDivElement).style.backgroundColor;
    const [, r, g, b] = bgColor.match(/rgb\((\d+), (\d+), (\d+)\)/) || [];
    const [h, s, l] = rgbToHsl(Number(r), Number(g), Number(b));
    let [li, c, hue] = rgbToOklch(Number(r), Number(g), Number(b));
    const hueString = (hue === undefined) ? "NaN" : hue.toFixed(3) + "";
    const textHsl = document.createElement("label");
    textHsl.innerText = `hsl: (${h}, ${s}, ${l})`;
    textHsl.style.marginTop = "10%";
    textHsl.style.marginLeft = "5%";

    const textRgb = document.createElement("label");
    textRgb.innerText = `rgb: (${r}, ${g}, ${b})`;
    textRgb.style.marginTop = "10%";
    textRgb.style.marginLeft = "5%";

    const textOkLCH = document.createElement("label");
    textOkLCH.innerText = `oklch:\n(${li.toFixed(3)}, ${c.toFixed(3)}, ${hueString})`;
    textOkLCH.style.marginTop = "10%";
    textOkLCH.style.marginLeft = "5%";

    content.appendChild(textHsl);
    content.appendChild(textRgb);
    content.appendChild(textOkLCH);
    container.appendChild(content);
  });
}
