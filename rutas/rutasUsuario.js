const express = require("express");
const enrutador = express.Router();
const controladorUsuario = require("../controladores/controladorUsuario");
const permisos = require("../config/permisos");

enrutador.get("/denegado", controladorUsuario.denegado);

enrutador.post("/ingresar", controladorUsuario.iniciarSesion);

enrutador.use(permisos.autenticarToken);

enrutador.get("/cuenta", controladorUsuario.miCuenta);

enrutador.use(permisos.autorizarRol);

enrutador.get("/", controladorUsuario.listarUsuarios);

enrutador.get("/:id", controladorUsuario.buscarUsuario);

enrutador.post("/", controladorUsuario.registrarUsuario);

enrutador.use(permisos.autorizarAutogestion);

enrutador.delete("/:id", controladorUsuario.borrarUsuario);

enrutador.put("/:id", controladorUsuario.actualizarUsuario);

module.exports = enrutador;
