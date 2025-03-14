const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST", // Es una solicitud POST para logout
                credentials: "include", // Para enviar cookies de sesión si están activadas
            });

            if (response.ok) {
                window.location.href = "/login"; // Redirigir al login después de cerrar sesión
            } else {
                console.error("No se pudo cerrar sesión");
                alert("Error al cerrar sesión");
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error al intentar cerrar sesión");
        }
    });
}