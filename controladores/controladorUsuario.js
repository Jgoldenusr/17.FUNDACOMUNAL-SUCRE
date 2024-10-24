const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const Comuna = require("../modelos/comuna");
const Usuario = require("../modelos/usuario");
const Validar = require("../config/validadores");
require("dotenv").config();

exports.actualizarUsuario =
  //Se validan los campos
  [
    body("cedula")
      .trim()
      .custom(Validar.cedulaTienePatronValido)
      .bail()
      .custom(Validar.cedulaNoRepetida),
    body("nombre")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un nombre")
      .bail()
      .isLength({ max: 20 })
      .withMessage("El nombre no debe exceder los 20 caracteres")
      .bail()
      .isAlpha()
      .withMessage("El nombre solo debe incluir letras")
      .toUpperCase(),
    body("apellido")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un apellido")
      .bail()
      .isLength({ max: 20 })
      .withMessage("El apellido no debe exceder los 20 caracteres")
      .bail()
      .isAlpha()
      .withMessage("El apellido solo debe incluir letras")
      .toUpperCase(),
    body("tlf")
      .trim()
      .escape()
      .isLength({ min: 11, max: 11 })
      .withMessage("Debe especificar un numero telefonico valido")
      .bail()
      .isNumeric({ no_symbols: true })
      .withMessage("El numero telefonico no debe incluir simbolos ni letras")
      .bail()
      .custom(Validar.tlfNoRepetido),
    body("email")
      .trim()
      .escape()
      .isLength({ max: 50 })
      .withMessage("El correo electronico no puede exceder los 50 caracteres")
      .bail()
      .isEmail()
      .withMessage("El correo electronico no posee un formato valido")
      .bail()
      .custom(Validar.emailNoRepetido),
    body("rol", "Rol del usuario invalido")
      .trim()
      .isIn(["PROMOTOR", "ADMINISTRADOR", "ESPECIAL"]),
    body("usuario")
      .trim()
      .escape()
      .isLength({ min: 5 })
      .withMessage("El nombre de usuario debe tener minimo 5 caracteres")
      .bail()
      .isLength({ max: 20 })
      .withMessage("El nombre de usuario no debe exceder los 20 caracteres")
      .bail()
      .custom(Validar.nombreUsuarioNoRepetido),
    body("clave")
      .optional({ values: "falsy" })
      .isLength({ min: 5 })
      .withMessage("La clave debe tener minimo 5 caracteres")
      .bail()
      .isLength({ max: 30 })
      .withMessage("La clave no debe exceder los 30 caracteres")
      .bail()
      .custom(function (valorClave, { req }) {
        if (valorClave === req.body.clave2) {
          return true;
        } else {
          throw new Error("Las claves que introdujo no coinciden");
        }
      }),
    body("clave2")
      .optional({ values: "falsy" })
      .custom(function (valorClave2, { req }) {
        if (valorClave2 === req.body.clave) {
          return true;
        } else {
          throw new Error("Las claves que introdujo no coinciden");
        }
      }),
    //Esta funcion se ejecuta despues de validados los campos
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea un objeto con los datos del usuario
      const nuevoUsuario = {
        _id: req.params.id,
        activo: true,
        apellido: req.body.apellido,
        cedula: req.body.cedula,
        email: req.body.email,
        nombre: req.body.nombre,
        rol: req.body.rol,
        tlf: req.body.tlf,
        usuario: req.body.usuario,
      };

      if (!errores.isEmpty()) {
        //Si hubieron errores en el proceso de validacion se regresa un arreglo de ellos
        //Tambien se regresan los datos introducidos por el usuario
        return res.status(400).json({
          usuario: nuevoUsuario,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si no hubieron errores
        if (req.body.clave) {
          //Si se proporciono una nueva clave, se encripta
          const claveEncriptada = await bcryptjs.hash(req.body.clave, 10);
          nuevoUsuario.clave = claveEncriptada;
        }
        //Se actualiza la comuna asociada al usuario
        await Comuna.findOneAndUpdate(
          { "usuario._id": req.params.id },
          { $set: { usuario: nuevoUsuario } }
        ).exec();
        //Se actualiza el usuario
        await Usuario.findByIdAndUpdate(req.params.id, {
          $set: nuevoUsuario,
        }).exec();
        //Si todo salio bien se regresa la id del usuario actualizado
        return res.status(200).json({ id: req.params.id });
      }
    }),
  ];

