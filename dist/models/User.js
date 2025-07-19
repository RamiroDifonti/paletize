"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    // SI HAY TIEMPO METER FOTO DE PERFIL Y VERIFICACIÓN DE EMAIL
    // isVerified: { type: Boolean, default: false },
    // profilePicture: { type: String, default: "default-avatar.png" },
    authentication: {
        password: { type: String, required: true, select: false }, // No se devuelve cuando se busca en un controlador
        salt: { type: String, select: false }
    },
    savedPalettes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Palette' }]
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', UserSchema);
