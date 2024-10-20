const express = require("express");
const enrutador = express.Router();
const controladorComuna = require("../controladores/controladorComuna");
const permisos = require("../config/permisos");

enrutador.use(permisos.autenticarToken);

enrutador.use(permisos.autorizarRol);

enrutador.delete("/:id", controladorComuna.borrarComuna);

enrutador.get("/", controladorComuna.listarComunas);

//enrutador.get("/estadisticas", controladorComuna.estadisticas);

enrutador.get("/:id", controladorComuna.buscarComuna);

enrutador.post("/", controladorComuna.nuevaComuna);

enrutador.put("/:id", controladorComuna.actualizarComuna);

module.exports = enrutador;
