const mongoose = require("mongoose");

const Esquema = mongoose.Schema;

const opcionesDeEsquema = {
  collection: "Config",
};

const EsquemaOpcion = new Esquema(
  {
    array: [String],
    campo: { type: String, required: true },
    coleccion: { type: String, required: true },
  },
  opcionesDeEsquema
);

module.exports = mongoose.model("Config", EsquemaOpcion);