exports.borrarUsuario = asyncHandler(async function (req, res, next) {
  //Se busca el usuario a borrar
  const UsuarioABorrar = await Usuario.findById(req.params.id).exec();
  //Si es interno
  if (UsuarioABorrar === null) {
    return res
      .status(404)
      .json({ error: { message: "Usuario no encontrado" } });
  } else if (UsuarioABorrar.activo === false) {
    //Se verifica si 'UsuarioABorrar' esta eliminado
    return res.status(404).json({
      error: { message: "El usuario fue eliminado" },
    });
  } else {
    //Se actualizan TODAS las comunas asociadas al usuario
    await Comuna.findOneAndUpdate(
      { "usuario._id": req.params.id },
      { $unset: { usuario: "" } }
    ).exec();
    //La propiedad activo se cambia a falso
    await UsuarioABorrar.updateOne({
      $set: { activo: false },
      $unset: { comuna: "", cedula: "", email: "", tlf: "", usuario: "" },
    }).exec();
    //Exito
    return res.status(200).json({ id: req.params.id });
  }
});

exports.buscarUsuario = asyncHandler(async function (req, res, next) {
  //Se busca el usuario (por el parametro pasado por url)
  const usr = await Usuario.findById(req.params.id, "-clave").exec();
  //La funcion anterior no falla cuando no encuentra nada, sino que regresa null
  if (usr === null) {
    //Si el usuario es nulo
    return res
      .status(404)
      .json({ error: { message: "No se encontro el usuario" } });
  } else if (usr.activo === false) {
    //Se verifica si 'usr' esta eliminado
    return res.status(404).json({
      error: { message: "El usuario fue eliminado" },
    });
  } else {
    //Si no es nulo
    return res.status(200).json(usr);
  }
});

exports.denegado = function (req, res) {
  return res.status(401).json({
    error: {
      message: "Acceso denegado, inicie sesion con credenciales validas",
    },
  });
};

exports.iniciarSesion = asyncHandler(async function (req, res, next) {
  //Se extrae el usuario y la clave del post
  const { usuario, clave } = req.body;
  //Se busca el usuario por el nombre
  const usr = await Usuario.findOne({ usuario: usuario }).exec();

  if (!usr) {
    //Si no se encontro un usuario que concuerde con el nombre, se manda error
    return res.status(400).json({
      error: {
        message: "Nombre de usuario o clave erronea",
      },
    });
  } else if (usr.activo === false) {
    //Se verifica si 'usr' esta eliminado
    return res.status(404).json({
      error: { message: "La cuenta del usuario fue eliminada" },
    });
  } else {
    //Si se encontro un usuario, se comparan las contraseñas
    const usuarioAutenticado = await bcryptjs.compare(clave, usr.clave);
    if (!usuarioAutenticado) {
      //Si no concordaron las claves
      return res.status(400).json({
        error: {
          message: "Clave incorrecta",
        },
      });
    } else {
      //Si las claves concordaron se genera el token
      //El token contiene la id del usuario y su clave encriptada
      const token = jwt.sign(
        { _id: usr._id, clave: usr.clave },
        process.env.CLAVE_SECRETA
      );
      //Si todo tuvo exito
      return res.status(200).json({
        apellido: usr.apellido,
        cedula: usr.cedula,
        id: usr._id,
        nombre: usr.nombre,
        rol: usr.rol,
        token,
      });
    }
  }
});

exports.listarUsuarios = asyncHandler(async function (req, res, next) {
  const { apellido, cedula, nombre, p, rol, usuario } = req.query; //se extraen los parametros de la consulta
  let parametros = { _id: { $ne: req.user._id }, activo: true };

  if (apellido) {
    //Se agrega el filtro de apellido
    parametros.apellido = apellido;
  }
  if (cedula) {
    //Se agrega el filtro de cedula
    parametros.cedula = cedula;
  }
  if (nombre) {
    //Se agrega el filtro de nombre
    parametros.nombre = nombre;
  }
  if (rol) {
    //Se agrega el filtro de rol
    parametros.rol = rol;
  }
  if (usuario) {
    //Se agrega el filtro de usuario
    parametros.usuario = usuario;
  }
  //Se buscan segun los parametros
  const listaDeUsuarios = await Usuario.paginate(parametros, {
    limit: 15,
    page: parseInt(p, 10) || 1,
    projection: "apellido cedula nombre rol comuna._id",
  });

  if (listaDeUsuarios.docs.length > 0) {
    //Si el arreglo no esta vacio
    return res.status(200).json(listaDeUsuarios);
  } else {
    //Si el arreglo esta vacio
    return res
      .status(502)
      .json({ error: { message: "No se encontro ningun resultado" } });
  }
});

