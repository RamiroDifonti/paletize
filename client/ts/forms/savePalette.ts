document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Crear un objeto FormData para extraer los valores del formulario
    const form = e.target as HTMLFormElement;
    const path = window.location.pathname;
    const id = path.split('/')[2]; // Obtener el ID de la URL (en este caso sería "12345")

    // Primero obtenemos el modelo de color seleccionado
    const name = form.querySelector('[name="name"]') as HTMLInputElement;
    const colorModel = (document.querySelector('.representation-wheel') as HTMLSelectElement)?.value as 'hsl' | 'oklch';
    const firstContrast = colorModel === 'hsl'
      ? (document.querySelector('.contrast-selection-s') as HTMLSelectElement)?.value
      : (document.querySelector('.contrast-selection-c') as HTMLSelectElement)?.value;
    const secondContrast = (document.querySelector('.contrast-selection-l') as HTMLSelectElement)?.value;
    const colors: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const el = document.getElementById(`color-${i}`)!;
      if (!el.parentElement!.classList.contains('hidden')) {
        const h = el.getAttribute('h');
        const s = el.getAttribute('s');
        const l = el.getAttribute('l');
        if (h && s && l) {
          if (colorModel === 'oklch') {
            colors.push(`oklch(${l} ${s} ${h})`);
          } else {
            colors.push(`hsl(${h}, ${s}%, ${l}%)`);
          }
        }
      }
    }
    if (colors.length === 0) {
      alert('Añada colores a la paleta.');
      return;
    }
    let brandS = (document.getElementById(`s-1`) as HTMLInputElement)?.value;
    const brandL = (document.getElementById(`l-1`) as HTMLInputElement)?.value;
    const brandH = (document.getElementById(`h`) as HTMLInputElement)?.value;
    let brandColor = `hsl(${brandH}, ${brandS}%, ${brandL}%)`;
    if (colorModel === 'oklch') {
      brandS = (document.getElementById(`c-1`) as HTMLInputElement)?.value;
      brandColor = `oklch(${brandL} ${brandS} ${brandH})`;
    }
    const colorScheme = (document.querySelector('.color-type') as HTMLSelectElement)?.value as 'analogous' | 'complementary' | 'triad' | 'split-complementary' | 'square';
    const wcagLevel = (document.querySelector('.wcag-selection') as HTMLSelectElement)?.value as 'AA' | 'AAA';
    let colorSeparation;
    switch (colorScheme) {
      case 'analogous':
        colorSeparation = (document.getElementById(`analogous`) as HTMLInputElement)?.value;
        break;
      case 'complementary':
        colorSeparation = (document.getElementById(`complementary`) as HTMLInputElement)?.value;
        break;
      case 'triad':
        colorSeparation = (document.getElementById(`triad`) as HTMLInputElement)?.value;
        break;
      case 'split-complementary':
        colorSeparation = (document.getElementById(`split`) as HTMLInputElement)?.value;
        break;
      case 'square':
        colorSeparation = (document.getElementById(`square`) as HTMLInputElement)?.value;
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
      const res = await fetch(`/api/palette/user`);
      if (res.redirected) {
        window.location.href = `/login`;
        return;
      }
      const palettes = await res.json();
      const palette = palettes.find((palette: { _id: string }) => palette._id === id);
      if (palette) {
        try {
          const response = await fetch(`/api/palette/update/${id}`, {
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
          } else {
            alert('Paleta actualizada correctamente');
          }
          return;
        } catch (error) {
          console.error('Error al actualizar paleta');
        }
      }
    }
    try {
      const response = await fetch('/api/palette/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Convertimos el objeto a JSON
      });
      const result = await response.json();
      if (!response.ok) {
        console.error('Error al crear paleta');
        alert("Error al crear paleta. Por favor, inténtelo de nuevo más tarde.");
        // Mostrar mensaje de error en la UI
      } else {
        alert('Paleta creada correctamente');
      }
    } catch (error) {
      console.error('Error al crear solicitud');
    }
  });
});