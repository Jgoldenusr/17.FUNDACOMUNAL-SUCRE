const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const CC = require("../modelos/cc");
const Comuna = require("../modelos/comuna");
const Validar = require("../config/validadores");
const { OpcionesCC } = require("../config/opciones");

exports.actualizarCC =
  //Se validan los campos
  [
    body("estados", "El estado introducido es invalido")
      .trim()
      .isIn(OpcionesCC.estados),
    body("municipios", "El municipio introducido es invalido")
      .trim()
      .isIn(OpcionesCC.municipios),
    body("redi", "El redi introducido es invalido")
      .trim()
      .isIn(OpcionesCC.redi),
    body("tipo", "El tipo introducido es invalido")
      .trim()
      .isIn(OpcionesCC.tipo),
    body("situr")
      .trim()
      .custom(Validar.siturTienePatronValido)
      .bail()
      .custom(Validar.siturNoRepetido),
    body("parroquias").trim().custom(Validar.validarParroquia),
    body("comuna.nombre").trim().custom(Validar.comunaEsValida),
    body("localidad")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'localidad' no debe estar vacio")
      .bail()
      .isLength({ max: 100 })
      .withMessage("El campo 'localidad' no debe exceder los 100 caracteres")
      .toUpperCase(),
    body("nombre")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'nombre' no debe estar vacio")
      .bail()
      .isLength({ max: 100 })
      .withMessage("El campo 'nombre' no debe exceder los 100 caracteres")
      .toUpperCase(),
    //Despues de que se chequean los campos, se ejecuta esta funcion
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea un objeto con los datos del CC
      const nuevoCC = {
        _id: req.params.id, //Es importante incluir la id original
        activo: true,
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
        let consultaDeEdicion = { $set: nuevoCC }; //Consulta por defecto

        //Si la comuna es diferente de la comuna que tenia antes de la edicion
        if (miCC.comuna && miCC.comuna.nombre != req.body.comuna?.nombre) {
          //Se saca el CC de la comuna anteriormente asociada
          await Comuna.findOneAndUpdate(
            {
              situr: miCC.comuna.situr,
            },
            { $pull: { cc: { _id: req.params.id } } }
          ).exec();
        }

        //Si se le va a asignar una nueva comuna
        if (req.body.comuna?.nombre) {
          //Se busca la comuna asociada
          const comunaAsociada = await Comuna.findOne({
            estados: req.body.estados,
            municipios: req.body.municipios,
            nombre: req.body.comuna.nombre,
            parroquias: req.body.parroquias,
          }).exec();
          //Se actualiza la comuna asociada con los datos del nuevo CC
          comunaAsociada.cc.pull({ _id: req.params.id });
          comunaAsociada.cc.push(nuevoCC);
          //Se asocia al objeto del nuevo CC
          nuevoCC.comuna = comunaAsociada;
          //Se guarda la comuna asociada
          await comunaAsociada.save();
        } else {
          //Si no se le va a asignar nueva comuna, le quitamos el campo
          consultaDeEdicion = {
            $set: nuevoCC,
            $unset: { comuna: "" },
          };
        }
        //Se realiza la consulta
        await miCC.updateOne(consultaDeEdicion).exec();
        //Si todo tuvo exito se retorna la id del CC actualizado
        return res.status(200).json({ id: req.params.id });
      }
    }),
  ];

exports.borrarCC = asyncHandler(async function (req, res, next) {
  //Se busca el CC a borrar
  const CCABorrar = await CC.findById(req.params.id).exec();
  //Si no se hallo nada
  if (CCABorrar === null) {
    return res.status(404).json({ error: { message: "No se encontro el CC" } });
  } else if (CCABorrar.activo === false) {
    //Si 'CCABorrar' esta eliminado
    return res.status(404).json({
      error: { message: "El consejo comunal fue eliminado" },
    });
  } else {
    //Se busca la comuna asociada y se elimina la referencia al CC
    if (CCABorrar.comuna) {
      await Comuna.findOneAndUpdate(
        {
          situr: CCABorrar.comuna.situr,
        },
        { $pull: { cc: { _id: req.params.id } } }
      ).exec();
    }
    //La propiedad activo se cambia a falso
    await CCABorrar.updateOne({
      $set: { activo: false },
      $unset: { comuna: "", situr: "" },
    }).exec();
    //Exito
    return res.status(200).json({ id: req.params.id });
  }
});

