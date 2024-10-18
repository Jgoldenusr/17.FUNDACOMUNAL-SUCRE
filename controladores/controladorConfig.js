const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Opcion = require("../modelos/opcion");

exports.actualizarOpcion =
  //Se validan los campos
  [
    body("array.*")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo del arreglo no debe estar vacio")
      .bail()
      .isLength({ max: 100 })
      .withMessage("El campo del arreglo no debe exceder los 100 caracteres")
      .toUpperCase(),
    body("campo")
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo no debe estar vacio")
      .bail()
      .isLength({ max: 100 })
      .withMessage("El campo no debe exceder los 100 caracteres"),
    body("coleccion")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo no debe estar vacio")
      .bail()
      .isLength({ max: 30 })
      .withMessage("El campo no debe exceder los 30 caracteres"),
    //Despues de que se chequean los campos, se ejecuta esta funcion
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea un objeto con los datos de la nueva opcion
      const nuevaOpcion = {
        _id: req.params.id, //Es importante incluir la id original
        array: req.body.array,
        campo: req.body.campo,
        coleccion: req.body.coleccion,
      };

      if (!errores.isEmpty()) {
        //Si hubieron errores en el proceso de validacion se regresa un arreglo de ellos
        //Tambien se regresan los datos introducidos por el usuario
        return res.status(400).json({
          opcion: nuevaOpcion,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si no hubieron errores
        await Opcion.findByIdAndUpdate(req.params.id, {
          $set: nuevaOpcion,
        }).exec();
        //Exito
        return res.status(200).json({ id: req.params.id });
      }
    }),
  ];

exports.borrarOpcion = asyncHandler(async function (req, res, next) {
  //Ahora si se borra el reporte
  await Opcion.findByIdAndDelete(req.params.id).exec();
  //Exito
  return res.status(200).json(req.params.id);
});

exports.buscarOpcion = asyncHandler(async function (req, res, next) {
  //Se busca la opcion
  const nuevaOpcion = await Opcion.findById(req.params.id).exec();
  //La funcion anterior no falla cuando no encuentra nada, sino que regresa null
  if (nuevaOpcion === null) {
    //Se verifica si 'nuevaOpcion' es nulo
    return res.status(404).json({ error: { message: "No encontrado" } });
  } else {
    //Si no es nulo, se envia la opcion
    return res.status(200).json(nuevaOpcion);
  }
});

exports.listarOpciones = asyncHandler(async function (req, res, next) {
  const { campo, coleccion } = req.query; //se extraen los parametros de la consulta
  let parametros = {};

  if (campo) {
    parametros.campo = campo;
  }
  if (coleccion) {
    parametros.coleccion = coleccion;
  }

  //Busca la(s) opcion(es) segun los parametros y los regresa en un arreglo
  const listaOpciones = await Opcion.find(parametros).exec();

  if (listaOpciones.length > 0) {
    //Si el arreglo no esta vacio
    return res.status(200).json(listaOpciones);
  } else {
    //Si el arreglo esta vacio
    return res
      .status(502)
      .json({ error: { message: "No se encontro ningun resultado" } });
  }
});

exports.nuevaOpcion =
  //Se validan los campos
  [
    body("array.*")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo del arreglo no debe estar vacio")
      .bail()
      .isLength({ max: 100 })
      .withMessage("El campo del arreglo no debe exceder los 100 caracteres")
      .toUpperCase(),
    body("campo")
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo no debe estar vacio")
      .bail()
      .isLength({ max: 200 })
      .withMessage("El campo no debe exceder los 200 caracteres"),
    body("coleccion")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo no debe estar vacio")
      .bail()
      .isLength({ max: 30 })
      .withMessage("El campo no debe exceder los 30 caracteres"),
    //Despues de que se chequean los campos, se ejecuta esta funcion
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea un objeto con los datos de la nueva opcion
      const nuevaOpcion = {
        array: req.body.array,
        campo: req.body.campo,
        coleccion: req.body.coleccion,
      };

      if (!errores.isEmpty()) {
        //Si hubieron errores en el proceso de validacion se regresa un arreglo de ellos
        //Tambien se regresan los datos introducidos por el usuario
        return res.status(400).json({
          opcion: nuevaOpcion,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si no hubieron errores
        const documentoOpcion = new Opcion(nuevaOpcion);
        await documentoOpcion.save();
        //Si todo tuvo exito se regresa la id de la nueva opcion
        return res.status(200).json({ id: documentoOpcion._id });
      }
    }),
  ];
