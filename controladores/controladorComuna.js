const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Comuna = require("../modelos/comuna");
const CC = require("../modelos/cc");
const Usuario = require("../modelos/usuario");
const Validar = require("../config/validadores");
const { OpcionesCC } = require("../config/opciones");

exports.actualizarComuna =
  //Se validan los campos
  [
    body("estados", "El estado introducido es invalido")
      .trim()
      .isIn(OpcionesCC.estados),
    body("municipios", "El municipio introducido es invalido")
      .trim()
      .isIn(OpcionesCC.municipios),
    body("tipo", "El tipo introducido es invalido")
      .trim()
      .isIn(OpcionesCC.tipoComuna),
    body("parroquias").trim().custom(Validar.validarParroquia),
    body("usuario.cedula")
      .optional({ values: "falsy" })
      .trim()
      .custom(Validar.cedulaTienePatronValido)
      .bail()
      .custom(Validar.cedulaExiste),
    body("situr")
      .trim()
      .custom(Validar.siturComunaTienePatronValido)
      .bail()
      .custom(Validar.siturComunaNoRepetido),
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
      const nuevaComuna = {
        _id: req.params.id, //Es importante incluir la id original
        activo: true,
        estados: req.body.estados,
        municipios: req.body.municipios,
        nombre: req.body.nombre,
        parroquias: req.body.parroquias,
        situr: req.body.situr,
        tipo: req.body.tipo,
      };

      if (!errores.isEmpty()) {
        //Si hubieron errores en el proceso de validacion se regresa un arreglo de ellos
        //Tambien se regresan los datos introducidos por el usuario
        return res.status(400).json({
          comuna: nuevaComuna,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si no hubieron errores
        //Se busca la comuna que se va a editar
        const miComuna = await Comuna.findById(req.params.id).exec();
        //Este if se ejecuta si se va a cambiar el usuario asociado
        if (miComuna.usuario?.cedula != req.body.usuario?.cedula) {
          //Se busca el usuario viejo y se edita
          await Usuario.findOneAndUpdate(
            {
              cedula: miComuna.usuario.cedula,
            },
            { $unset: { comuna: "" } }
          ).exec();
        }
        //Se buscan y eliminan referencias a la cedula en otras comunas excepto esta misma
        if (req.body.usuario?.cedula) {
          await Comuna.findOneAndUpdate(
            {
              "usuario.cedula": req.body.usuario.cedula,
              _id: { $ne: req.params.id },
            },
            { $unset: { usuario: "" } }
          ).exec();
          //Se busca el usuario asociado y se actualiza su comuna
          const usuarioAsociado = await Usuario.findOneAndUpdate(
            {
              cedula: req.body.usuario.cedula,
            },
            { $set: { comuna: nuevaComuna } }
          ).exec();
          //Se agrega el usuario a la comuna
          nuevaComuna.usuario = usuarioAsociado;
        }
        //Se actualizan TODOS los consejos comunales asociados a la comuna
        await CC.updateMany(
          { "comuna._id": req.params.id },
          { $set: { comuna: nuevaComuna } }
        ).exec();
        //Se actualiza la comuna
        await miComuna.updateOne({ $set: nuevaComuna }).exec();
        //Si todo tuvo exito se retorna la id de la comuna actualizada
        return res.status(200).json({ id: req.params.id });
      }
    }),
  ];

exports.borrarComuna = asyncHandler(async function (req, res, next) {
  //Se busca la comuna a borrar
  const ComunaABorrar = await Comuna.findById(req.params.id).exec();
  //Si no se hallaron resultados
  if (ComunaABorrar === null) {
    return res
      .status(404)
      .json({ error: { message: "No se encontro la comuna" } });
  } else if (ComunaABorrar.activo === false) {
    //Se verifica si 'ComunaABorrar' esta eliminado
    return res.status(404).json({
      error: { message: "La comuna fue eliminada" },
    });
  } else {
    //Se busca el usuario asociado y se elimina su comuna
    if (ComunaABorrar.usuario) {
      await Usuario.findOneAndUpdate(
        {
          cedula: ComunaABorrar.usuario.cedula,
        },
        { $unset: { comuna: "" } }
      ).exec();
    }
    //Se buscan los CC asociados y se eliminan sus comunas
    await CC.updateMany(
      { "comuna._id": req.params.id },
      { $unset: { comuna: "" } }
    ).exec();
    //La propiedad activo se cambia a falso
    await ComunaABorrar.updateOne({
      $set: { activo: false, cc: [] },
      $unset: { situr: "", usuario: "" },
    }).exec();
    //Exito
    return res.status(200).json({ id: req.params.id });
  }
});

