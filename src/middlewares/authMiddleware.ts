import express from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req: express.Request, _res: express.Response, next: express.NextFunction): Promise<void> => {
    const token = req.cookies.sessionToken;
    req.user = null;

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = user;

    } catch (error) { }
    next();
};
