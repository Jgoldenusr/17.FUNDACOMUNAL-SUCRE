const passportJWT = require("passport-jwt");
const Usuario = require("../modelos/usuario");
require("dotenv").config();

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
  //La _id se habia guardado en el jwt, asi que se busca si existe un usuario con esa id
  const usuarioAutenticado = await Usuario.findOne({
    _id: datosDelJWT._id,
    clave: datosDelJWT.clave,
  }).exec();
  if (usuarioAutenticado) {
    //Si el usuario existe
    return autenticado(null, usuarioAutenticado);
  } else {
    //Si no existe
    return autenticado(null);
  }
};

const autenticarConJWT = new EstrategiaJWT(
  opcionesDeEstrategia,
  funcionDeVerificacion
);

module.exports = autenticarConJWT;
