const mongoose = require("mongoose");

const Esquema = mongoose.Schema;

const EsquemaPromotor = new Esquema({
  cedula: { type: Number, required: true, min: 1, unique: true },
  nombre: { type: String, required: true, maxLength: 30, uppercase: true },
  apellido: { type: String, required: true, maxLength: 30, uppercase: true },
  tlf: { type: String, required: true, maxLength: 30 },
  email: { type: String, required: true, maxLength: 50 },
});

module.exports = mongoose.model("Promotor", EsquemaPromotor);
