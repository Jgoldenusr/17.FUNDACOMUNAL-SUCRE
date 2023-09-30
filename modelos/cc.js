const mongoose = require("mongoose");

const Esquema = mongoose.Schema;

const EsquemaCC = new Esquema({
  tipo: {
    type: String,
    required: true,
    enum: ["INDIGENA", "MIXTO", "RURAL", "URBANO"],
    default: "URBANO",
  },
  redi: {
    type: String,
    required: true,
    enum: [
      "ANDES",
      "CAPITAL",
      "CENTRAL",
      "GUAYANA",
      "INSULAR",
      "LLANOS",
      "OCCIDENTAL",
      "ORIENTAL",
    ],
    default: "ORIENTAL",
  },
  estados: { type: String, required: true, maxLength: 30, uppercase: true },
  municipios: {
    type: String,
    required: true,
    maxLength: 30,
    uppercase: true,
  },
  parroquias: {
    type: String,
    required: true,
    maxLength: 30,
    uppercase: true,
  },
  localidad: { type: String, required: true, maxLength: 50, uppercase: true },
  nombre: { type: String, required: true, maxLength: 50, uppercase: true },
  situr: { type: String, required: true, maxLength: 50, unique: true },
});

module.exports = mongoose.model("CC", EsquemaCC);
