import mongoose from "mongoose";

const PaletteSchema = new mongoose.Schema(
  {
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
      type: [
        {
          hsl: { type: String },
          oklch: { type: String },
        },
      ],
      validate: [
        (val: { hsl: String, oklch: String }[]) => val.length <= 5,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    private: { type: Boolean, default: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Usuarios que han dado like
  },
  { timestamps: true } // Añade createdAt y updatedAt automáticamente
);

export const Palette = mongoose.model("Palette", PaletteSchema);
