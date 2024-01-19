const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Esquema = mongoose.Schema;

const opcionesDeEsquema = {
  collection: "Usuarios",
  id: false,
  timestamps: true,
};

const EsquemaUsuario = new Esquema(
  {
    apellido: { type: String, required: true },
    cedula: { type: String, required: true, unique: true },
    clave: { type: String, required: true },
    email: { type: String, required: true },
    nombre: { type: String, required: true },
    rol: { type: String, required: true },
    tlf: { type: String, required: true },
    usuario: { type: String, required: true, unique: true },
    cc: [
      new Esquema({
        _id: { type: Esquema.Types.ObjectId },
        localidad: { type: String },
        nombre: { type: String },
        situr: { type: String },
        tipo: { type: String },
      }),
    ],
  },
  opcionesDeEsquema
);

EsquemaUsuario.plugin(mongoosePaginate);

module.exports = mongoose.model("USUARIO", EsquemaUsuario);
