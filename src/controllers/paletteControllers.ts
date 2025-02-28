import express from 'express';

import { Palette } from "../models/Palette";

export const createPalette = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { colors, private: isPrivate } = req.body;
        const creator = req.user._id;
        const palette = new Palette({
            colors,
            creator,
            private: isPrivate
        });
        const newPalette = await palette.save();
        res.status(201).json(newPalette);
        return;
    } catch (e) {
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}

export const publicPalettes = async (_req: express.Request, res: express.Response): Promise<void> => {
    try {
        const palettes = await Palette.find({ private: false }).populate("creator", "username");
        res.json(palettes);
        return;
    } catch (error) {
        res.status(500).json({ message: "Error al obtener paletas" });
        return;
    }
};

export const userPalettes = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const userId = req.user._id;
        const palettes = await Palette.find({ creator: userId });
        res.json(palettes);
        return;
    } catch (error) {
        res.status(500).json({ message: "Error al obtener tus paletas" });
        return;
    }
};

export const likePalette = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { paletteId } = req.params;
        const palette = await Palette.findById(paletteId);
        if (!palette) {
            res.status(404).json({ message: "Paleta no encontrada" });
            return;
        }
        if (palette.likes.includes(req.user.id)) {
            res.status(400).json({ message: "Ya diste like a esta paleta" });
            return;
        }
        palette.likes.push(req.user._id);
        await palette.save();
        const numberLikes = palette.likes.length;
        res.json({ likes: numberLikes });
        return;
    } catch (error) {
        res.status(500).json({ message: "Error al dar like" });
        return;
    }
};
  
  