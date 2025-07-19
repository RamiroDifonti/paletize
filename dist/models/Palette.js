"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Palette = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PaletteSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    colorModel: {
        type: String,
        enum: ['hsl', 'oklch'],
        required: true
    },
    brandColor: {
        type: String,
        required: true,
    },
    colorScheme: {
        type: String,
        enum: [
            "analogous",
            "complementary",
            "triad",
            "split-complementary",
            "square"
        ],
        required: true,
    },
    colors: {
        type: [String],
        validate: [
            (val) => val.length <= 5,
            "Debe contener como máximo 5 colores",
        ],
        required: true,
    },
    firstContrast: {
        type: String,
        enum: ['increase', 'decrease'],
        default: 'decrease',
        required: true,
    },
    secondContrast: {
        type: String,
        enum: ['increase', 'decrease'],
        default: 'decrease',
        required: true,
    },
    wcagLevel: {
        type: String,
        enum: ['aa', 'aaa'],
        required: true,
    },
    colorSeparation: {
        type: Number,
        required: true,
    },
    creator: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    private: { type: Boolean, default: true },
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }], // Usuarios que han dado like
}, { timestamps: true } // Añade createdAt y updatedAt automáticamente
);
exports.Palette = mongoose_1.default.model("Palette", PaletteSchema);
