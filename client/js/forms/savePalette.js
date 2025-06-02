"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => {
    var _a;
    (_a = document.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        e.preventDefault();
        // Crear un objeto FormData para extraer los valores del formulario
        const form = e.target;
        const path = window.location.pathname;
        const id = path.split('/')[2]; // Obtener el ID de la URL (en este caso sería "12345")
        // Primero obtenemos el modelo de color seleccionado
        const name = form.querySelector('[name="name"]');
        const colorModel = (_a = document.querySelector('.representation-wheel')) === null || _a === void 0 ? void 0 : _a.value;
        const firstContrast = colorModel === 'hsl'
            ? (_b = document.querySelector('.contrast-selection-s')) === null || _b === void 0 ? void 0 : _b.value
            : (_c = document.querySelector('.contrast-selection-c')) === null || _c === void 0 ? void 0 : _c.value;
        const secondContrast = (_d = document.querySelector('.contrast-selection-l')) === null || _d === void 0 ? void 0 : _d.value;
        const colors = [];
        for (let i = 1; i <= 5; i++) {
            const el = document.getElementById(`color-${i}`);
            if (!el.parentElement.classList.contains('hidden')) {
                const h = el.getAttribute('h');
                const s = el.getAttribute('s');
                const l = el.getAttribute('l');
                if (h && s && l) {
                    if (colorModel === 'oklch') {
                        colors.push(`oklch(${l} ${s} ${h})`);
                    }
                    else {
                        colors.push(`hsl(${h}, ${s}%, ${l}%)`);
                    }
                }
            }
        }
        if (colors.length === 0) {
            alert('Añada colores a la paleta.');
            return;
        }
        let brandS = (_e = document.getElementById(`s-1`)) === null || _e === void 0 ? void 0 : _e.value;
        const brandL = (_f = document.getElementById(`l-1`)) === null || _f === void 0 ? void 0 : _f.value;
        const brandH = (_g = document.getElementById(`h`)) === null || _g === void 0 ? void 0 : _g.value;
        let brandColor = `hsl(${brandH}, ${brandS}%, ${brandL}%)`;
        if (colorModel === 'oklch') {
            brandS = (_h = document.getElementById(`c-1`)) === null || _h === void 0 ? void 0 : _h.value;
            brandColor = `oklch(${brandL} ${brandS} ${brandH})`;
        }
        const colorScheme = (_j = document.querySelector('.color-type')) === null || _j === void 0 ? void 0 : _j.value;
        const wcagLevel = (_k = document.querySelector('.wcag-selection')) === null || _k === void 0 ? void 0 : _k.value;
        let colorSeparation;
        switch (colorScheme) {
            case 'analogous':
                colorSeparation = (_l = document.getElementById(`analogous`)) === null || _l === void 0 ? void 0 : _l.value;
                break;
            case 'complementary':
                colorSeparation = (_m = document.getElementById(`complementary`)) === null || _m === void 0 ? void 0 : _m.value;
                break;
            case 'triad':
                colorSeparation = (_o = document.getElementById(`triad`)) === null || _o === void 0 ? void 0 : _o.value;
                break;
            case 'split-complementary':
                colorSeparation = (_p = document.getElementById(`split`)) === null || _p === void 0 ? void 0 : _p.value;
                break;
            case 'square':
                colorSeparation = (_q = document.getElementById(`square`)) === null || _q === void 0 ? void 0 : _q.value;
                break;
        }
        const isPrivate = false;
        const data = {
            name: name.value,
            colors,
            private: isPrivate,
            colorModel,
            brandColor,
            colorScheme,
            firstContrast,
            secondContrast,
            wcagLevel,
            colorSeparation,
        };
        console.log(data);
        // Enviar los datos a la API usando fetch
        if (id !== undefined) {
            const res = yield fetch(`/api/palette/user`);
            if (res.redirected) {
                window.location.href = `/login`;
                return;
            }
            const palettes = yield res.json();
            const palette = palettes.find((palette) => palette._id === id);
            if (palette) {
                try {
                    const response = yield fetch(`/api/palette/update/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data), // Convertimos el objeto a JSON
                    });
                    if (!response.ok) {
                        console.error('Error al actualizar paleta');
                        alert("Error al crear paleta. Por favor, inténtelo de nuevo más tarde.");
                        // Mostrar mensaje de error en la UI
                    }
                    else {
                        alert('Paleta actualizada correctamente');
                    }
                    return;
                }
                catch (error) {
                    console.error('Error al actualizar paleta');
                }
            }
        }
        try {
            const response = yield fetch('/api/palette/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // Convertimos el objeto a JSON
            });
            const result = yield response.json();
            if (!response.ok) {
                console.error('Error al crear paleta');
                alert("Error al crear paleta. Por favor, inténtelo de nuevo más tarde.");
                // Mostrar mensaje de error en la UI
            }
            else {
                alert('Paleta creada correctamente');
            }
        }
        catch (error) {
            console.error('Error al crear solicitud');
        }
    }));
});
