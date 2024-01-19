const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { DateTime } = require("luxon");

const Esquema = mongoose.Schema;

const opcionesDeEsquema = {
  collection: "Reportes",
  discriminatorKey: "tipo",
  id: false,
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
  return DateTime.fromJSDate(this.fecha).setZone("UTC").toFormat("dd/MM/yyyy");
});

EsquemaReporte.plugin(mongoosePaginate);

module.exports = mongoose.model("REPORTE", EsquemaReporte);
