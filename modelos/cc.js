const mongoose = require("mongoose");

const Esquema = mongoose.Schema;

const EsquemaCC = new Esquema({
  comuna: { type: String },
  estados: { type: String, required: true },
  estaRenovado: { type: Boolean, default: false },
  estaVigente: { type: Boolean, default: false },
  localidad: { type: String, required: true },
  municipios: { type: String, required: true },
  nombre: { type: String, required: true },
  parroquias: { type: String, required: true },
  redi: { type: String, default: "ORIENTAL", required: true },
  situr: { type: String, required: true, unique: true },
  tipo: { type: String, default: "URBANO", required: true },
});

module.exports = mongoose.model("CC", EsquemaCC);