exports.buscarComuna = asyncHandler(async function (req, res, next) {
  let parametros =
    req.params.id === "micomuna"
      ? {
          "usuario._id": req.user._id,
        }
      : {
          _id: req.params.id,
        };
  //Se busca la comuna (segun los parametros)
  const miComuna = await Comuna.findOne(parametros).exec();
  //Si no se encontro nada
  if (!miComuna) {
    //Si no se encontro nada se manda el error
    return res.status(404).json({ error: { message: "No encontrado" } });
  } else if (miComuna.activo === false) {
    //Si mi comuna no esta activo, se manda el error
    return res.status(404).json({
      error: { message: "La comuna fue eliminada" },
    });
  } else {
    //Consulta exitosa
    return res.status(200).json(miComuna);
  }
});

exports.estadisticas = asyncHandler(async function (req, res, next) {
  //NO IMPLEMENTADO
});

exports.listarComunas = asyncHandler(async function (req, res, next) {
  const { municipios, p, parroquias, situr, tipo, solonombres } = req.query; //se extraen los parametros de la consulta
  let listaComunas = [];
  let parametros = {
    activo: true,
  };
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
  if (solonombres) {
    //Si se solicita solo nombres de las comunas para algun select dinamico en el front
    listaComunas = (
      await Comuna.find(parametros, "nombre -_id").sort({ nombre: 1 }).exec()
    ).map((item) => item.nombre);
  } else {
    //Busca todas las comunas segun los parametros y los regresa en un arreglo
    listaComunas = await Comuna.paginate(parametros, {
      limit: 10,
      page: parseInt(p, 10) || 1,
    });
  }

  if (listaComunas?.length > 0 || listaComunas?.docs?.length > 0) {
    //Si el arreglo no esta vacio
    return res.status(200).json(listaComunas);
  } else {
    //Si el arreglo esta vacio
    return res
      .status(502)
      .json({ error: { message: "No se encontro ningun resultado" } });
  }
});

exports.nuevaComuna =
  //Se validan los campos
  [
    body("estados", "El estado introducido es invalido")
      .trim()
      .isIn(OpcionesCC.estados),
    body("municipios", "El municipio introducido es invalido")
      .trim()
      .isIn(OpcionesCC.municipios),
    body("tipo", "El tipo introducido es invalido")
      .trim()
      .isIn(OpcionesCC.tipoComuna),
    body("parroquias").trim().custom(Validar.validarParroquia),
    body("usuario.cedula")
      .optional({ values: "falsy" })
      .trim()
      .custom(Validar.cedulaTienePatronValido)
      .bail()
      .custom(Validar.cedulaExiste),
    body("situr")
      .trim()
      .custom(Validar.siturComunaTienePatronValido)
      .bail()
      .custom(Validar.siturComunaNuevo),
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
      //Se crea un objeto con los datos de la comuna
      const nuevaComuna = {
        activo: true,
        estados: req.body.estados,
        municipios: req.body.municipios,
        nombre: req.body.nombre,
        parroquias: req.body.parroquias,
        situr: req.body.situr,
        tipo: req.body.tipo,
      };

      if (!errores.isEmpty()) {
        //Si hubieron errores en el proceso de validacion se regresa un arreglo de ellos
        //Tambien se regresan los datos introducidos por el usuario
        return res.status(400).json({
          comuna: nuevaComuna,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si se proporciono una cedula
        if (req.body.usuario.cedula) {
          //Se buscan y eliminan referencias a la cedula en otras comunas
          await Comuna.findOneAndUpdate(
            {
              "usuario.cedula": req.body.usuario.cedula,
            },
            { $unset: { usuario: "" } }
          ).exec();
          //Se busca el usuario asociado (por su cedula)
          const usuarioAsociado = await Usuario.findOne({
            cedula: req.body.usuario.cedula,
          }).exec();
          //Se incluye este usuario en el objeto de la nueva comuna
          nuevaComuna.usuario = usuarioAsociado;
          //Se crea el nuevo documento a partir del objeto comuna
          const documentoComuna = new Comuna(nuevaComuna);
          //Se asocia la comuna al usuario
          usuarioAsociado.comuna = documentoComuna;
          //Se guardan ambos
          await usuarioAsociado.save();
          await documentoComuna.save();
          //Si todo tuvo exito se regresa la id de la nueva comuna
          return res.status(200).json({ id: documentoComuna._id });
        } else {
          //Se crea el nuevo documento a partir del objeto comuna
          const documentoComuna = new Comuna(nuevaComuna);
          //Se guarda el nuevo documento
          await documentoComuna.save();
          //Si todo tuvo exito se regresa la id de la nueva comuna
          return res.status(200).json({ id: documentoComuna._id });
        }
      }
    }),
  ];
