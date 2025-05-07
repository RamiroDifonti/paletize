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
document.addEventListener('DOMContentLoaded', () => {
    const changeEmailForm = document.getElementById('changeEmailForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    // Manejo del formulario para cambiar el correo electrónico
    changeEmailForm === null || changeEmailForm === void 0 ? void 0 : changeEmailForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const newEmail = document.getElementById('newEmail').value;
        const userId = 'id_del_usuario'; // Aquí debes obtener el ID del usuario, por ejemplo, desde el contexto de sesión
        try {
            const response = yield fetch('/api/account/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Asegúrate de usar el token de autenticación
                },
                body: JSON.stringify({ userId, newEmail }),
            });
            const data = yield response.json();
            if (response.ok) {
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                successMessage.innerHTML = '<p>' + data.message + '</p>';
            }
            else {
                successMessage.style.display = 'none';
                errorMessage.style.display = 'block';
                errorMessage.innerHTML = '<p>' + data.message + '</p>';
            }
        }
        catch (error) {
            console.error(error);
            successMessage.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.innerHTML = '<p>Hubo un error al cambiar el correo electrónico. Intenta nuevamente.</p>';
        }
    }));
    // Manejo del formulario para cambiar la contraseña
    changePasswordForm === null || changePasswordForm === void 0 ? void 0 : changePasswordForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const userId = 'id_del_usuario'; // Aquí debes obtener el ID del usuario, por ejemplo, desde el contexto de sesión
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
            const response = yield fetch('/api/account/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Asegúrate de usar el token de autenticación
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = yield response.json();
            if (response.ok) {
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                successMessage.innerHTML = '<p>' + data.message + '</p>';
            }
            else {
                successMessage.style.display = 'none';
                errorMessage.style.display = 'block';
                errorMessage.innerHTML = '<p>' + data.message + '</p>';
            }
        }
        catch (error) {
            console.error(error);
            successMessage.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.innerHTML = '<p>Hubo un error al cambiar la contraseña. Intenta nuevamente.</p>';
        }
    }));
});
