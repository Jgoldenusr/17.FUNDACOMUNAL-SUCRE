const express = require("express");
const enrutador = express.Router();
const controladorPromotor = require("../controladores/controladorPromotor");
const passport = require("passport");

enrutador.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  controladorPromotor.listarPromotores
);

enrutador.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  controladorPromotor.nuevoPromotor
);

enrutador.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controladorPromotor.buscarPromotor
);

enrutador.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controladorPromotor.actualizarPromotor
);

enrutador.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  controladorPromotor.borrarPromotor
); //??

module.exports = enrutador;
