import express from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const token = req.cookies.sessionToken;
    req.user = null;
    console.log(token);
    if (!token) {
        res.redirect("/login.html");
        return;
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = user;
        next();
    } catch (error) {
        res.redirect("/login.html");
        return;
    }
};
