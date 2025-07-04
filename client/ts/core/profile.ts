document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("/api/profile", { credentials: "include" });

  if (!response.ok) {
      throw new Error("No autorizado");
  }

  const user = await response.json();
  // Insertar datos en el HTML
  (document.getElementById("nombre") as HTMLElement).textContent = "Nombre: " + user.firstName;
  (document.getElementById("apellido") as HTMLElement).textContent = "Apellido: " + user.lastName;
  (document.getElementById("usuario") as HTMLElement).textContent = "Usuario: " + user.username;
  const changeEmailForm = document.getElementById('changeEmailForm') as HTMLFormElement;
  const changePasswordForm = document.getElementById('changePasswordForm') as HTMLFormElement;
  const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;
  const successMessage = document.getElementById('successMessage') as HTMLDivElement;
  const updateProfileForm = document.getElementById('form1') as HTMLFormElement;
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", async () => {
      try {
          const response = await fetch("/api/logout", {
              method: "POST", // Es una solicitud POST para logout
              credentials: "include", // Para enviar cookies de sesión si están activadas
          });

          if (response.ok) {
              window.location.href = "/"; // Redirigir al login después de cerrar sesión
          } else {
              console.error("No se pudo cerrar sesión");
              alert("Error al cerrar sesión");
          }
      } catch (error) {
          console.error("Error de red:", error);
          alert("Error al intentar cerrar sesión");
      }
  }); 
  updateProfileForm?.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    try {
      let response = await fetch("/api/account/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: updateProfileForm.firstName.value,
          lastName: updateProfileForm.lastName.value,
          username: updateProfileForm.username.value
        })
      });

      if (!response.ok) {
        throw new Error("No autorizado");
      }
      const user = await response.json();
      // Insertar datos en el HTML
      (document.getElementById("nombre") as HTMLElement).textContent = "Nombre: " + user.firstName;
      (document.getElementById("apellido") as HTMLElement).textContent = "Apellido: " + user.lastName;
      (document.getElementById("usuario") as HTMLElement).textContent = "Usuario: " + user.username;
    } catch (error) {
      console.error("Error cargando perfil:", error);
      alert("No autorizado. Inicia sesión.");
      window.location.href = "/login"; // Redirigir si el usuario no está autenticado
    }
  });

  // Manejo del formulario para cambiar el correo electrónico
  changeEmailForm?.addEventListener('submit', async (e: Event) => {
      e.preventDefault();
      
      const newEmail = (document.getElementById('newEmail') as HTMLInputElement).value;
      const userId = 'id_del_usuario';  // Aquí debes obtener el ID del usuario, por ejemplo, desde el contexto de sesión

      try {
          const response = await fetch('/api/account/email', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,  // Asegúrate de usar el token de autenticación
              },
              body: JSON.stringify({ userId, newEmail }),
          });

          const data = await response.json();

          if (response.ok) {
              successMessage.style.display = 'block';
              errorMessage.style.display = 'none';
              successMessage.innerHTML = '<p>' + data.message + '</p>';
          } else {
              successMessage.style.display = 'none';
              errorMessage.style.display = 'block';
              errorMessage.innerHTML = '<p>' + data.message + '</p>';
          }
      } catch (error) {
          console.error(error);
          successMessage.style.display = 'none';
          errorMessage.style.display = 'block';
          errorMessage.innerHTML = '<p>Hubo un error al cambiar el correo electrónico. Intenta nuevamente.</p>';
      }
  });

  // Manejo del formulario para cambiar la contraseña
  changePasswordForm?.addEventListener('submit', async (e: Event) => {
      e.preventDefault();

      const currentPassword = (document.getElementById('currentPassword') as HTMLInputElement).value;
      const newPassword = (document.getElementById('newPassword') as HTMLInputElement).value;
      const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;
      const userId = 'id_del_usuario';  // Aquí debes obtener el ID del usuario, por ejemplo, desde el contexto de sesión

      // Verificar que las contraseñas coincidan
      if (newPassword !== confirmPassword) {
          errorMessage.style.display = 'block';
          errorMessage.innerHTML = '<p>Las contraseñas no coinciden. Por favor, inténtelo de nuevo.</p>';
          successMessage.style.display = 'none';
          return;
      }
      
      // Verificar que la nueva contraseña no sea igual a la actual
      if (currentPassword === newPassword) {
          errorMessage.style.display = 'block';
          errorMessage.innerHTML = '<p>La nueva contraseña no puede ser igual a la actual. Por favor, inténtelo de nuevo.</p>';
          successMessage.style.display = 'none';
          return;
      }

      try {
          const response = await fetch('/api/account/password', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('authToken')}`,  // Asegúrate de usar el token de autenticación
              },
              body: JSON.stringify({ currentPassword, newPassword }),
          });

          const data = await response.json();

          if (response.ok) {
              successMessage.style.display = 'block';
              errorMessage.style.display = 'none';
              successMessage.innerHTML = '<p>' + data.message + '</p>';
          } else {
              successMessage.style.display = 'none';
              errorMessage.style.display = 'block';
              errorMessage.innerHTML = '<p>' + data.message + '</p>';
          }
      } catch (error) {
          console.error(error);
          successMessage.style.display = 'none';
          errorMessage.style.display = 'block';
          errorMessage.innerHTML = '<p>Hubo un error al cambiar la contraseña. Intenta nuevamente.</p>';
      }
  });
});
