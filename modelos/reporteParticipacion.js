const mongoose = require("mongoose");
const ReporteBase = require("./reporte");

const Esquema = mongoose.Schema;

const ReporteParticipacion = new Esquema({
  acompanamiento: { type: String, required: true },
  familiasBeneficiadas: { type: String, required: true },
});

module.exports = ReporteBase.discriminator(
  "participacion",
  ReporteParticipacion
);
