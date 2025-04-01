document.addEventListener("DOMContentLoaded", () => {
    const colorContainers = document.querySelectorAll<HTMLElement>(".color-container");
  
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
      });
      
  
      // Función que actualiza el color en CSS
      const updateColor = () => {
        const h = hueSlider.value;
        const s = satSlider.value;
        const l = lightSlider.value;
        const hsl = `hsl(${h}, ${s}%, ${l}%)`;
        document.documentElement.style.setProperty(`--color-${colorId}`, hsl);
      };
  
      // Sincronizar sliders y números
      connectSliderWithNumber(hueSlider, hueNumber, updateColor);
      connectSliderWithNumber(satSlider, satNumber, updateColor);
      connectSliderWithNumber(lightSlider, lightNumber, updateColor);
  
      // Inicializa el color
      updateColor();
    });
});
  