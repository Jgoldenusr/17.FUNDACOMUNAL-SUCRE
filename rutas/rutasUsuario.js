const express = require("express");
const enrutador = express.Router();
const controladorUsuario = require("../controladores/controladorUsuario");
const passport = require("passport");

enrutador.post("/registrar", controladorUsuario.registrarUsuario);

enrutador.post("/ingresar", controladorUsuario.autenticarUsuario);

enrutador.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controladorUsuario.buscarUsuario
); //protegida, solo debug, antes de cada controlador se autentica

enrutador.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controladorUsuario.listarUsuarios
); //protegida, solo debug, antes de cada controlador se autentica

enrutador.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controladorUsuario.actualizarUsuario
); //??

enrutador.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controladorUsuario.borrarUsuario
); //??

module.exports = enrutador;
