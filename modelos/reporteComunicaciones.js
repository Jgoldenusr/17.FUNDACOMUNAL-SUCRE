const mongoose = require("mongoose");
const ReporteBase = require("./reporte");

const Esquema = mongoose.Schema;

const ReporteComunicaciones = new Esquema({
  prensa: new Esquema(
    {
      notas: { type: Number },
      resenas: { type: Number },
    },
    { _id: false }
  ),
  redes: [
    new Esquema(
      {
        cuenta: { type: String },
        publicaciones: { type: Number },
      },
      { _id: false }
    ),
  ],
});

module.exports = ReporteBase.discriminator(
  "COMUNICACIONES",
  ReporteComunicaciones
);
