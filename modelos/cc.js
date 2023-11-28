const mongoose = require("mongoose");

const Esquema = mongoose.Schema;

const opcionesDeEsquema = {
  collection: "CCS",
  timestamps: true,
};

const EsquemaCC = new Esquema(
  {
    comuna: { type: String },
    estados: { type: String, required: true },
    estaRenovado: { type: Date },
    estaVigente: { type: Date },
    localidad: { type: String, required: true },
    municipios: { type: String, required: true },
    nombre: { type: String, required: true },
    parroquias: { type: String, required: true },
    redi: { type: String, required: true },
    situr: { type: String, required: true, unique: true },
    tipo: { type: String, required: true },
    usuario: new Esquema({
      apellido: { type: String },
      cedula: { type: Number },
      _id: { type: Esquema.Types.ObjectId },
      nombre: { type: String },
      rol: { type: String },
    }),
  },
  opcionesDeEsquema
);

module.exports = mongoose.model("CC", EsquemaCC);
