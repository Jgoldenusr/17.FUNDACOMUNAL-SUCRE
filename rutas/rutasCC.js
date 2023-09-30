const express = require("express");
const enrutador = express.Router();
const controladorCC = require("../controladores/controladorCC");
const passport = require("passport");

enrutador.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controladorCC.listarCC
);

enrutador.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controladorCC.nuevoCC
);

enrutador.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controladorCC.buscarCC
);

enrutador.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controladorCC.actualizarCC
);

enrutador.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controladorCC.borrarCC
); //??

module.exports = enrutador;
