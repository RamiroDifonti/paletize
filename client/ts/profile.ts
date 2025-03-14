document.addEventListener("DOMContentLoaded", async () => {
  try {
      const response = await fetch("/api/profile", { credentials: "include" });

      if (!response.ok) {
          throw new Error("No autorizado");
      }

      const user = await response.json();
      console.log(user);
      // Insertar datos en el HTML
      (document.getElementById("nombre") as HTMLElement).textContent = user.firstName;
      (document.getElementById("apellido") as HTMLElement).textContent = user.lastName;
      (document.getElementById("usuario") as HTMLElement).textContent = user.username;
      (document.getElementById("fotoPerfil") as HTMLImageElement).src = user.fotoPerfil;
  } catch (error) {
      console.error("Error cargando perfil:", error);
      alert("No autorizado. Inicia sesión.");
      window.location.href = "/login"; // Redirigir si el usuario no está autenticado
  }
});
