const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Comuna = require("../modelos/comuna");
const CC = require("../modelos/cc");
const Usuario = require("../modelos/usuario");
const Validar = require("../config/validadores");

exports.actualizarComuna =
  //Se validan los campos
  [
    body("usuario.cedula")
      .trim()
      .custom(Validar.cedulaTienePatronValido)
      .bail()
      .custom(Validar.cedulaExiste),
    body("estados", "El estado es invalido")
      .trim()
      .isIn([
        "AMAZONAS",
        "ANZOATEGUI",
        "APURE",
        "ARAGUA",
        "BARINAS",
        "BOLIVAR",
        "CARABOBO",
        "COJEDES",
        "DELTA AMACURO",
        "FALCON",
        "GUARICO",
        "LARA",
        "MERIDA",
        "MIRANDA",
        "MONAGAS",
        "NUEVA ESPARTA",
        "PORTUGUESA",
        "SUCRE",
        "TACHIRA",
        "TRUJILLO",
        "LA GUAIRA",
        "YARACUY",
        "ZULIA",
      ]),
    body("municipios")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'municipios' no debe estar vacio")
      .bail()
      .isLength({ max: 60 })
      .withMessage("El campo 'municipios' no debe exceder los 60 caracteres")
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
    body("parroquias")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'parroquias' no debe estar vacio")
      .bail()
      .isLength({ max: 60 })
      .withMessage("El campo 'parroquias' no debe exceder los 60 caracteres")
      .toUpperCase(),
    body("situr")
      .trim()
      .custom(Validar.siturComunaTienePatronValido)
      .bail()
      .custom(Validar.siturComunaNoRepetido),
    body("tipo").trim().custom(Validar.validarCampo("comuna/tipo")),
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
        if (miComuna.usuario.cedula != req.body.usuario.cedula) {
          //Se busca el usuario viejo y se edita
          await Usuario.findOneAndUpdate(
            {
              cedula: miComuna.usuario.cedula,
            },
            { $unset: { comuna: "" } }
          ).exec();
        }
        //Se buscan y eliminan referencias a la cedula en otras comunas excepto esta misma
        await Comuna.updateMany(
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
        //Se actualizan TODOS los consejos comunales asociados a la comuna
        await CC.updateMany(
          { "comuna._id": req.params.id },
          { $set: { comuna: nuevaComuna } }
        ).exec();
        //Se agrega el usuario a la comuna
        nuevaComuna.usuario = usuarioAsociado;
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
    await Usuario.findOneAndUpdate(
      {
        cedula: ComunaABorrar.usuario.cedula,
      },
      { $unset: { comuna: "" } }
    ).exec();
    //Se buscan los CC asociados y se eliminan sus comunas
    await CC.updateMany(
      { "comuna._id": req.params.id },
      { $unset: { comuna: "" } }
    ).exec();
    //La propiedad activo se cambia a falso
    await ComunaABorrar.updateOne({
      $set: { activo: false },
      $unset: { cc: "", situr: "", usuario: "" },
    }).exec();
    //Exito
    return res.status(200).json({ id: req.params.id });
  }
});

exports.buscarComuna = asyncHandler(async function (req, res, next) {
  //Se busca la comuna (por el parametro pasado por url)
  const miComuna = await Comuna.findById(req.params.id).exec();
  //La funcion anterior no falla cuando no encuentra nada, sino que regresa null
  if (miComuna === null) {
    //Si el resultado es nulo, se manda el error
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
  const { municipios, p, parroquias, situr, tipo } = req.query; //se extraen los parametros de la consulta
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
  //Busca todas las comunas segun los parametros y los regresa en un arreglo
  const listaComunas = await Comuna.paginate(parametros, {
    limit: 10,
    page: parseInt(p, 10) || 1,
  });

  if (listaComunas.docs.length > 0) {
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
    body("usuario.cedula")
      .trim()
      .custom(Validar.cedulaTienePatronValido)
      .bail()
      .custom(Validar.cedulaExiste),
    body("estados", "El estado es invalido")
      .trim()
      .isIn([
        "AMAZONAS",
        "ANZOATEGUI",
        "APURE",
        "ARAGUA",
        "BARINAS",
        "BOLIVAR",
        "CARABOBO",
        "COJEDES",
        "DELTA AMACURO",
        "FALCON",
        "GUARICO",
        "LARA",
        "MERIDA",
        "MIRANDA",
        "MONAGAS",
        "NUEVA ESPARTA",
        "PORTUGUESA",
        "SUCRE",
        "TACHIRA",
        "TRUJILLO",
        "LA GUAIRA",
        "YARACUY",
        "ZULIA",
      ]),
    body("municipios")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'municipios' no debe estar vacio")
      .bail()
      .isLength({ max: 60 })
      .withMessage("El campo 'municipios' no debe exceder los 60 caracteres")
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
    body("parroquias")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("El campo 'parroquias' no debe estar vacio")
      .bail()
      .isLength({ max: 60 })
      .withMessage("El campo 'parroquias' no debe exceder los 60 caracteres")
      .toUpperCase(),
    body("situr")
      .trim()
      .custom(Validar.siturComunaTienePatronValido)
      .bail()
      .custom(Validar.siturComunaNuevo),
    body("tipo").trim().custom(Validar.validarCampo("comuna/tipo")), //CONFIG PENDIENTEEEEE
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
        //Se buscan y eliminan referencias a la cedula en otras comunas
        await Comuna.updateMany(
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
      }
    }),
  ];
