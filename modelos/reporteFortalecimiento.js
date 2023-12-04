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
      etapa: { type: String, required: true },
      tipo: { type: String, required: true },
    },
    { _id: false }
  ),
});

module.exports = ReporteBase.discriminator(
  "fortalecimiento",
  ReporteFortalecimiento
);
