const express = require("express");
const enrutador = express.Router();
const controladorCC = require("../controladores/controladorCC");
const permisos = require("../config/permisos");

enrutador.use(permisos.autenticarToken);
enrutador.use(permisos.autorizarRol);
//A partir de aca las rutas estan protegidas

enrutador.delete("/:id", controladorCC.borrarCC);

enrutador.get("/", controladorCC.listarCC);

enrutador.get("/:id", controladorCC.buscarCC);

enrutador.post("/", controladorCC.nuevoCC);

enrutador.put("/:id", controladorCC.actualizarCC);

module.exports = enrutador;
