const mongoose = require("mongoose");

const Esquema = mongoose.Schema;

const EsquemaUsuario = new Esquema({
  apellido: { type: String, required: true },
  cedula: { type: Number, required: true, unique: true },
  clave: { type: String, required: true },
  email: { type: String, required: true },
  nombre: { type: String, required: true },
  rol: { type: String, default: "PROMOTOR", required: true },
  tlf: { type: String, required: true },
  usuario: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Usuario", EsquemaUsuario);
