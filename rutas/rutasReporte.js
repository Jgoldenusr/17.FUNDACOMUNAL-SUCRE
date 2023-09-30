const express = require("express");
const enrutador = express.Router();
const controladorReporte = require("../controladores/controladorReporte");
const passport = require("passport");

enrutador.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controladorReporte.listarReportes
);

enrutador.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controladorReporte.nuevoReporte
);

enrutador.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controladorReporte.buscarReporte
);

enrutador.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controladorReporte.actualizarReporte
);

enrutador.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controladorReporte.borrarReporte
);

module.exports = enrutador;
