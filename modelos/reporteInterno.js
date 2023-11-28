const mongoose = require("mongoose");
const ReporteBase = require("./reporte");

const Esquema = mongoose.Schema;

const ReporteInterno = new Esquema({
  fechaRegistro: { type: Date, default: Date.now() },
});

module.exports = ReporteBase.discriminator("interno", ReporteInterno);
