const express = require("express");
const enrutador = express.Router();
const controlador = require("../controladores/controladorConfig");
const permisos = require("../config/permisos");

enrutador.use(permisos.autenticarToken);

enrutador.use(permisos.autorizarRol);

enrutador.delete("/:id", controlador.borrarOpcion);

enrutador.get("/", controlador.listarOpciones);

enrutador.get("/:id", controlador.buscarOpcion);

enrutador.post("/", controlador.nuevaOpcion);

enrutador.put("/:id", controlador.actualizarOpcion);

module.exports = enrutador;
