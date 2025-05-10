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

export const updatePalette = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const { paletteId } = req.params; // Recupera el ID de la URL
        const {
            name,
            colors,
            private: isPrivate,
            colorModel, // Modelo de color (hsl o oklch)
            brandColor, // Color de marca
            colorScheme, // Esquema cromático
            firstContrast, // Primer contraste
            secondContrast, // Segundo contraste
            wcagLevel, // Nivel WCAG
            colorSeparation, // Separación de colores
        } = req.body;

        // Verificación de campos obligatorios
        if (!name || !colors || !colorModel || !wcagLevel || colorSeparation === undefined || !brandColor || !colorScheme) {
            res.status(400).json({ message: "Faltan campos obligatorios" });
            return;
        }

        // Verificamos si la paleta existe  
        const palette = await Palette.findById(paletteId);
        if (!palette) {
            res.status(404).json({ message: 'Paleta no encontrada' });
            return;
        }

        // Actualizamos los campos de la paleta
        palette.name = name;
        palette.colors = colors;
        palette.private = isPrivate;
        palette.colorModel = colorModel;
        palette.brandColor = brandColor;
        palette.colorScheme = colorScheme;
        palette.firstContrast = firstContrast;
        palette.secondContrast = secondContrast;
        palette.wcagLevel = wcagLevel;
        palette.colorSeparation = colorSeparation;

        // Guardamos la paleta actualizada
        const updatedPalette = await palette.save();

        // Respondemos con la paleta actualizada
        res.status(200).json(updatedPalette);
    } catch (error) {
        console.error('Error al actualizar la paleta:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

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
        const userId = req.user.id;
        const palettes = await Palette.find({ creator: userId }).populate("creator", "username");
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
  
  