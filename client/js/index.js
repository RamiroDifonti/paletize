var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch("/api/logout", {
                method: "POST", // Es una solicitud POST para logout
                credentials: "include", // Para enviar cookies de sesión si están activadas
            });
            if (response.ok) {
                window.location.href = "/login"; // Redirigir al login después de cerrar sesión
            }
            else {
                console.error("No se pudo cerrar sesión");
                alert("Error al cerrar sesión");
            }
        }
        catch (error) {
            console.error("Error de red:", error);
            alert("Error al intentar cerrar sesión");
        }
    }));
}
export {};
