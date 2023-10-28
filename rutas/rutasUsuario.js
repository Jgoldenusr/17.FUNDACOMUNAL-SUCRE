const express = require("express");
const enrutador = express.Router();
const controladorUsuario = require("../controladores/controladorUsuario");
const permisos = require("../config/permisos");

enrutador.post("/ingresar", controladorUsuario.iniciarSesion);

enrutador.use(permisos.autenticarToken);
enrutador.use(permisos.autorizarRol);
//A partir de aca las rutas estan protegidas

enrutador.delete("/:id", controladorUsuario.borrarUsuario);

enrutador.get("/", controladorUsuario.listarUsuarios);

enrutador.get("/:id", controladorUsuario.buscarUsuario);

enrutador.post("/", controladorUsuario.registrarUsuario);

enrutador.put("/:id", controladorUsuario.actualizarUsuario);

module.exports = enrutador;
