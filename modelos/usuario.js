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
    activo: { type: Boolean, default: true },
    apellido: { type: String, required: true },
    cedula: { type: String, required: true },
    clave: { type: String, required: true },
    comuna: new Esquema({
      _id: { type: Esquema.Types.ObjectId },
      nombre: { type: String },
      situr: { type: String },
      tipo: { type: String },
    }),
    email: { type: String, required: true },
    nombre: { type: String, required: true },
    rol: { type: String, required: true },
    tlf: { type: String, required: true },
    usuario: { type: String, required: true },
  },
  opcionesDeEsquema
);

EsquemaUsuario.plugin(mongoosePaginate);

module.exports = mongoose.model("USUARIO", EsquemaUsuario);
