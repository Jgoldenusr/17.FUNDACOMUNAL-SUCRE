const mongoose = require("mongoose");

const Esquema = mongoose.Schema;

const EsquemaReporte = new Esquema({
  fecha: { type: Date, default: Date.now },
  promotor: { type: Esquema.Types.ObjectId, ref: "Promotor", required: true },
  cc: { type: Esquema.Types.ObjectId, ref: "CC", required: true },
  cedula: { type: Number, required: true, min: 1 },
  situr: { type: String, required: true, maxLength: 50 },
  tipo: {
    type: String,
    required: true,
    default: "PARTICIPACION",
    enum: ["PARTICIPACION"],
  },
  acompanamiento: {
    type: String,
    required: true,
    default: "ASAMBLEAS INFORMATIVAS PARA LA CONFORMACION DEL CONSEJO COMUNAL",
    enum: [
      "ASAMBLEAS INFORMATIVAS PARA LA CONFORMACION DEL CONSEJO COMUNAL",
      "ASAMBLEAS PARA LA ESCOGENCIA DE LA COMISION ELECTORAL PERMANENTE",
      "PROCESO DE POSTULACION DE LAS VOCERIAS DEL CONSEJO COMUNAL",
      "PROCESO DE ELECCIONES DE VOCERIAS",
      "ASAMBLEA INFORMATIVA DEL EQUIPO PROMOTOR PROVISIONAL",
      "ELABORACION MAPA DE PROBLEMAS Y SOLUCIONES",
      "ASAMBLEA DE RENDICION DE CUENTA",
      "JURAMENTACION DE VOCERIAS ELECTAS",
      "ELABORACION DE PLAN DE DESARROLLO INTEGRAL COMUNITARIO O PLAN PATRIA COMUNAL",
      "ELECCIONES DE COMISIONES PROVISIONALES DE COMUNAS",
      "PROCESO DEL REFERENDUM DE CARTAS FUNDACIONALES",
      "MESA DE TRABAJO DE ALGUN COMITE",
      "ELABORACION DE LA AGENDA CONCRETA DE ACCION",
    ],
  },
  organosAdscritos: {
    type: String,
    required: true,
    default: "FUNDACOMUNAL",
    maxLength: 30,
    uppercase: true,
  },
  familiasBeneficiadas: { type: Number, required: true, min: 1 },
});

module.exports = mongoose.model("Reporte", EsquemaReporte);
