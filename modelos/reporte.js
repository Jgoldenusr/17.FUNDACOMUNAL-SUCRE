const mongoose = require("mongoose");

const Esquema = mongoose.Schema;

const opcionesDeEsquema = {
  collection: "Reportes",
  discriminatorKey: "tipo",
  timestamps: true,
};

const EsquemaReporte = new Esquema(
  {
    cc: { type: Esquema.Types.ObjectId, ref: "CC", required: true },
    usuario: { type: Esquema.Types.ObjectId, ref: "USUARIO", required: true },
    fecha: { type: Date, default: Date.now() },
    organosAdscritos: { type: String, required: true },
  },
  opcionesDeEsquema
);

module.exports = mongoose.model("REPORTE", EsquemaReporte);
