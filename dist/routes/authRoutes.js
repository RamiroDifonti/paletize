"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authControllers_1 = require("../controllers/authControllers");
const authControllers_2 = require("../controllers/authControllers");
const authMiddleware_1 = require("../middlewares/authMiddleware");
exports.default = (router) => {
    // Rutas para la api
    router.post("/api/register", authControllers_1.register);
    router.post("/api/logout", authControllers_1.logout);
    router.post("/api/login", authControllers_1.login);
    router.get("/api/protected", authMiddleware_1.authMiddleware, authControllers_1.protectedSession);
    router.get("/api/profile", authMiddleware_1.authMiddleware, authControllers_1.apiProfile);
    router.post("/api/account/profile", authMiddleware_1.authMiddleware, authControllers_1.updateProfile);
    router.post("/api/account/email", authMiddleware_1.authMiddleware, authControllers_1.changeEmail);
    router.post("/api/account/password", authMiddleware_1.authMiddleware, authControllers_1.changePassword);
    // Rutas para el cliente
    router.get("/", authControllers_2.getIndex);
    router.get("/profile", authMiddleware_1.authMiddleware, authControllers_2.getProfile);
    router.get("/login", authControllers_2.getLogin);
    router.get("/account", authMiddleware_1.authMiddleware, authControllers_2.getAccount);
};