exports.miCuenta = asyncHandler(async function (req, res, next) {
  //Se busca el usuario por la id del token
  const usr = await Usuario.findById(req.user._id, "-clave").exec();
  //La funcion anterior no falla cuando no encuentra nada, sino que regresa null
  if (usr === null) {
    //Si el usuario es nulo
    return res
      .status(404)
      .json({ error: { message: "No se encontro el usuario" } });
  } else {
    //Si no es nulo
    return res.status(200).json(usr);
  }
});

exports.registrarUsuario =
  //Se validan los campos
  [
    body("cedula")
      .trim()
      .custom(Validar.cedulaTienePatronValido)
      .bail()
      .custom(Validar.cedulaNueva),
    body("nombre")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un nombre")
      .bail()
      .isLength({ max: 20 })
      .withMessage("El nombre no debe exceder los 20 caracteres")
      .bail()
      .isAlpha()
      .withMessage("El nombre solo debe incluir letras")
      .toUpperCase(),
    body("apellido")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un apellido")
      .bail()
      .isLength({ max: 20 })
      .withMessage("El apellido no debe exceder los 20 caracteres")
      .bail()
      .isAlpha()
      .withMessage("El apellido solo debe incluir letras")
      .toUpperCase(),
    body("tlf")
      .trim()
      .escape()
      .isLength({ min: 11, max: 11 })
      .withMessage("Debe especificar un numero telefonico valido")
      .bail()
      .isNumeric({ no_symbols: true })
      .withMessage("El numero telefonico no debe incluir simbolos ni letras")
      .bail()
      .custom(Validar.tlfNuevo),
    body("email")
      .trim()
      .escape()
      .isLength({ max: 50 })
      .withMessage("El correo electronico no puede exceder los 50 caracteres")
      .bail()
      .isEmail()
      .withMessage("El correo electronico no posee un formato valido")
      .bail()
      .custom(Validar.emailNuevo),
    body("rol", "Rol del usuario invalido")
      .trim()
      .isIn(["PROMOTOR", "ADMINISTRADOR", "ESPECIAL"]),
    body("usuario")
      .trim()
      .escape()
      .isLength({ min: 5 })
      .withMessage("El nombre de usuario debe tener minimo 5 caracteres")
      .bail()
      .isLength({ max: 20 })
      .withMessage("El nombre de usuario no debe exceder los 20 caracteres")
      .bail()
      .custom(Validar.nombreUsuarioNuevo),
    body("clave")
      .isLength({ min: 5 })
      .withMessage("La clave debe tener minimo 5 caracteres")
      .bail()
      .isLength({ max: 30 })
      .withMessage("La clave no debe exceder los 30 caracteres"),
    body("clave2", "Las claves que introdujo no coinciden").custom(function (
      valorClave2,
      { req }
    ) {
      return valorClave2 === req.body.clave;
    }),
    //Esta funcion se ejecuta despues de validados los campos
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea un objeto con los datos del usuario
      const nuevoUsuario = {
        activo: true,
        apellido: req.body.apellido,
        cedula: req.body.cedula,
        email: req.body.email,
        nombre: req.body.nombre,
        rol: req.body.rol,
        tlf: req.body.tlf,
        usuario: req.body.usuario,
      };

      if (!errores.isEmpty()) {
        //Si hubieron errores en el proceso de validacion se regresa un arreglo de ellos
        //Tambien se regresan los datos introducidos por el usuario
        return res.status(400).json({
          usuario: nuevoUsuario,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si no hubieron errores, se encripta la clave
        const claveEncriptada = await bcryptjs.hash(req.body.clave, 10);
        nuevoUsuario.clave = claveEncriptada;
        //Se crea el nuevo documento con los datos del nuevo usuario
        const documentoUsuario = new Usuario(nuevoUsuario);
        //Se guarda el nuevo documento
        await documentoUsuario.save();
        //Si todo tuvo exito se regresa la id del nuevo usuario
        return res.status(200).json({ id: documentoUsuario._id });
      }
    }),
  ];
