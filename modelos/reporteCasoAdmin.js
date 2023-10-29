const mongoose = require("mongoose");
const ReporteBase = require("./reporte");

const Esquema = mongoose.Schema;

const ReporteCasoAdmin = new Esquema({
  caso: { type: String, required: true },
  tipoCaso: { type: String, required: true },
});

module.exports = ReporteBase.discriminator("casoadmin", ReporteCasoAdmin);
