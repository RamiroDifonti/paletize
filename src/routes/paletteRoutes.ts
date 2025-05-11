import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createPalette,  publicPalettes, userPalettes, likePalette, updatePalette, loadPalette, getPalette, searchPalette} from '../controllers/paletteControllers';

export default (router: express.Router) => {
    router.post("/api/palette/create", authMiddleware, createPalette);
    router.get("/api/palette/public", publicPalettes);
    router.get("/api/palette/user", authMiddleware, userPalettes);
    router.post("/api/palette/like/:paletteId", authMiddleware, likePalette);
    router.put("/api/palette/update/:paletteId", authMiddleware, updatePalette);
    router.get("/api/palette/:id", authMiddleware, loadPalette);
    router.post("/api/palette/search", searchPalette);

    router.get("/palette", authMiddleware, getPalette);
    router.get("/palette/:id", authMiddleware, getPalette);
};
