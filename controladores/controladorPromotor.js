const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Promotor = require("../modelos/promotor");

exports.listarPromotores = asyncHandler(async function (req, res, next) {
  const listaDePromotores = await Promotor.find({}).exec();

  if (listaDePromotores.length > 0) {
    //La lista no esta vacia.
    return res.status(200).json(listaDePromotores);
  } else {
    //La lista esta vacia.
    return res.status(502).json({ error: { message: "Lista vacia" } });
  }
});
exports.nuevoPromotor =
  //Se validan los campos
  [
    body("cedula")
      .trim()
      .isInt({ min: 1 })
      .withMessage("La cedula debe ser un numero mayor a 0")
      .escape(),
    body("nombre")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un nombre")
      .isLength({ max: 30 })
      .withMessage("El nombre no debe exceder los 30 caracteres")
      .isAlpha()
      .withMessage("El nombre solo debe incluir letras")
      .toUpperCase()
      .escape(),
    body("apellido")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un apellido")
      .isLength({ max: 30 })
      .withMessage("El apellido no debe exceder los 30 caracteres")
      .isAlpha()
      .withMessage("El apellido solo debe incluir letras")
      .toUpperCase()
      .escape(),
    body("tlf")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un numero de telefono")
      .isLength({ max: 30 })
      .withMessage("El numero de telefono no puede exceder los 30 caracteres")
      .isNumeric({ no_symbols: true })
      .withMessage("El numero te telefono no debe incluir simbolos")
      .escape(),
    body("email")
      .trim()
      .isLength({ max: 50 })
      .withMessage("El correo electronico no puede exceder los 50 caracteres")
      .isEmail()
      .withMessage("Ingrese un correo electronico valido")
      .escape(),
    //Se ejecuta despues de validados los campos
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea el objeto (pero no se guarda aun)
      const nuevoPromotor = new Promotor({
        cedula: req.body.cedula,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        tlf: req.body.tlf,
        email: req.body.email,
      });

      if (!errores.isEmpty()) {
        //Si hubieron errores
        return res.status(400).json({
          promotor: nuevoPromotor,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si no hubieron errores
        await nuevoPromotor.save(); //Se guarda
        return res.status(200).json(nuevoPromotor);
      }
    }),
  ];
exports.buscarPromotor = asyncHandler(async function (req, res, next) {
  //Se busca el promotor por el parametro pasado por url
  const nuevoPromotor = await Promotor.findById(req.params.id).exec();
  //La funcion anterior no falla cuando no encuentra nada, sino que regresa null
  if (nuevoPromotor === null) {
    //Se verifica si 'nuevoPromotor' es nulo y envia un mensaje endogeno
    return res
      .status(404)
      .json({ error: { message: "No se encontro el promotor" } });
  } else {
    //Si no es nulo, se envia una respuesta exitosa
    return res.status(200).json(nuevoPromotor);
  }
});
exports.actualizarPromotor =
  //Se validan los campos
  [
    body("cedula")
      .trim()
      .isInt({ min: 1 })
      .withMessage("La cedula debe ser un numero mayor a 0")
      .escape(),
    body("nombre")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un nombre")
      .isLength({ max: 30 })
      .withMessage("El nombre no debe exceder los 30 caracteres")
      .isAlpha()
      .withMessage("El nombre solo debe incluir letras")
      .toUpperCase()
      .escape(),
    body("apellido")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un apellido")
      .isLength({ max: 30 })
      .withMessage("El apellido no debe exceder los 30 caracteres")
      .isAlpha()
      .withMessage("El apellido solo debe incluir letras")
      .toUpperCase()
      .escape(),
    body("tlf")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un numero de telefono")
      .isLength({ max: 30 })
      .withMessage("El numero de telefono no puede exceder los 30 caracteres")
      .isNumeric({ no_symbols: true })
      .withMessage("El numero te telefono no debe incluir simbolos")
      .escape(),
    body("email")
      .trim()
      .isLength({ max: 50 })
      .withMessage("El correo electronico no puede exceder los 50 caracteres")
      .isEmail()
      .withMessage("Ingrese un correo electronico valido")
      .escape(),
    //Se ejecuta despues de validados los campos
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea el objeto (pero no se guarda aun)
      const nuevoPromotor = new Promotor({
        cedula: req.body.cedula,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        tlf: req.body.tlf,
        email: req.body.email,
        _id: req.params.id,
      });

      if (!errores.isEmpty()) {
        //Si hubieron errores
        return res.status(400).json({
          promotor: nuevoPromotor,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si no hubieron errores
        await Promotor.findByIdAndUpdate(req.params.id, nuevoPromotor, {}); //Se actualiza
        return res.status(200).json(nuevoPromotor);
      }
    }),
  ];
exports.borrarPromotor = asyncHandler(async function (req, res, next) {
  /* NO IMPLEMENTADO AUN*/
});
