//const compresion = require("compression");
const cors = require("cors");
const express = require("express");
const logger = require("morgan");
const crearError = require("http-errors");
//const helmet = require("helmet");
//const limitador = require("express-rate-limit");
const mongoose = require("mongoose");
const passport = require("passport");
const autenticarConJWT = require("./config/estrategiaJWT");
const rutasCC = require("./rutas/rutasCC");
const rutasReporte = require("./rutas/rutasReporte");
const rutasUsuario = require("./rutas/rutasUsuario");
require("dotenv").config();

//Funcion asincrona para conectar a MongoDB.
async function conectarAMongoDB() {
  //Opcion para filtrar propiedades que no esten en el esquema cuando se hagan consultas
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.CONEXION);
}
//Se ejecuta la funcion anterior y si hubo un error se imprime a la consola.
conectarAMongoDB().catch((err) => console.log(err));

/*Configuracion del middleware limitador de peticiones
const limite = limitador({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20, //20 peticiones por minuto
});*/

//Se inicia express.
const app = express();

//Middleware o procesos auxiliares
//app.use(helmet()); //Asegura la API verificando las cabeceras HTTP
app.use(cors()); //Ajusta el CORS, de momento está ajustado para que todos puedan hacer peticiones
//app.use(limite); //Limita las peticiones de una ip dada
app.use(logger("dev")); //Para registrar en consola las peticiones HTTP
app.use(express.json()); //Reconoce datosDelJWT enviados en .json y los asigna a req.body convenientemente
//app.use(compresion()); //Para comprimir las respuestas
passport.use(autenticarConJWT);

//Se activan las rutas
app.use("/ccs", rutasCC);
app.use("/reportes", rutasReporte);
app.use("/usuarios", rutasUsuario);

//Captura una ruta inexistente
app.use(function (req, res, next) {
  next(crearError(404));
});

//Maneja los errores
app.use(function (err, req, res, next) {
  //El stack se envia solo en desarrollo
  /* prettier-ignore */
  return res.status(err.status || 500).json({
    error: {
      message: req.app.get("env") === "development" ? err.message : "Error interno del servidor",
      stack: req.app.get("env") === "development" ? err.stack : "",
    },
  });
});

//Finalmente se exporta la app para que pueda ser usada por el punto de acceso
module.exports = app;
