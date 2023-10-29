const mongoose = require("mongoose");
const ReporteBase = require("./reporte");

const Esquema = mongoose.Schema;

const ReporteInterno = new Esquema({
  condicionVoceria: { type: String, required: true },
  estaEnSistema: { type: Boolean, default: false },
  estaRenovado: { type: Boolean, default: false },
  estaRegistrado: { type: Boolean, default: false },
  fechaVencimiento: { type: Date, default: Date.now() },
});

module.exports = ReporteBase.discriminator("interno", ReporteInterno);
