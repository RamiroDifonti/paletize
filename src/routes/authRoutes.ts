import express from 'express';
import { login, register, protectedSession, logout } from '../controllers/authControllers'

export default (router: express.Router) => {
    router.post("/register", register);
    router.post("/login", login);
    router.get("/protected", protectedSession);
    router.post("/logout", logout);
};


