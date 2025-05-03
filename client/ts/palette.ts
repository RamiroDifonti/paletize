document.addEventListener("DOMContentLoaded", () => {
    // Contenedores de colores
    const colorContainers = document.querySelectorAll<HTMLElement>(".color-container");

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
    const squareSlider = document.querySelector<HTMLInputElement>("#square");
    const analogousValue = document.querySelector<HTMLInputElement>("#analogous-value");
    const splitValue = document.querySelector<HTMLInputElement>("#split-value");
    const triadValue = document.querySelector<HTMLInputElement>("#triad-value");
    const complementaryValue = document.querySelector<HTMLInputElement>("#complementary-value");
    const squareValue = document.querySelector<HTMLInputElement>("#square-value");

    // Función para sincronizar slider y número
    const connectSliderWithNumber = (
      slider: HTMLInputElement,
      numberInput: HTMLInputElement,
      onChange: () => void,
      min: number = 0
    ) => {
      // Slider mueve número
      slider.addEventListener("input", () => {
        if (min != 0) {
          numberInput.min = min.toString();
        }
        if (slider.valueAsNumber < min) {
          slider.value = min.toString();
        }
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
        !splitValue || !triadValue || !complementaryValue || !squareSlider ||
        !squareValue) {
        return;
    }
    connectSliderWithNumber(satSlider1, satValue1, createAll);
    connectSliderWithNumber(lightSlider1, lightValue1, createAll);
    connectSliderWithNumber(hueSlider1, hueValue1, createAll);
    connectSliderWithNumber(satSlider2, satValue2, createAll);
    connectSliderWithNumber(lightSlider2, lightValue2, createAll);

    connectSliderWithNumber(analogousSlider, analogousValue, createAll);
    connectSliderWithNumber(triadSlider, triadValue, createAll);
    connectSliderWithNumber(complementarySlider, complementaryValue, createAll);
    connectSliderWithNumber(splitSlider, splitValue, createAll);
    connectSliderWithNumber(squareSlider, squareValue, createAll);
    
    colorContainers.forEach((container) => {
      const colorDiv = container.querySelector<HTMLElement>(".color");
      const editButton = container.querySelector<HTMLButtonElement>(".edit-icon");
      const exportButton = container.querySelector<HTMLButtonElement>(".export-icon");
      if (!colorDiv || !editButton || !exportButton) return;
  
      let colorId = colorDiv.id.split("-")[1]; // "1", "2", etc.
  
      const panel = container.querySelector<HTMLElement>(`#panel-${colorId}`);
      const satSlider = container.querySelector<HTMLInputElement>(`#saturation-${colorId}`);
      const lightSlider = container.querySelector<HTMLInputElement>(`#lightness-${colorId}`);
  
      const satNumber = container.querySelector<HTMLInputElement>(`#saturation-value-${colorId}`);
      const lightNumber = container.querySelector<HTMLInputElement>(`#lightness-value-${colorId}`);
      
      // Poner un texto si no cumple con el contraste
      const text = document.createElement("label");
      if (colorId !== "1") {
        text.id = "contrast-text-" + colorId;
        text.innerText = `No cumple con ningún contraste`;
        text.style.wordBreak = "break-word";
        text.style.textAlign = "center";
        (container.childNodes[3] as HTMLElement).appendChild(text);
      }
      
      if (
        !panel || !satSlider || !lightSlider || !satNumber || !lightNumber
      ) return;
  
      // Mostrar/Ocultar panel al hacer clic
      editButton.addEventListener("click", () => {
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
      exportButton.addEventListener("click", () => {
        // Eliminar el panel de edición si está visible
        const shouldShow = !panel.classList.contains("show");
        document.querySelectorAll<HTMLElement>(".editor-panel").forEach((p) => {
            if (!shouldShow) {
              p.classList.remove("show");
            }
        });
        // Mostrar el color en distintos formatos
      });

      // Función que actualiza el color en CSS
      const updateColor = () => {
        const colorElement = document.getElementById(`color-checkbox-${colorId}`) as HTMLElement;
        const branding = colorElement.getAttribute("branding");
        const parent = colorElement?.parentElement;
        if (!parent) return;
        if (branding === "true") {
          satSlider1.value = satSlider.value;
          satValue1.value = satSlider.value;
          lightSlider1.value = lightSlider.value;
          lightValue1.value = lightSlider.value;
          updateAll();
          return;
        } else if (branding === "secondary") {
          satSlider2.value = satSlider.value;
          satValue2.value = satSlider.value;
          lightSlider2.value = lightSlider.value;
          lightValue2.value = lightSlider.value;
          createAll();
          return;
        }
        if (satSlider.value !== satSlider.getAttribute("previousValue") && (satSlider.getAttribute("previousValue") !== null || satNumber.getAttribute("previousValue") !== null)) {
          satSlider.setAttribute("previousValue", satSlider.value);
          satNumber.setAttribute("previousValue", satSlider.value);
          let color
          let wheelText;
          let wheel;
          if (parent?.id === "palette-1") {
            wheel = secondWheelCanvas!.parentElement;
            wheelText = "lh";
            color = "white";
          } else {
            wheel = firstWheelCanvas!.parentElement;
            wheelText = "sh";
            color = "black";
          }
          const circleString = `circle-${color}-${wheelText}`;
          const elements = document.querySelectorAll(`[id^="${circleString}"]`);
          const colorDiv = document.getElementById(`color-${colorId}`) as HTMLDivElement;
          elements.forEach((element, index) => {
            const circle = element as HTMLDivElement;
            if (circle.style.backgroundColor === colorDiv.style.backgroundColor) {
              const colorPalette = parent.childNodes[index] as HTMLDivElement;
              colorPalette.style.backgroundColor = `hsl(${hueSlider1.value}, ${satSlider.value}%, ${lightSlider.value}%)`;
              colorDiv.style.backgroundColor = `hsl(${hueSlider1.value}, ${satSlider.value}%, ${lightSlider.value}%)`;
              circle.style.backgroundColor = `hsl(${hueSlider1.value}, ${satSlider.value}%, ${lightSlider.value}%)`;
              // Solo se deberia mover si el color circulo es de la paleta derecha
              if (parent?.id === "palette-1" && color === "white") {
                updateOneCircle(circle, satSlider.valueAsNumber);
              }
              return;
            }
          });
          return;
        } else if (lightSlider.value !== lightSlider.getAttribute("previousValue") && (lightSlider.getAttribute("previousValue") !== null || lightNumber.getAttribute("previousValue") !== null)) {
          lightSlider.setAttribute("previousValue", lightSlider.value);
          lightNumber.setAttribute("previousValue", lightSlider.value);
          let color
          let wheelText;
          let wheel;
          if (parent?.id === "palette-1") {
            wheel = secondWheelCanvas!.parentElement;
            wheelText = "lh";
            color = "white";
          } else {
            wheel = firstWheelCanvas!.parentElement;
            wheelText = "sh";
            color = "black";
          }

          const circleString = `circle-${color}-${wheelText}`;
          const elements = document.querySelectorAll(`[id^="${circleString}"]`);
          const colorDiv = document.getElementById(`color-${colorId}`) as HTMLDivElement;
          elements.forEach((element, index) => {
            const circle = element as HTMLDivElement;
            if (circle.style.backgroundColor === colorDiv.style.backgroundColor) {
              const colorPalette = parent.childNodes[index] as HTMLDivElement;
              colorPalette.style.backgroundColor = `hsl(${hueSlider1.value}, ${satSlider.value}%, ${lightSlider.value}%)`;
              colorDiv.style.backgroundColor = `hsl(${hueSlider1.value}, ${satSlider.value}%, ${lightSlider.value}%)`;
              circle.style.backgroundColor = `hsl(${hueSlider1.value}, ${satSlider.value}%, ${lightSlider.value}%)`;
              // Solo se deberia mover si el color circulo es de la paleta izquierda
              if (parent?.id === "palette-2" && color === "black") {
                updateOneCircle(circle, lightSlider.valueAsNumber);
              }
              return;
            }
          });
          return;
        }
      };
  
      // Sincronizar sliders y números
      connectSliderWithNumber(satSlider, satNumber, updateColor);
      connectSliderWithNumber(lightSlider, lightNumber, updateColor);
  
      // Inicializa el color
      createAll();
    });
});
  