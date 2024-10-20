const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Esquema = mongoose.Schema;

const opcionesDeEsquema = {
  collection: "Comunas",
  id: false,
  timestamps: true,
};

const EsquemaComuna = new Esquema(
  {
    activo: { type: Boolean, default: true },
    cc: [
      new Esquema({
        _id: { type: Esquema.Types.ObjectId },
        localidad: { type: String },
        nombre: { type: String },
        situr: { type: String },
        tipo: { type: String },
      }),
    ],
    estados: { type: String, required: true },
    municipios: { type: String, required: true },
    nombre: { type: String, required: true },
    parroquias: { type: String, required: true },
    situr: { type: String, required: true },
    tipo: { type: String, required: true },
    usuario: new Esquema({
      apellido: { type: String },
      cedula: { type: String },
      _id: { type: Esquema.Types.ObjectId },
      nombre: { type: String },
      rol: { type: String },
    }),
  },
  opcionesDeEsquema
);

EsquemaComuna.plugin(mongoosePaginate);

module.exports = mongoose.model("COMUNA", EsquemaComuna);
