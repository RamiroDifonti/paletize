import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createPalette,  publicPalettes, userPalettes, likePalette, updatePalette} from '../controllers/paletteControllers';

export default (router: express.Router) => {
    router.post("/api/palette/create", authMiddleware, createPalette);
    router.get("/api/palette/public", publicPalettes);
    router.get("/api/palette/user", authMiddleware, userPalettes);
    router.post("/api/palette/like/:paletteId", authMiddleware, likePalette);
    router.put("/api/palette/update/:paletteId", authMiddleware, updatePalette);
};
