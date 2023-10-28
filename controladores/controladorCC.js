const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const CC = require("../modelos/cc");
const Usuario = require("../modelos/usuario");
const Validar = require("../config/validadores");

exports.actualizarCC =
  //Se validan los campos
  [
    body("usuario.cedula").custom(Validar.cedulaExiste),
    body("comuna")
      .optional({ values: "falsy" })
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'comuna' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'comuna' no debe exceder los 30 caracteres")
      .toUpperCase(),
    body("estados")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'estados' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'estados' no debe exceder los 30 caracteres")
      .toUpperCase(),
    body("localidad")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'localidad' no debe estar vacio")
      .isLength({ max: 100 })
      .withMessage("El campo 'localidad' no debe exceder los 100 caracteres")
      .toUpperCase(),
    body("municipios")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'municipios' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'municipios' no debe exceder los 30 caracteres")
      .toUpperCase(),
    body("nombre")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'nombre' no debe estar vacio")
      .isLength({ max: 100 })
      .withMessage("El campo 'nombre' no debe exceder los 100 caracteres")
      .toUpperCase(),
    body("parroquias")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'parroquias' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'parroquias' no debe exceder los 30 caracteres")
      .toUpperCase(),
    body("redi", "Redi invalido")
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
      ]),
    body("situr")
      .trim()
      .matches(/^[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{3}-[0-9]{4}$/)
      .withMessage("El situr debe tener el patrón 11-11-11-111-1111")
      .bail()
      .custom(Validar.siturNoRepetido),
    body("tipo", "Tipo invalido")
      .trim()
      .isIn(["INDIGENA", "MIXTO", "RURAL", "URBANO"]),
    //Despues de que se chequean los campos, se ejecuta esta funcion
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea un objeto con los datos del CC
      const nuevoCC = {
        _id: req.params.id, //Es importante incluir la id original
        comuna: req.body.comuna,
        estados: req.body.estados,
        localidad: req.body.localidad,
        municipios: req.body.municipios,
        nombre: req.body.nombre,
        parroquias: req.body.parroquias,
        redi: req.body.redi,
        situr: req.body.situr,
        tipo: req.body.tipo,
      };

      if (!errores.isEmpty()) {
        //Si hubieron errores en el proceso de validacion se regresa un arreglo de ellos
        //Tambien se regresan los datos introducidos por el usuario
        return res.status(400).json({
          cc: nuevoCC,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si no hubieron errores
        //Se busca el CC que se va a editar
        const miCC = await CC.findById(req.params.id).exec();
        //Este if se ejecuta si se va a cambiar el usuario asociado
        if (miCC.usuario.cedula != req.body.usuario.cedula) {
          //Se busca el usuario viejo
          const usuarioViejo = await Usuario.findOne({
            cedula: miCC.usuario.cedula,
          }).exec();
          //Se saca el cc
          usuarioViejo.cc.pull({ _id: req.params.id });
          //Se guarda
          await usuarioViejo.save();
        }
        //Se busca el usuario asociado
        const usuarioAsociado = await Usuario.findOne({
          cedula: req.body.usuario.cedula,
        }).exec();
        //Se actualiza el usuario asociado con los datos del nuevo CC
        usuarioAsociado.cc.pull({ _id: req.params.id });
        usuarioAsociado.cc.push(nuevoCC);
        //Se asocia al objeto del nuevo CC
        nuevoCC.usuario = usuarioAsociado;
        //Se guardan el usuario asociado
        await usuarioAsociado.save();
        //Se actualiza el C
        await miCC.updateOne({ $set: nuevoCC });
        //Si todo tuvo exito se retorna la id del CC actualizado
        return res.status(200).json({ id: req.params.id });
      }
    }),
  ];

exports.borrarCC = asyncHandler(async function (req, res, next) {
  /* NO IMPLEMENTADO AUN*/
});

exports.buscarCC = asyncHandler(async function (req, res, next) {
  //Se busca el consejo comunal (por el parametro pasado por url)
  const nuevoCC = await CC.findById(req.params.id).exec();
  //La funcion anterior no falla cuando no encuentra nada, sino que regresa null
  if (nuevoCC === null) {
    //Se verifica si 'nuevoCC' es nulo
    return res.status(404).json({ error: { message: "No encontrado" } });
  } else {
    //Si no es nulo, se envia el CC
    return res.status(200).json(nuevoCC);
  }
});

exports.listarCC = asyncHandler(async function (req, res, next) {
  //Busca todos los CC y los regresa en un arreglo
  const listaCC = await CC.find({}).exec();

  if (listaCC.length > 0) {
    //Si el arreglo no esta vacio
    return res.status(200).json(listaCC);
  } else {
    //Si el arreglo esta vacio
    return res.status(1002).json({ error: { message: "Lista vacia" } });
  }
});

exports.nuevoCC =
  //Se validan los campos
  [
    body("usuario.cedula").custom(Validar.cedulaExiste),
    body("comuna")
      .optional({ values: "falsy" })
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'comuna' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'comuna' no debe exceder los 30 caracteres")
      .toUpperCase(),
    body("estados")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'estados' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'estados' no debe exceder los 30 caracteres")
      .toUpperCase(),
    body("localidad")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'localidad' no debe estar vacio")
      .isLength({ max: 100 })
      .withMessage("El campo 'localidad' no debe exceder los 100 caracteres")
      .toUpperCase(),
    body("municipios")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'municipios' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'municipios' no debe exceder los 30 caracteres")
      .toUpperCase(),
    body("nombre")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'nombre' no debe estar vacio")
      .isLength({ max: 100 })
      .withMessage("El campo 'nombre' no debe exceder los 100 caracteres")
      .toUpperCase(),
    body("parroquias")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'parroquias' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'parroquias' no debe exceder los 30 caracteres")
      .toUpperCase(),
    body("redi", "Redi invalido")
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
      ]),
    body("situr")
      .trim()
      .matches(/^[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{3}-[0-9]{4}$/)
      .withMessage("El situr debe tener el patrón 11-11-11-111-1111")
      .bail()
      .custom(Validar.siturNuevo),
    body("tipo", "Tipo invalido")
      .trim()
      .isIn(["INDIGENA", "MIXTO", "RURAL", "URBANO"]),
    //Despues de que se chequean los campos, se ejecuta esta funcion
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea un objeto con los datos del CC
      const nuevoCC = {
        comuna: req.body.comuna,
        estados: req.body.estados,
        localidad: req.body.localidad,
        municipios: req.body.municipios,
        nombre: req.body.nombre,
        parroquias: req.body.parroquias,
        redi: req.body.redi,
        situr: req.body.situr,
        tipo: req.body.tipo,
      };

      if (!errores.isEmpty()) {
        //Si hubieron errores en el proceso de validacion se regresa un arreglo de ellos
        //Tambien se regresan los datos introducidos por el usuario
        return res.status(400).json({
          cc: nuevoCC,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si no hubieron errores se busca el usuario asociado (por su cedula)
        const usuarioAsociado = await Usuario.findOne({
          cedula: req.body.usuario.cedula,
        }).exec();
        //Se incluye este usuario en el objeto del nuevo CC
        nuevoCC.usuario = usuarioAsociado;
        //Se crea el nuevo documento a partir del objeto CC
        const documentoCC = new CC(nuevoCC);
        //Se añade el CC al array del usuario
        usuarioAsociado.cc.push(documentoCC);
        //Se guardan ambos
        await usuarioAsociado.save();
        await documentoCC.save();
        //Si todo tuvo exito se regresa la id del nuevo CC
        return res.status(200).json({ id: documentoCC._id });
      }
    }),
  ];
