const passport = require("passport");

const listaNegraPromotor = [
  { ruta: "/ccs", metodos: ["DELETE", "POST", "PUT"] },
  { ruta: "/reportes", metodos: ["DELETE"] },
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
