const buttons = document.querySelectorAll('.selection button');
const createButton = document.getElementById('create') as HTMLButtonElement;
buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(btn => btn.classList.remove('active')); // quitar selección previa
    button.classList.add('active'); // marcar el clicado
    loadItems(); // cargar los items
  });
});

createButton.addEventListener('click', () => {
  window.location.href = `/palette`;
  return;
});



document.addEventListener("DOMContentLoaded", async () => {
  loadItems(); // cargar los items al cargar la página
});

interface Palette {
  _id: string;
  name: string;
  colorModel: string;
  brandColor: string;
  colorScheme: string;
  colors: string[];
  firstContrast: string;
  secondContrast: string;
  wcagLevel: string;
  colorSeparation: number;
  createdAt: string;
  updatedAt: string;
  private: boolean;
  creator: {
    _id: string;
    username: string;
  };
  likes: string[];
}
async function loadItems () {
  const palette = document.querySelector('.selection .active') as HTMLButtonElement;
  const isUserPalettes = palette.id === 'user'? true : false;
  const container = document.querySelector(".search-items") as HTMLDivElement;
  if (!container) return;
  container.innerHTML = "";
  let fetchString = "/api/palette/public"
  if (isUserPalettes) {
    fetchString = "/api/palette/user"
  }
  try {
    let res = await fetch(fetchString);
    if (res.redirected) {
      window.location.href = `/login`;
      return;
    }
    const palettes = await res.json();

    palettes.forEach((palette: Palette) => {
      const item = document.createElement("div");
      item.classList.add("item");
      item.style.background = "#ccc";
      item.style.display = "flex";
      item.style.flexDirection = "column";
      item.style.cursor = "pointer";

      const colors = document.createElement("div");
      colors.style.display = "flex";
      palette.colors.map((color: string) => {
        const colorDiv = document.createElement("div");
        // colorDiv.style.width = "20%";
        colorDiv.className = "color";
        colorDiv.style.background = color;
        colorDiv.style.width = "20%";  // Tamaño de cada color
        colorDiv.style.height = "150px";  // Tamaño de cada color
        colors.appendChild(colorDiv);
      });
      const info = document.createElement("section");
      info.className = "info";
      const nameLabel = document.createElement("p");
      nameLabel.innerText = palette.name;
      info.appendChild(nameLabel);

      const creatorLabel = document.createElement("p");
      creatorLabel.innerText = palette.creator.username;
      info.appendChild(creatorLabel);
      const likesLabel = document.createElement("p");
      likesLabel.innerText = `${palette.likes.length} ♡`;
      info.appendChild(likesLabel);

      item.append(colors);
      item.appendChild(info);
      item.addEventListener("click", () => {
        window.location.href = `/palette/${palette._id}`;
      });
      container.appendChild(item);
    });
  } catch (e) {
    console.error("Error al cargar paletas:", e);
  }
}

// Cargar los elementos encontrados
document.getElementById("searchForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const name = formData.get("name");

  try {
    const response = await fetch("/api/palette/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) throw new Error("Error en la búsqueda");

    const palettes = await response.json();
    console.log(palettes);
    const container = document.querySelector(".search-items") as HTMLDivElement;
    if (!container) return;
    container!.innerHTML = ""; // Limpiar resultados anteriores

    palettes.forEach((palette: any) => {
      const item = document.createElement("div");
      item.classList.add("item");
      item.style.background = "#ccc";
      item.style.display = "flex";
      item.style.flexDirection = "column";
      item.style.cursor = "pointer";

      const colors = document.createElement("div");
      colors.style.display = "flex";
      palette.colors.map((color: string) => {
        const colorDiv = document.createElement("div");
        // colorDiv.style.width = "20%";
        colorDiv.className = "color";
        colorDiv.style.background = color;
        colorDiv.style.width = "20%";  // Tamaño de cada color
        colorDiv.style.height = "150px";  // Tamaño de cada color
        colors.appendChild(colorDiv);
      });
      const info = document.createElement("section");
      info.className = "info";
      const nameLabel = document.createElement("p");
      nameLabel.innerText = palette.name;
      info.appendChild(nameLabel);

      const creatorLabel = document.createElement("p");
      creatorLabel.innerText = palette.creator.username;
      info.appendChild(creatorLabel);
      const likesLabel = document.createElement("p");
      likesLabel.innerText = `${palette.likes.length} ♡`;
      info.appendChild(likesLabel);

      item.append(colors);
      item.appendChild(info);
      item.addEventListener("click", () => {
        window.location.href = `/palette/${palette._id}`;
      });
      container.appendChild(item);
    });
  } catch (error) {
    console.error(error);
    alert("No se pudieron cargar las paletas");
  }
});