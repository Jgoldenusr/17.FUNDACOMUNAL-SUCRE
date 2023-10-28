const express = require("express");
const enrutador = express.Router();
const controlador = require("../controladores/controladorReporte");
const permisos = require("../config/permisos");

enrutador.use(permisos.autenticarToken);
enrutador.use(permisos.autorizarRol);

enrutador.delete("/:id", controlador.borrarReporte);

enrutador.get("/", controlador.listarReportes);

enrutador.get("/:id", controlador.buscarReporte);

enrutador.post("/casoadmin/", controlador.nuevoCasoAdmin);

enrutador.post("/comunicaciones/", controlador.nuevoComunicaciones);

enrutador.post("/formacion/", controlador.nuevoFormacion);

enrutador.post("/incidencias/", controlador.nuevoIncidencias);

enrutador.post("/fortalecimiento/", controlador.nuevoFortalecimiento);

enrutador.post("/participacion/", controlador.nuevoParticipacion);

enrutador.put("/casoadmin/:id", controlador.actualizarCasoAdmin);

enrutador.put("/comunicaciones/:id", controlador.actualizarComunicaciones);

enrutador.put("/formacion/:id", controlador.actualizarFormacion);

enrutador.put("/fortalecimiento/:id", controlador.actualizarFortalecimiento);

enrutador.put("/incidencias/:id", controlador.actualizarIncidencias);

enrutador.put("/participacion/:id", controlador.actualizarParticipacion);

/*

enrutador.post("/interno/", controlador.nuevoInterno);

enrutador.put("/interno/:id", controlador.actualizarInterno);

*/

module.exports = enrutador;
