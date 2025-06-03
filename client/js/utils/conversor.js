import { select } from "../constants/selects.js";
// Convertir HSL a RGB
export function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [
        Math.round(f(0) * 255),
        Math.round(f(8) * 255),
        Math.round(f(4) * 255),
    ];
}
// Convertir RGB a HSL
export function rgbToHsl(r, g, b) {
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
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h *= 60;
    }
    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
// Convertir SRGB a OKLAB
export function srgbToOklab(r, g, b) {
    const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);
    return [0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
        1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
        0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_];
}
// Convertir Lab a OKLCH
export function okLabToOklch(l, a, b) {
    if (a === undefined)
        a = 0;
    if (b === undefined)
        b = 0;
    const c = Math.sqrt(a * a + b * b);
    let h = undefined;
    if (c) {
        h = Math.atan2(b, a) * (180 / Math.PI);
        h = h % 360 < 0 ? h + 360 : h;
    }
    return [l, c, h];
}
// Convertir RGB a OKLCH
export function rgbToOklch(red, green, blue) {
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
    const [l, a, b] = srgbToOklab(red, green, blue);
    return okLabToOklch(l, a, b);
}
export function exportColors() {
    const containers = document.querySelectorAll('[id^="color-container-"]');
    containers.forEach((container) => {
        const exportContent = container.querySelector(".export-container");
        if (!exportContent) {
            const content = document.createElement("div");
            content.classList.add("export-container", "show");
            const rows = [
                { label: "HSL:", values: ["NaN", "NaN", "NaN"] },
                { label: "OKLCH:", values: ["NaN", "NaN", "NaN"] },
                { label: "RGB:", values: ["NaN", "NaN", "NaN"] },
                { label: "Contraste:", values: ["NaN"] },
            ];
            rows.forEach(row => {
                const rowDiv = document.createElement("div");
                rowDiv.classList.add("export-row");
                const label = document.createElement("div");
                label.classList.add("export-label");
                label.textContent = row.label;
                rowDiv.appendChild(label);
                row.values.forEach(val => {
                    const value = document.createElement("div");
                    value.classList.add("export-value");
                    value.textContent = val;
                    rowDiv.appendChild(value);
                });
                content.appendChild(rowDiv);
            });
            container.appendChild(content);
        }
    });
}
export function oklchToRgb(l, c, h) {
    // Convertir de OKLCH a OKLab
    let a = 0, b = 0;
    if (h !== undefined && c !== 0) {
        const hRad = h * (Math.PI / 180);
        a = c * Math.cos(hRad);
        b = c * Math.sin(hRad);
    }
    // Convertir de OKLab a RGB lineal
    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;
    // Elevar al cubo para invertir la raíz cúbica
    const l_3 = l_ * l_ * l_;
    const m_3 = m_ * m_ * m_;
    const s_3 = s_ * s_ * s_;
    // Convertir a RGB lineal
    const r = 4.0767416621 * l_3 - 3.3077115913 * m_3 + 0.2309699292 * s_3;
    const g = -1.2684380046 * l_3 + 2.6097574011 * m_3 - 0.3413193965 * s_3;
    const b_linear = -0.0041960863 * l_3 - 0.7034186147 * m_3 + 1.7076147010 * s_3;
    // Convertir de RGB lineal a sRGB
    const toSRGB = (value) => {
        if (value <= 0)
            return 0;
        if (value >= 1)
            return 255;
        const normalized = value <= 0.0031308
            ? value * 12.92
            : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
        return Math.round(normalized * 255);
    };
    return [toSRGB(r), toSRGB(g), toSRGB(b_linear)];
}
export function updateExports() {
    const containers = document.querySelectorAll('[id^="color-container-"]');
    containers.forEach((container) => {
        const exportContent = container.querySelector(".export-container");
        const slot = container.childNodes[1];
        const hue = slot.getAttribute("h") || "0";
        const saturation = slot.getAttribute("s") || "0";
        const lightness = slot.getAttribute("l") || "0";
        let [r, g, b] = [0, 0, 0];
        let [h, s, l] = [0, 0, 0];
        let [l_, c, h_] = ["NaN", "NaN", "NaN"];
        const contrast = slot.getAttribute("contrast");
        if (select.value === "oklch") {
            [r, g, b] = oklchToRgb(Number(lightness), Number(saturation), Number(hue));
            [h, s, l] = rgbToHsl(Number(r), Number(g), Number(b));
            [l_, c, h_] = [lightness, saturation, hue];
        }
        else {
            [r, g, b] = hslToRgb(Number(hue), Number(saturation), Number(lightness));
            let [lT, cT, hT] = rgbToOklch(Number(r), Number(g), Number(b));
            h_ = hT === undefined ? "NaN" : hT.toFixed(3);
            l_ = lT.toFixed(3);
            c = cT.toFixed(3);
            [h, s, l] = [Number(hue), Number(saturation), Number(lightness)];
        }
        exportContent.childNodes.forEach((row) => {
            const childs = row.childNodes;
            if (childs[0].textContent === "HSL:") {
                childs[1].textContent = `${h}°`;
                childs[2].textContent = `${s}%`;
                childs[3].textContent = `${l}%`;
            }
            else if (childs[0].textContent === "RGB:") {
                childs[1].textContent = `${r}`;
                childs[2].textContent = `${g}`;
                childs[3].textContent = `${b}`;
            }
            else if (childs[0].textContent === "OKLCH:") {
                childs[1].textContent = `${l_}`;
                childs[2].textContent = `${c}`;
                childs[3].textContent = `${h_}°`;
            }
            else if (childs[0].textContent === "Contraste:") {
                childs[1].textContent = contrast;
            }
        });
    });
}
