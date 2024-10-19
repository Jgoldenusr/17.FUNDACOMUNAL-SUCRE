const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { DateTime } = require("luxon");

const Esquema = mongoose.Schema;

const opcionesDeEsquema = {
  collection: "CCS",
  id: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
};

const EsquemaCC = new Esquema(
  {
    activo: { type: Boolean, default: true },
    comuna: { type: String, default: "" },
    estados: { type: String, required: true },
    renovado: new Esquema(
      {
        desde: { type: Date, required: true },
        hasta: { type: Date, required: true },
        idReporte: { type: Esquema.Types.ObjectId, required: true },
      },
      { _id: false }
    ),
    vigente: new Esquema(
      {
        desde: { type: Date, required: true },
        hasta: { type: Date, required: true },
        idReporte: { type: Esquema.Types.ObjectId, required: true },
      },
      { _id: false }
    ),
    localidad: { type: String, required: true },
    municipios: { type: String, required: true },
    nombre: { type: String, required: true },
    parroquias: { type: String, required: true },
    redi: { type: String, required: true },
    situr: { type: String, required: true},
    tipo: { type: String, required: true },
    usuario: new Esquema({
      apellido: { type: String },
      cedula: { type: String },
      _id: { type: Esquema.Types.ObjectId },
      nombre: { type: String },
      rol: { type: String },
    }),
  },
  opcionesDeEsquema
);

EsquemaCC.virtual("estaRenovado")
  .get(function () {
    let estaRenovado = false;
    if (this.renovado) {
      if (
        DateTime.now() < DateTime.fromJSDate(this.renovado.hasta).setZone("UTC")
      ) {
        estaRenovado = {
          desde: DateTime.fromJSDate(this.renovado.desde)
            .setZone("UTC")
            .toFormat("dd/MM/yyyy"),
          hasta: DateTime.fromJSDate(this.renovado.hasta)
            .setZone("UTC")
            .toFormat("dd/MM/yyyy"),
          idReporte: this.renovado.idReporte,
          vencido: false,
        };
      } else {
        estaRenovado = {
          desde: DateTime.fromJSDate(this.renovado.desde)
            .setZone("UTC")
            .toFormat("dd/MM/yyyy"),
          hasta: DateTime.fromJSDate(this.renovado.hasta)
            .setZone("UTC")
            .toFormat("dd/MM/yyyy"),
          idReporte: this.renovado.idReporte,
          vencido: true,
        };
      }
    }
    return estaRenovado;
  })
  .set(function (valor) {
    let estaRenovado = {};
    estaRenovado.desde = valor.desde;
    estaRenovado.hasta = DateTime.fromISO(valor.desde)
      .plus({
        years: 3,
      })
      .toJSDate();
    estaRenovado.idReporte = valor.idReporte;
    this.set({ renovado: estaRenovado });
  });

EsquemaCC.virtual("estaVigente")
  .get(function () {
    let estaVigente = false;
    if (this.vigente) {
      if (DateTime.now() < DateTime.fromJSDate(this.vigente.hasta)) {
        estaVigente = {
          desde: DateTime.fromJSDate(this.vigente.desde)
            .setZone("UTC")
            .toFormat("dd/MM/yyyy"),
          hasta: DateTime.fromJSDate(this.vigente.hasta)
            .setZone("UTC")
            .toFormat("dd/MM/yyyy"),
          idReporte: this.vigente.idReporte,
          vencido: false,
        };
      } else {
        estaVigente = {
          desde: DateTime.fromJSDate(this.vigente.desde)
            .setZone("UTC")
            .toFormat("dd/MM/yyyy"),
          hasta: DateTime.fromJSDate(this.vigente.hasta)
            .setZone("UTC")
            .toFormat("dd/MM/yyyy"),
          idReporte: this.vigente.idReporte,
          vencido: true,
        };
      }
    }
    return estaVigente;
  })
  .set(function (valor) {
    let estaVigente = {};
    estaVigente.desde = valor.desde;
    estaVigente.hasta = DateTime.fromISO(valor.desde)
      .plus({
        years: 3,
      })
      .toJSDate();
    estaVigente.idReporte = valor.idReporte;
    this.set({ vigente: estaVigente });
  });

EsquemaCC.plugin(mongoosePaginate);

module.exports = mongoose.model("CC", EsquemaCC);
