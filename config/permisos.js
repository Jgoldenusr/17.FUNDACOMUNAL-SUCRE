const passport = require("passport");
const Reporte = require("../modelos/reporte");
const asyncHandler = require("express-async-handler");

const listaNegraPromotor = [
  { ruta: "/ccs", metodos: ["DELETE", "POST", "PUT"] },
  { ruta: "/comunas", metodos: ["DELETE", "POST", "PUT"] },
  { ruta: "/config", metodos: ["DELETE", "POST", "PUT"] },
  { ruta: "/reportes", metodos: [""] },
  { ruta: "/reportes/interno", metodos: ["POST", "PUT"] },
  { ruta: "/usuarios", metodos: ["DELETE", "GET", "POST", "PUT"] },
];

exports.autenticarToken = passport.authenticate("jwt", {
  session: false,
  failureRedirect: "/usuarios/denegado",
});

exports.autorizarAutogestion = function (req, res, next) {
  const partesURL = req.path.split("/"); //Dividimos la url segun los slashs
  const idUsuario = partesURL[partesURL.length - 1]; //Buscamos lo ultimo de la url, que es la id del usuario

  if (idUsuario === req.user._id.toString()) {
    return res.status(401).json({
      error: {
        message:
          "Accion denegada, contacte con otro administrador para llevarla a cabo",
      },
    });
  } else {
    return next();
  }
};

exports.autorizarCambio = asyncHandler(async function (req, res, next) {
  if (req.user.rol === "ADMINISTRADOR") {
    return next();
  } else {
    const partesURL = req.path.split("/"); //Dividimos la url segun los slashs
    const idReporte = partesURL[partesURL.length - 1]; //Buscamos lo ultimo de la url, que es la id del reporte
    //Hacemos la consulta
    const reporteAsociado = await Reporte.findOne({
      _id: idReporte,
      usuario: req.user._id,
    }).exec();
    //Si tuvo exito, pasamos al siguiente middleware, sino, desautorizamos
    return reporteAsociado
      ? next()
      : res.status(401).json({
          error: {
            message: "Usuario no asociado al reporte",
          },
        });
  }
});

exports.autorizarRol = function (req, res, next) {
  let valido = true;

  if (req.user.rol === "PROMOTOR") {
    listaNegraPromotor.forEach((permiso) => {
      let expresionRegular = new RegExp(permiso.ruta);
      if (expresionRegular.test(req.originalUrl)) {
        if (permiso.metodos.includes(req.method)) {
          valido = false;
        }
      }
    });
  }

  return valido
    ? next()
    : res.status(401).json({
        error: {
          message: "Rol no autorizado",
        },
      });
};
