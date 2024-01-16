const mongoose = require("mongoose");
const ReporteBase = require("./reporte");

const Esquema = mongoose.Schema;

const ReporteComunicaciones = new Esquema({
  prensa: new Esquema(
    {
      notas: { type: String },
      resenas: { type: String },
    },
    { _id: false }
  ),
  redes: [
    new Esquema(
      {
        cuenta: { type: String },
        publicaciones: { type: String },
      },
      { _id: false }
    ),
  ],
});

module.exports = ReporteBase.discriminator(
  "comunicaciones",
  ReporteComunicaciones
);
