const express = require("express");
const enrutador = express.Router();
const controlador = require("../controladores/controladorReporte");
const permisos = require("../config/permisos");

enrutador.use(permisos.autenticarToken);

enrutador.use(permisos.autorizarRol);

enrutador.get("/", controlador.listarReportes);

enrutador.get("/estadisticas", controlador.estadisticas);

enrutador.get("/:id", controlador.buscarReporte);

enrutador.use(permisos.autorizarCC);

enrutador.post("/casoadmin/", controlador.nuevoCasoAdmin);

enrutador.post("/comunicaciones/", controlador.nuevoComunicaciones);

enrutador.post("/formacion/", controlador.nuevoFormacion);

enrutador.post("/fortalecimiento/", controlador.nuevoFortalecimiento);

enrutador.post("/incidencias/", controlador.nuevoIncidencias);

enrutador.post("/interno/", controlador.nuevoInterno);

enrutador.post("/participacion/", controlador.nuevoParticipacion);

enrutador.use(permisos.autorizarCambio);

enrutador.delete("/:id", controlador.borrarReporte);

enrutador.put("/casoadmin/:id", controlador.actualizarCasoAdmin);

enrutador.put("/comunicaciones/:id", controlador.actualizarComunicaciones);

enrutador.put("/formacion/:id", controlador.actualizarFormacion);

enrutador.put("/fortalecimiento/:id", controlador.actualizarFortalecimiento);

enrutador.put("/incidencias/:id", controlador.actualizarIncidencias);

enrutador.put("/participacion/:id", controlador.actualizarParticipacion);

enrutador.put("/interno/:id", controlador.actualizarInterno);

module.exports = enrutador;
