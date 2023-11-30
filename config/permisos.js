const passport = require("passport");
const Reporte = require("../modelos/reporte");
const asyncHandler = require("express-async-handler");

const listaNegraPromotor = [
  { ruta: "/ccs", metodos: ["DELETE", "POST", "PUT"] },
  { ruta: "/reportes", metodos: [""] },
  { ruta: "/usuarios", metodos: ["DELETE", "GET", "POST", "PUT"] },
];

exports.autenticarToken = passport.authenticate("jwt", {
  session: false,
});

exports.autorizarRol = function (req, res, next) {
  let valido = true;

  if (req.user.rol === "PROMOTOR") {
    listaNegraPromotor.forEach((permiso) => {
      if (permiso.ruta === req.baseUrl) {
        if (permiso.metodos.includes(req.method)) {
          valido = false;
        }
      }
    });
  }

  return valido ? next() : res.status(401).send("Rol no autorizado");
};

exports.autorizarCC = function (req, res, next) {
  const asociado = req.user.cc.find(
    (usrCC) => usrCC._id.toString() === req.body.cc._id.toString()
  );
  const esAdmin = req.user.rol === "ADMINISTRADOR";

  return asociado || esAdmin ? next() : res.status(401).send("No asociado");
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
    return reporteAsociado ? next() : res.status(401).send("No autorizado");
  }
});
