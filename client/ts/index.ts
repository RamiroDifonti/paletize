document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/protected", { credentials: "include" });

        if (!response.ok) {
            throw new Error("Unauthorized");
        }

        const data = await response.json();
        const userEmailElement = document.getElementById("userEmail");

        if (userEmailElement) {
            userEmailElement.textContent = data.username;
        }
    } catch (error) {
        console.log("No autorizado, redirigiendo a login...");
        window.location.href = "/login.html";
    }
});
