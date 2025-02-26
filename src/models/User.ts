import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
        password: { type: String, required: true, select: false },  // No se devuelve cuando se busca en un controlador
        salt: { type: String, select: false }
    },
    savedPalettes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Palette' }]
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);