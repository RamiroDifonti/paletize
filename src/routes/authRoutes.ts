import express from 'express';
import { login, register, protectedSession, logout, apiProfile, changeEmail, changePassword, updateProfile } from '../controllers/authControllers'
import { getIndex, getProfile, getLogin } from '../controllers/authControllers';
import { authMiddleware } from '../middlewares/authMiddleware';

export default (router: express.Router) => {
    // Rutas para la api
    router.post("/api/register", register);
    router.post("/api/logout", logout);
    router.post("/api/login", login);
    router.get("/api/protected", authMiddleware, protectedSession);
    router.get("/api/profile", authMiddleware, apiProfile);
    router.post("/api/account/profile", authMiddleware, updateProfile);
    router.post("/api/account/email", authMiddleware, changeEmail);
    router.post("/api/account/password", authMiddleware, changePassword);
    // Rutas para el cliente
    router.get("/", getIndex);
    router.get("/profile", authMiddleware, getProfile);
    router.get("/login", getLogin);
};


