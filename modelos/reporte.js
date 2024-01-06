const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Esquema = mongoose.Schema;

const opcionesDeEsquema = {
  collection: "Reportes",
  discriminatorKey: "tipo",
  timestamps: true,
  toJSON: { virtuals: true },
};

const EsquemaReporte = new Esquema(
  {
    cc: { type: Esquema.Types.ObjectId, ref: "CC", required: true },
    usuario: { type: Esquema.Types.ObjectId, ref: "USUARIO", required: true },
    fecha: { type: Date, default: new Date() },
    organosAdscritos: { type: String, required: true },
  },
  opcionesDeEsquema
);

EsquemaReporte.virtual("fechaConFormato").get(function () {
  return DateTime.fromJSDate(this.fecha).setZone("utc").toFormat("dd/MM/yyyy");
});

module.exports = mongoose.model("REPORTE", EsquemaReporte);
