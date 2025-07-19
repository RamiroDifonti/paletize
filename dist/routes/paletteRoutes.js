"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = require("../middlewares/authMiddleware");
const paletteControllers_1 = require("../controllers/paletteControllers");
exports.default = (router) => {
    router.post("/api/palette/create", authMiddleware_1.authMiddleware, paletteControllers_1.createPalette);
    router.get("/api/palette/public", paletteControllers_1.publicPalettes);
    router.get("/api/palette/user", authMiddleware_1.authMiddleware, paletteControllers_1.userPalettes);
    router.post("/api/palette/like/:paletteId", authMiddleware_1.authMiddleware, paletteControllers_1.likePalette);
    router.put("/api/palette/update/:paletteId", authMiddleware_1.authMiddleware, paletteControllers_1.updatePalette);
    router.get("/api/palette/:id", authMiddleware_1.authMiddleware, paletteControllers_1.loadPalette);
    router.post("/api/palette/search", paletteControllers_1.searchPalette);
    router.get("/palette", authMiddleware_1.authMiddleware, paletteControllers_1.getPalette);
    router.get("/palette/:id", authMiddleware_1.authMiddleware, paletteControllers_1.getPalette);
};
