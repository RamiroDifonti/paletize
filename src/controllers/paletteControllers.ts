import express from 'express';

import { Palette } from "../models/Palette";

export const createPalette = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const {
            name,
            colors,
            private: isPrivate,
            colorModel, // Modelo de color (hsl o oklch)
            brandColor, // Color de marca
            colorScheme, // Esquema cromático
            firstContrast, // Primer contraste (aumentar o disminuir)
            secondContrast, // Segundo contraste (aumentar o disminuir)
            wcagLevel, // Nivel WCAG (AA o AAA)
            colorSeparation, // Separación de colores
        } = req.body;
        // Verificación de campos obligatorios
        if (!name || !colors || !colorModel || !wcagLevel || colorSeparation === undefined || !brandColor || !colorScheme) {
            res.status(400).json({ message: "Faltan campos obligatorios" });
            return;
        }
        const creator = req.user.id;
        const palette = new Palette({
            name,
            colorModel,
            brandColor,
            colorScheme,
            colors,
            firstContrast,
            secondContrast,
            wcagLevel,
            colorSeparation,
            creator,
            private: isPrivate,
            likes: [],
        });
        // Guardar la nueva paleta en la base de datos
        const newPalette = await palette.save();
        // Enviar la respuesta con el nuevo objeto de paleta creado
        res.status(201).json(newPalette);
        return;
    } catch (e) {
        res.status(500).json(e);
        return;
    }
}

export const publicPalettes = async (_req: express.Request, res: express.Response): Promise<void> => {
    try {
        const palettes = await Palette.find({ private: false }).populate("creator", "username");
        res.json(palettes);
        return;
    } catch (error) {
        res.status(500).json({ message: "Internal error" });
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
  
  