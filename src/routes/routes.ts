import express from 'express';

import authRoutes from './authRoutes';
import paletteRoutes from './paletteRoutes';

const router = express.Router();

export default (): express.Router => {
    authRoutes(router);
    paletteRoutes(router);
    return router;
};