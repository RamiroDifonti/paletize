import express from 'express';
import { login, register, protectedSession, logout, defaultController, getIndex, getLogin } from '../controllers/authControllers'
import { authMiddleware } from '../middlewares/authMiddleware';

export default (router: express.Router) => {
    router.post("/register", register);
    router.post("/logout", logout);
    router.post("/login", login);
    router.get("/protected", authMiddleware, protectedSession);
    router.get("/", authMiddleware, defaultController);
    router.get("/login.html", getLogin);
    router.get("/index.html", getIndex);

};


