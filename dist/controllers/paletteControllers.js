"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPalette = exports.loadPalette = exports.getPalette = exports.likePalette = exports.userPalettes = exports.publicPalettes = exports.updatePalette = exports.createPalette = void 0;
const Palette_1 = require("../models/Palette");
const path_1 = __importDefault(require("path"));
const createPalette = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, colors, private: isPrivate, colorModel, // Modelo de color (hsl o oklch)
        brandColor, // Color de marca
        colorScheme, // Esquema cromático
        firstContrast, // Primer contraste (aumentar o disminuir)
        secondContrast, // Segundo contraste (aumentar o disminuir)
        wcagLevel, // Nivel WCAG (AA o AAA)
        colorSeparation, // Separación de colores
         } = req.body;
        // Verificación de campos obligatorios
        if (!name || !colors || !colorModel || !wcagLevel
            || colorSeparation === undefined || !brandColor || !colorScheme) {
            res.status(400).json({ message: "Faltan campos obligatorios" });
            return;
        }
        const creator = req.user.id;
        const palette = new Palette_1.Palette({
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
        const newPalette = yield palette.save();
        // Enviar la respuesta con el nuevo objeto de paleta creado
        res.status(201).json(newPalette);
        return;
    }
    catch (e) {
        res.status(500).json(e);
        return;
    }
});
exports.createPalette = createPalette;
const updatePalette = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paletteId } = req.params; // Recupera el ID de la URL
        const { name, colors, private: isPrivate, colorModel, // Modelo de color (hsl o oklch)
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
        const palette = yield Palette_1.Palette.findById(paletteId);
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
        const updatedPalette = yield palette.save();
        // Respondemos con la paleta actualizada
        res.status(200).json(updatedPalette);
    }
    catch (error) {
        console.error('Error al actualizar la paleta:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.updatePalette = updatePalette;
const publicPalettes = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const palettes = yield Palette_1.Palette.find({ private: false }).populate("creator", "username");
        res.json(palettes);
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Internal error" });
        return;
    }
});
exports.publicPalettes = publicPalettes;
const userPalettes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const palettes = yield Palette_1.Palette.find({ creator: userId }).populate("creator", "username");
        res.json(palettes);
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener tus paletas" });
        return;
    }
});
exports.userPalettes = userPalettes;
const likePalette = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paletteId } = req.params;
        const palette = yield Palette_1.Palette.findById(paletteId);
        if (!palette) {
            res.status(404).json({ message: "Paleta no encontrada" });
            return;
        }
        if (palette.likes.includes(req.user.id)) {
            // Quitar el like del usuario
            palette.likes = palette.likes.filter((like) => !like.equals(req.user.id));
            yield palette.save();
            return;
        }
        palette.likes.push(req.user.id);
        yield palette.save();
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Error al dar like" });
        return;
    }
});
exports.likePalette = likePalette;
const getPalette = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, "../../client/content/palette.html"));
    return;
});
exports.getPalette = getPalette;
const loadPalette = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const palette = yield Palette_1.Palette.findById(id).populate('creator', 'username');
        if (!palette) {
            res.status(404).json({ message: 'Paleta no encontrada' });
            return;
        }
        res.json(palette);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
        return;
    }
});
exports.loadPalette = loadPalette;
const searchPalette = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ message: "El nombre es requerido" });
            return;
        }
        const palettes = yield Palette_1.Palette.find({
            name: { $regex: new RegExp(name, 'i') }
        }).populate('creator', 'username');
        res.json(palettes);
    }
    catch (error) {
        console.error("Error en búsqueda:", error);
        res.status(500).json({ message: "Error al buscar la paleta" });
    }
});
exports.searchPalette = searchPalette;
