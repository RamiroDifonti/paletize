import express from 'express';
import { login, register, protectedSession, logout, defaultController } from '../controllers/authControllers'
import { authMiddleware } from '../middlewares/authMiddleware';

export default (router: express.Router) => {
    router.post("/register", register);
    router.post("/logout", logout);
    router.post("/login", login);
    router.use(authMiddleware);
    router.get("/protected", protectedSession);
    router.get("/", defaultController);
};


