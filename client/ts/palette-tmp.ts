document.addEventListener("DOMContentLoaded", () => {
    // Contenedores de colores
    const colorContainers = document.querySelectorAll<HTMLElement>(".color-container");
    // Sliders de color globales
    const colorSection = document.querySelector<HTMLSelectElement>(".color-section");
    // Función para sincronizar slider y número
    const connectSliderWithNumber = (
      slider: HTMLInputElement,
      numberInput: HTMLInputElement,
      onChange: () => void
    ) => {
      // Slider mueve número
      slider.addEventListener("input", () => {
        numberInput.value = slider.value;
        onChange();
      });
  
      // Número mueve slider
      numberInput.addEventListener("input", () => {
        let val = Number(numberInput.value);
        if (val < Number(slider.min)) val = Number(slider.min);
        if (val > Number(slider.max)) val = Number(slider.max);
        slider.value = val.toString();
        onChange();
      });
    };
    const satSlider1 = document.querySelector<HTMLInputElement>("#s-1");
    const lightSlider1 = document.querySelector<HTMLInputElement>("#l-1");
    const hueSlider = document.querySelector<HTMLInputElement>("#h");
    const satSlider2 = document.querySelector<HTMLInputElement>("#s-2");
    const lightSlider2 = document.querySelector<HTMLInputElement>("#l-2");
    const satValue1 = document.querySelector<HTMLInputElement>("#s-1-value");
    const lightValue1 = document.querySelector<HTMLInputElement>("#l-1-value");
    const hueValue = document.querySelector<HTMLInputElement>("#h-value");
    const satValue2 = document.querySelector<HTMLInputElement>("#s-2-value");
    const lightValue2 = document.querySelector<HTMLInputElement>("#l-2-value");
    if (!satSlider1 || !lightSlider1 || !hueSlider ||
        !satSlider2 || !lightSlider2 || !satValue1 || !lightValue1 ||
        !hueValue || !satValue2 || !lightValue2) {
        return;
    }
    connectSliderWithNumber(satSlider1, satValue1, updateAll);
    connectSliderWithNumber(lightSlider1, lightValue1, updateAll);
    connectSliderWithNumber(hueSlider, hueValue, updateAll);
    connectSliderWithNumber(satSlider2, satValue2, updateAll);
    connectSliderWithNumber(lightSlider2, lightValue2, updateAll);

    colorContainers.forEach((container) => {
      const colorDiv = container.querySelector<HTMLElement>(".color");
      const button = container.querySelector<HTMLButtonElement>(".edit-icon");
  
      if (!colorDiv || !button) return;
  
      const colorId = colorDiv.id.split("-")[1]; // "1", "2", etc.
  
      const panel = container.querySelector<HTMLElement>(`#panel-${colorId}`);
      const hueSlider = container.querySelector<HTMLInputElement>(`#hue-${colorId}`);
      const satSlider = container.querySelector<HTMLInputElement>(`#saturation-${colorId}`);
      const lightSlider = container.querySelector<HTMLInputElement>(`#lightness-${colorId}`);
  
      const hueNumber = container.querySelector<HTMLInputElement>(`#hue-value-${colorId}`);
      const satNumber = container.querySelector<HTMLInputElement>(`#saturation-value-${colorId}`);
      const lightNumber = container.querySelector<HTMLInputElement>(`#lightness-value-${colorId}`);
  
      if (
        !panel || !hueSlider || !satSlider || !lightSlider ||
        !hueNumber || !satNumber || !lightNumber
      ) return;
  
      // Mostrar/Ocultar panel al hacer clic
      button.addEventListener("click", () => {
        // Mostrar u ocultar TODOS los panels
        const shouldShow = !panel.classList.contains("show");
        document.querySelectorAll<HTMLElement>(".editor-panel").forEach((p) => {
            if (shouldShow) {
                p.classList.add("show");
            } else {
                p.classList.remove("show");
            }
        });
        updateAll();
      });
      // Función para calcular los colores
      function calculateColors(colorText: string) : string[] {
        let colorNumber = parseInt(colorText); // Obtener el número del color
        const hueInput = document.getElementById(`hue-${colorNumber}`) as HTMLInputElement;
        const inputs : HTMLInputElement[] = [];        
        for (let i = 0; i < 5; i++, colorNumber++) {
          if (colorNumber > 5) {
            colorNumber = 1;
          }
          inputs.push(document.getElementById(`hue-${colorNumber}`) as HTMLInputElement);
          inputs.push(document.getElementById(`hue-value-${colorNumber}`) as HTMLInputElement);
        }
        const hue = parseInt(hueInput.value); // Obtener el valor del slider de tono
        const colors : string[] = [];
        const colorType = document.querySelector<HTMLSelectElement>(".color-type");
        switch (colorType?.value) {
            case "analogous":
                // Colores análogos (Hue ±30°)
                for (let i = 0; i < 5; i++) {
                  const tmp = (hue + (i * 10)) % 360;
                  colors.push(tmp.toString());
                }
                for (let i = 2; i < inputs.length; i+=2) {
                  inputs.at(i)?.setAttribute("value", `${(hue + (i / 2 * 10)) % 360}`);
                  inputs.at(i + 1)?.setAttribute("value", `${(hue + (i / 2 * 10)) % 360}`);
                }
                break;
            case "complementary":
                // Colores complementarios (Hue +180°)
                // colors.push(hue);
                // colors.push((hue + 180) % 360);
                break;
            case "split-complementary":
                // Split complementarios (Hue ±150°)
                // colors.push(hue);
                // colors.push((hue + 30) % 360);
                // colors.push((hue - 30 + 360) % 360);
                break;
            case "triad":
                // Triadas (Hue ±120°)
                // colors.push(hue);
                // colors.push((hue + 120) % 360);
                // colors.push((hue - 120 + 360) % 360);
                break;
            case "square":
                // Cuadrado (Hue ±90° y ±180°)
                // colors.push(hue);
                // colors.push((hue + 90) % 360);
                // colors.push((hue + 180) % 360);
                // colors.push((hue - 90 + 360) % 360);
                break;
            case "monochromatic":
                // Monocromático (solo el tono base)
                // colors.push(hue);
                break;
            
            default:
                // Si no hay esquema, solo devuelve el tono base
                // colors.push(hue);
        }
        return colors;
      }
      // Función que actualiza el color en CSS
      const updateColor = () => {
        const s = satSlider.value;
        const l = lightSlider.value;
        const hues = calculateColors(colorId);
        let colorIdNumber = parseInt(colorId);
        for (let i = 0; i < 5; i++, colorIdNumber++) {
          if (colorIdNumber > 5) {
            colorIdNumber = 1;
          }
          document.documentElement.style.setProperty(`--color-${colorIdNumber}`, `hsl(${hues[i]}, ${s}%, ${l}%)`);
        }
        updateAll();
      };
  
      // Sincronizar sliders y números
      connectSliderWithNumber(hueSlider, hueNumber, updateColor);
      connectSliderWithNumber(satSlider, satNumber, updateColor);
      connectSliderWithNumber(lightSlider, lightNumber, updateColor);
  
      // Inicializa el color
      updateColor();
    });
});
  