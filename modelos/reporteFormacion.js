const mongoose = require("mongoose");
const ReporteBase = require("./reporte");

const Esquema = mongoose.Schema;

const ReporteFormacion = new Esquema({
  beneficiados: new Esquema(
    {
      hombres: { type: String, required: true },
      mujeres: { type: String, required: true },
    },
    { _id: false }
  ),
  estrategia: { type: String, required: true },
  modalidad: { type: String, required: true },
  tematica: { type: String, required: true },
  verificacion: { type: String, required: true },
});

module.exports = ReporteBase.discriminator("formacion", ReporteFormacion);
