const compresion = require("compression");
const cors = require("cors");
const express = require("express");
const logger = require("morgan");
const crearError = require("http-errors");
const helmet = require("helmet");
const limitador = require("express-rate-limit");
const mongoose = require("mongoose");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const rutasCC = require("./rutas/rutasCC");
const rutasPromotor = require("./rutas/rutasPromotor");
const rutasReporte = require("./rutas/rutasReporte");
const rutasUsuario = require("./rutas/rutasUsuario");
const Usuario = require("./modelos/usuario");
require("dotenv").config();

//Funcion asincrona para conectar a MongoDB.
async function conectarAMongoDB() {
  //Opcion para filtrar propiedades que no esten en el esquema cuando se hagan consultas
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.CONEXION);
}
//Se ejecuta la funcion anterior y si hubo un error se imprime a la consola.
conectarAMongoDB().catch((err) => console.log(err));
//Configuracion del middleware limitador de peticiones
const limite = limitador({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20, //20 peticiones por minuto
});

//Se inicia express.
const app = express();

//Middleware o procesos auxiliares
app.use(logger("dev")); //Para registrar en consola las peticiones HTTP
app.use(helmet()); //Asegura la API verificando las cabeceras HTTP
app.use(cors()); //Ajusta el CORS, de momento está ajustado para que todos puedan hacer peticiones
app.use(limite); //Limita las peticiones de una ip dada
app.use(express.json()); //Reconoce datosDelJWT enviados en .json y los asigna a req.body convenientemente
app.use(compresion()); //Para comprimir las respuestas

//Middleware de autenticación
//passportJWT.Strategy permite definir una nueva estrategia para autenticar usando jwt
const EstrategiaJWT = passportJWT.Strategy;
//passportJWT.ExtractJwt proporciona los metodos para extraer el jwt
const ExtraerJWT = passportJWT.ExtractJwt;
//Se definen las opciones de la estrategia
const opcionesDeEstrategia = {
  //El jwt se extraera de la cabecera de autenticaron 'Bearer'
  jwtFromRequest: ExtraerJWT.fromAuthHeaderAsBearerToken(),
  //Clave secreta para verificar la clave del token
  secretOrKey: process.env.CLAVE_SECRETA,
};
//La funcion de verificacion, que se ejecuta con los datos extraidos del JWT
const funcionDeVerificacion = async function (datosDelJWT, autenticado) {
  //La _id se habia guardado en el jwt, asi que buscamos si existe un usuario con esa id
  const usuarioAutenticado = await Usuario.findById(datosDelJWT._id, "-clave ");
  if (usuarioAutenticado) {
    //Si el usuario existe, autenticamos, pasando el primer argumento (error) como nulo
    //Podemos acceder al usuario autenticado en middleware posteriores usando req.user
    return autenticado(null, usuarioAutenticado);
  } else {
    //Si no, pasamos un error a la funcion autenticado
    return autenticado(error);
  }
};
//Usamos la estrategia recien creada
passport.use(new EstrategiaJWT(opcionesDeEstrategia, funcionDeVerificacion));

//Se activan las rutas
app.use("/ccs", rutasCC);
app.use("/promotores", rutasPromotor);
app.use("/reportes", rutasReporte);
app.use("/usuarios", rutasUsuario);

//Captura una ruta inexistente
app.use(function (req, res, next) {
  next(crearError(404));
});

//Maneja los errores
app.use(function (err, req, res, next) {
  //El stack se envia solo en desarrollo
  return res.status(err.status || 500).json({
    error: {
      message: err.message,
      stack: req.app.get("env") === "development" ? err.stack : "",
    },
  });
});

//Finalmente se exporta la app para que pueda ser usada por el punto de acceso
module.exports = app;
