document.addEventListener("DOMContentLoaded", () => {
    // Contenedores de colores
    const colorContainers = document.querySelectorAll<HTMLElement>(".color-container");
    const colorScheme = document.querySelector<HTMLSelectElement>(".color-type");

    const satSlider1 = document.querySelector<HTMLInputElement>("#s-1");
    const lightSlider1 = document.querySelector<HTMLInputElement>("#l-1");
    const hueSlider1 = document.querySelector<HTMLInputElement>("#h");
    const satSlider2 = document.querySelector<HTMLInputElement>("#s-2");
    const lightSlider2 = document.querySelector<HTMLInputElement>("#l-2");
    const satValue1 = document.querySelector<HTMLInputElement>("#s-1-value");
    const lightValue1 = document.querySelector<HTMLInputElement>("#l-1-value");
    const hueValue1 = document.querySelector<HTMLInputElement>("#h-value");
    const satValue2 = document.querySelector<HTMLInputElement>("#s-2-value");
    const lightValue2 = document.querySelector<HTMLInputElement>("#l-2-value");
    const analogousSlider = document.querySelector<HTMLInputElement>("#analogous");
    const splitSlider = document.querySelector<HTMLInputElement>("#split");
    const triadSlider = document.querySelector<HTMLInputElement>("#triad");
    const complementarySlider = document.querySelector<HTMLInputElement>("#complementary");
    const analogousValue = document.querySelector<HTMLInputElement>("#analogous-value");
    const splitValue = document.querySelector<HTMLInputElement>("#split-value");
    const triadValue = document.querySelector<HTMLInputElement>("#triad-value");
    const complementaryValue = document.querySelector<HTMLInputElement>("#complementary-value");

    // Función para sincronizar slider y número
    const connectSliderWithNumber = (
      slider: HTMLInputElement,
      numberInput: HTMLInputElement,
      onChange: () => void
    ) => {
      // Slider mueve número
      slider.addEventListener("input", () => {
        numberInput.setAttribute("previousValue", numberInput.value);
        numberInput.value = slider.value;
        onChange();
      });
  
      // Número mueve slider

      numberInput.addEventListener("input", () => {
        slider.setAttribute("previousValue", slider.value);

        let val = Number(numberInput.value);
        if (val < Number(slider.min)) val = Number(slider.min);
        if (val > Number(slider.max)) val = Number(slider.max);
        slider.value = val.toString();
        onChange();
      });
    };
    if (!satSlider1 || !lightSlider1 || !hueSlider1 ||
        !satSlider2 || !lightSlider2 || !satValue1 || !lightValue1 ||
        !hueValue1 || !satValue2 || !lightValue2 || !analogousSlider ||
        !splitSlider || !triadSlider || !complementarySlider || !analogousValue ||
        !splitValue || !triadValue || !complementaryValue) {
        return;
    }
    connectSliderWithNumber(satSlider1, satValue1, updateAll);
    connectSliderWithNumber(lightSlider1, lightValue1, updateAll);
    connectSliderWithNumber(hueSlider1, hueValue1, updateAll);
    connectSliderWithNumber(satSlider2, satValue2, updateAll);
    connectSliderWithNumber(lightSlider2, lightValue2, updateAll);

    connectSliderWithNumber(analogousSlider, analogousValue, updateAll);
    connectSliderWithNumber(triadSlider, triadValue, updateAll);
    connectSliderWithNumber(complementarySlider, complementaryValue, updateAll);
    connectSliderWithNumber(splitSlider, splitValue, updateAll);

    colorContainers.forEach((container) => {
      const colorDiv = container.querySelector<HTMLElement>(".color");
      const button = container.querySelector<HTMLButtonElement>(".edit-icon");
  
      if (!colorDiv || !button) return;
  
      let colorId = colorDiv.id.split("-")[1]; // "1", "2", etc.
  
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

      // Función que actualiza el color en CSS
      const updateColor = () => {
        const parent = document.getElementById(`color-checkbox-${colorId}`)?.parentElement?.id;
        
        if (!parent) return;
        const s = satSlider.value;
        const l = lightSlider.value;
        const h = hueSlider.value;
        if (parent === "palette-1") {
          satSlider1.value = s;
          satValue1.value = s;
          lightSlider1.value = l;
          lightValue1.value = l;
        } else {
          satSlider2.value = s;
          satValue2.value = s;
          lightSlider2.value = l;
          lightValue2.value = l;
        }
        let hueNumber: number = Number(h) - Number(hueSlider.getAttribute("previousValue"));

        // Si se está modificando el branding color, simplemente se asigna este valor a los
        // sliders de la izquierda, si no, se calcula la diferencia entre el valor actual y el 
        // anterior y se suma con el slider de la izquierda
        if (hueSlider1.value === hueSlider.getAttribute("previousValue")) {
          hueNumber = Number(h);
        } else {
          hueNumber += Number(hueSlider1.value);
          hueNumber = hueNumber % 360;
        }
        hueSlider1.value = hueNumber.toString();
        hueValue1.value = hueNumber.toString();
        updateAll();
      };
  
      // Sincronizar sliders y números
      connectSliderWithNumber(hueSlider, hueNumber, updateColor);
      connectSliderWithNumber(satSlider, satNumber, updateColor);
      connectSliderWithNumber(lightSlider, lightNumber, updateColor);
  
      // Inicializa el color
      updateAll();
    });
});
  