const mongoose = require("mongoose");
const ReporteBase = require("./reporte");

const Esquema = mongoose.Schema;

const ReporteParticipacion = new Esquema({
  acompanamiento: { type: String, required: true },
  familiasBeneficiadas: { type: Number, required: true },
});

module.exports = ReporteBase.discriminator(
  "PARTICIPACION",
  ReporteParticipacion
);