exports.buscarCC = asyncHandler(async function (req, res, next) {
  //Se busca el consejo comunal (por el parametro pasado por url)
  const miCC = await CC.findById(req.params.id).exec();
  //La funcion anterior no falla cuando no encuentra nada, sino que regresa null
  if (miCC === null) {
    //Se verifica si 'miCC' es nulo
    return res.status(404).json({ error: { message: "No encontrado" } });
  } else if (miCC.activo === false) {
    //Se verifica si 'miCC' esta eliminado
    return res.status(404).json({
      error: { message: "El consejo comunal fue eliminado" },
    });
  } else {
    //Si no es nulo, se envia el CC
    return res.status(200).json(miCC);
  }
});
//SE ROMPE
exports.estadisticas = asyncHandler(async function (req, res, next) {
  const fechaDeAhora = new Date();
  const conteoCC = await CC.aggregate()
    .match({ activo: true })
    .group({
      _id: "$municipios",
      ccs: { $count: {} },
      noRenovados: {
        $sum: {
          $cond: [
            {
              $or: [
                { $lte: ["$renovado", null] },
                { $gt: [fechaDeAhora, "$renovado.hasta"] },
              ],
            },
            1,
            0,
          ],
        },
      },
      noVigentes: {
        $sum: {
          $cond: [
            {
              $or: [
                { $lte: ["$vigente", null] },
                { $gt: [fechaDeAhora, "$vigente.hasta"] },
              ],
            },
            1,
            0,
          ],
        },
      },
      renovados: {
        $sum: {
          $cond: [
            {
              $and: [
                { $gt: ["$renovado", null] },
                { $gt: ["$renovado.hasta", fechaDeAhora] },
              ],
            },
            1,
            0,
          ],
        },
      },
      vigentes: {
        $sum: {
          $cond: [
            {
              $and: [
                { $gt: ["$vigente", null] },
                { $gt: ["$vigente.hasta", fechaDeAhora] },
              ],
            },
            1,
            0,
          ],
        },
      },
    })
    .project({
      _id: 0,
      municipio: "$_id",
      ccs: 1,
      noRenovados: 1,
      noVigentes: 1,
      renovados: 1,
      vigentes: 1,
    })
    .sort({ municipio: -1 })
    .exec();

  return res.status(200).json(conteoCC);
});

exports.listarCC = asyncHandler(async function (req, res, next) {
  const fechaDeAhora = new Date();
  const { comuna, estatus, municipios, p, parroquias, situr, tipo } = req.query; //se extraen los parametros de la consulta
  let parametros = {
    activo: true,
  };
  if (comuna) {
    parametros = { "comuna.nombre": comuna };
  }
  if (estatus === "norenovado") {
    parametros.$or = [
      { renovado: { $exists: false } },
      { "renovado.hasta": { $lt: fechaDeAhora } },
    ];
  }
  if (estatus === "novigente") {
    parametros.$or = [
      { vigente: { $exists: false } },
      { "vigente.hasta": { $lt: fechaDeAhora } },
    ];
  }
  if (estatus === "renovado") {
    parametros.$and = [
      { renovado: { $exists: true } },
      { "renovado.hasta": { $gt: fechaDeAhora } },
    ];
  }
  if (estatus === "vigente") {
    parametros.$and = [
      { vigente: { $exists: true } },
      { "vigente.hasta": { $gt: fechaDeAhora } },
    ];
  }
  if (municipios) {
    parametros.municipios = municipios;
  }
  if (parroquias) {
    parametros.parroquias = parroquias;
  }
  if (situr) {
    parametros.situr = situr;
  }
  if (tipo) {
    parametros.tipo = tipo;
  }
  //Busca todos los CC segun los parametros y los regresa en un arreglo
  const listaCC = await CC.paginate(parametros, {
    limit: 10,
    page: parseInt(p, 10) || 1,
  });

  if (listaCC.docs.length > 0) {
    //Si el arreglo no esta vacio
    return res.status(200).json(listaCC);
  } else {
    //Si el arreglo esta vacio
    return res
      .status(502)
      .json({ error: { message: "No se encontro ningun resultado" } });
  }
});

exports.nuevoCC =
  //Se validan los campos
  [
    body("estados", "El estado introducido es invalido")
      .trim()
      .isIn(OpcionesCC.estados),
    body("municipios", "El municipio introducido es invalido")
      .trim()
      .isIn(OpcionesCC.municipios),
    body("redi", "El redi introducido es invalido")
      .trim()
      .isIn(OpcionesCC.redi),
    body("tipo", "El tipo introducido es invalido")
      .trim()
      .isIn(OpcionesCC.tipo),
    body("situr")
      .trim()
      .custom(Validar.siturTienePatronValido)
      .bail()
      .custom(Validar.siturNuevo),
    body("parroquias").trim().custom(Validar.validarParroquia),
    body("comuna.nombre").trim().custom(Validar.comunaEsValida),
    body("localidad")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'localidad' no debe estar vacio")
      .bail()
      .isLength({ max: 100 })
      .withMessage("El campo 'localidad' no debe exceder los 100 caracteres")
      .toUpperCase(),
    body("nombre")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'nombre' no debe estar vacio")
      .bail()
      .isLength({ max: 100 })
      .withMessage("El campo 'nombre' no debe exceder los 100 caracteres")
      .toUpperCase(),
    //Despues de que se chequean los campos, se ejecuta esta funcion
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea un objeto con los datos del CC
      const nuevoCC = {
        activo: true,
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
        //Se crea el nuevo documento a partir del objeto CC
        const documentoCC = new CC(nuevoCC);
        //Si no hubieron errores se busca la comuna asociada
        if (req.body.comuna.nombre) {
          const comunaAsociada = await Comuna.findOneAndUpdate(
            {
              estados: req.body.estados,
              municipios: req.body.municipios,
              nombre: req.body.comuna.nombre,
              parroquias: req.body.parroquias,
            },
            { $push: { cc: documentoCC } }
          ).exec();
          //Se incluye esta comuna en el objeto del nuevo CC
          documentoCC.comuna = comunaAsociada;
        }
        //Se guarda el documento del CC
        await documentoCC.save();
        //Si todo tuvo exito se regresa la id del nuevo CC
        return res.status(200).json({ id: documentoCC._id });
      }
    }),
  ];
