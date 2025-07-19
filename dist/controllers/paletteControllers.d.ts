import express from 'express';
export declare const createPalette: (req: express.Request, res: express.Response) => Promise<void>;
export declare const updatePalette: (req: express.Request, res: express.Response) => Promise<void>;
export declare const publicPalettes: (_req: express.Request, res: express.Response) => Promise<void>;
export declare const userPalettes: (req: express.Request, res: express.Response) => Promise<void>;
export declare const likePalette: (req: express.Request, res: express.Response) => Promise<void>;
export declare const getPalette: (_req: express.Request, res: express.Response) => Promise<void>;
export declare const loadPalette: (req: express.Request, res: express.Response) => Promise<void>;
export declare const searchPalette: (req: express.Request, res: express.Response) => Promise<void>;
//# sourceMappingURL=paletteControllers.d.ts.map