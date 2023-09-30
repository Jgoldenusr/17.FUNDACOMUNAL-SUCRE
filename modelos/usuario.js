const mongoose = require("mongoose");

const Esquema = mongoose.Schema;

const EsquemaUsuario = new Esquema({
  usuario: { type: String, required: true, maxLength: 30, unique: true },
  clave: { type: String, required: true },
  esAdmin: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model("Usuario", EsquemaUsuario);
