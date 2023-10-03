const mongoose = require("mongoose");
const ReporteBase = require("./reporte");

const Esquema = mongoose.Schema;

const ReporteCasoAdmin = new Esquema({
  caso: { type: String, required: true },
  tipo: { type: Number, required: true },
});

module.exports = ReporteBase.discriminator(
  "CASO ADMINISTRATIVO",
  ReporteCasoAdmin
);
