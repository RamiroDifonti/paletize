import express from 'express';
import { createPalette,  publicPalettes, userPalettes, likePalette} from '../controllers/paletteControllers';

export default (router: express.Router) => {
    router.post("palette/create", createPalette);
    router.get("palette/public", publicPalettes);
    router.get("palette/user", userPalettes);
    router.post("palette/like/:paletteId", likePalette);
};
