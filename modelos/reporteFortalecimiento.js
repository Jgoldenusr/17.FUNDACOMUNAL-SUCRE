const mongoose = require("mongoose");
const ReporteBase = require("./reporte");

const Esquema = mongoose.Schema;

const ReporteFortalecimiento = new Esquema({
  acompanamiento: { type: String, required: true },
  nombreOSP: { type: String, required: true },
  tipoActividad: { type: String, required: true },
  tipoOSP: { type: String, required: true },
  proyectoCFG: new Esquema(
    {
      etapa: { type: string },
      tipo: { type: string },
    },
    { _id: false }
  ),
});

module.exports = ReporteBase.discriminator(
  "FORTALECIMIENTO",
  ReporteFortalecimiento
);
