const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const CC = require("../modelos/cc");

exports.listarCC = asyncHandler(async function (req, res, next) {
  const listaCC = await CC.find({}, "nombre tipo municipios situr").exec();

  if (listaCC.length > 0) {
    //La lista no esta vacia.
    return res.status(200).json(listaCC);
  } else {
    //La lista esta vacia.
    return res.status(502).json({ error: { message: "Lista vacia" } });
  }
});
exports.nuevoCC =
  //Se validan los campos
  [
    body("tipo", "Tipo no permitido")
      .optional({ values: "falsy" })
      .trim()
      .isIn(["INDIGENA", "MIXTO", "RURAL", "URBANO"])
      .escape(), //testear usando uno que no este en la lista
    body("redi", "Redi no permitido")
      .optional({ values: "falsy" })
      .trim()
      .isIn([
        "ANDES",
        "CAPITAL",
        "CENTRAL",
        "GUAYANA",
        "INSULAR",
        "LLANOS",
        "OCCIDENTAL",
        "ORIENTAL",
      ])
      .escape(),
    body("estados")
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'estados' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'estados' no debe exceder los 30 caracteres")
      .toUpperCase()
      .escape(),
    body("municipios")
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'municipios' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'municipios' no debe exceder los 30 caracteres")
      .toUpperCase()
      .escape(),
    body("parroquias")
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'parroquias' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'parroquias' no debe exceder los 30 caracteres")
      .toUpperCase()
      .escape(),
    body("localidad")
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'localidad' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'localidad' no debe exceder los 50 caracteres")
      .toUpperCase()
      .escape(),
    body("nombre")
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'nombre' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'nombre' no debe exceder los 50 caracteres")
      .toUpperCase()
      .escape(),
    body("situr") //revisar si esta repetido y forzar con una regex
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'situr' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'situr' no debe exceder los 50 caracteres")
      .toUpperCase()
      .escape(),
    //Se ejecuta despues de validados los campos
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea el objeto (pero no se guarda aun)
      const nuevoCC = new CC({
        tipo: req.body.tipo,
        redi: req.body.redi,
        estados: req.body.estados,
        municipios: req.body.municipios,
        parroquias: req.body.parroquias,
        localidad: req.body.localidad,
        nombre: req.body.nombre,
        situr: req.body.situr,
      });

      if (!errores.isEmpty()) {
        //Si hubieron errores
        return res.status(400).json({
          cc: nuevoCC,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si no hubieron errores
        await nuevoCC.save(); //Se guarda
        return res.status(200).json(nuevoCC);
      }
    }),
  ];
exports.buscarCC = asyncHandler(async function (req, res, next) {
  //Se busca el consejo comunal por el parametro pasado por url
  const nuevoCC = await CC.findById(req.params.id).exec();
  //La funcion anterior no falla cuando no encuentra nada, sino que regresa null
  if (nuevoCC === null) {
    //Se verifica si 'nuevoCC' es nulo y envia un mensaje endogeno
    return res
      .status(404)
      .json({ error: { message: "No se encontro el consejo comunal" } });
  } else {
    //Si no es nulo, se envia una respuesta exitosa
    return res.status(200).json(nuevoCC);
  }
});
exports.actualizarCC =
  //Se validan los campos
  [
    body("tipo", "Tipo no permitido")
      .isIn(["INDIGENA", "MIXTO", "RURAL", "URBANO"])
      .escape(),
    body("redi", "Redi no permitido")
      .isIn([
        "ANDES",
        "CAPITAL",
        "CENTRAL",
        "GUAYANA",
        "INSULAR",
        "LLANOS",
        "OCCIDENTAL",
        "ORIENTAL",
      ])
      .escape(),
    body("estados")
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'estados' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'estados' no debe exceder los 30 caracteres")
      .toUpperCase()
      .escape(),
    body("municipios")
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'municipios' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'municipios' no debe exceder los 30 caracteres")
      .toUpperCase()
      .escape(),
    body("parroquias")
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'parroquias' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'parroquias' no debe exceder los 30 caracteres")
      .toUpperCase()
      .escape(),
    body("localidad")
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'localidad' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'localidad' no debe exceder los 50 caracteres")
      .toUpperCase()
      .escape(),
    body("nombre")
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'nombre' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'nombre' no debe exceder los 50 caracteres")
      .toUpperCase()
      .escape(),
    body("situr") //revisar si esta repetido y forzar con una regex
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'situr' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'situr' no debe exceder los 50 caracteres")
      .toUpperCase()
      .escape(),
    //Se ejecuta despues de validados los campos
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea el objeto (pero no se guarda aun)
      const nuevoCC = new CC({
        tipo: req.body.tipo,
        redi: req.body.redi,
        estados: req.body.estados,
        municipios: req.body.municipios,
        parroquias: req.body.parroquias,
        localidad: req.body.localidad,
        nombre: req.body.nombre,
        situr: req.body.situr,
        _id: req.params.id,
      });

      if (!errores.isEmpty()) {
        //Si hubieron errores
        return res.status(400).json({
          cc: nuevoCC,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si no hubieron errores
        await CC.findByIdAndUpdate(req.params.id, nuevoCC, {}); //Se actualiza
        return res.status(200).json(nuevoCC);
      }
    }),
  ];
exports.borrarCC = asyncHandler(async function (req, res, next) {
  /* NO IMPLEMENTADO AUN*/
});
