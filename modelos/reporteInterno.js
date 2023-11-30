const mongoose = require("mongoose");
const ReporteBase = require("./reporte");
const { DateTime } = require("luxon");

const Esquema = mongoose.Schema;

const ReporteInterno = new Esquema({
  fechaRegistro: { type: Date, required: true },
  organosAdscritos: { type: String }, //Opcional ahora
});

ReporteInterno.virtual("fechaRegistroConFormato").get(function () {
  return DateTime.fromJSDate(this.fechaRegistro).toFormat("dd/MM/yyyy");
});

module.exports = ReporteBase.discriminator("interno", ReporteInterno);
