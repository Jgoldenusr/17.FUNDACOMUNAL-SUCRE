const mongoose = require("mongoose");
const ReporteBase = require("./reporte");

const Esquema = mongoose.Schema;

const ReporteIncidencias = new Esquema({
  areaSustantiva: { type: String, required: true },
  tipo: { type: String, required: true },
});

module.exports = ReporteBase.discriminator("INCIDENCIAS", ReporteIncidencias);
