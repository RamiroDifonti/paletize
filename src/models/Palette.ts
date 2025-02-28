import mongoose from "mongoose";

const PaletteSchema = new mongoose.Schema(
  {
    colors: {
      type: [
        {
          hsl: { type: String, required: true }, // Ejemplo: "hsl(300, 67.60%, 20.60%)"
          rgb: { type: String, required: true }, // Ejemplo: "rgb(49, 197, 30)"
        },
      ],
      validate: [
        (val: { hsl: string; rgb: string }[]) => val.length === 2 || val.length === 3 || val.length === 5,
        "Debe contener 2, 3 o 5 colores",
      ],
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
