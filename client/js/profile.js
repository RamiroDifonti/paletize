"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("/api/profile", { credentials: "include" });
        if (!response.ok) {
            throw new Error("No autorizado");
        }
        const user = yield response.json();
        console.log(user);
        // Insertar datos en el HTML
        document.getElementById("nombre").textContent = user.firstName;
        document.getElementById("apellido").textContent = user.lastName;
        document.getElementById("usuario").textContent = user.username;
        document.getElementById("fotoPerfil").src = user.fotoPerfil;
    }
    catch (error) {
        console.error("Error cargando perfil:", error);
        alert("No autorizado. Inicia sesión.");
        window.location.href = "/login"; // Redirigir si el usuario no está autenticado
    }
}));
