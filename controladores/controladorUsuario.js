const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const CC = require("../modelos/cc");
const Usuario = require("../modelos/usuario");
const Validar = require("../config/validadores");
require("dotenv").config();

exports.actualizarUsuario =
  //Se validan los campos
  [
    body("cedula")
      .trim()
      .isInt({ min: 1 })
      .withMessage("La cedula debe ser un numero mayor que 0")
      .isInt({ max: 999999999 })
      .withMessage("La cedula debe ser un numero menor que 999999999")
      .bail()
      .custom(Validar.cedulaNoRepetida),
    body("nombre")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un nombre")
      .isLength({ max: 20 })
      .withMessage("El nombre no debe exceder los 20 caracteres")
      .isAlpha()
      .withMessage("El nombre solo debe incluir letras")
      .toUpperCase(),
    body("apellido")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un apellido")
      .isLength({ max: 20 })
      .withMessage("El apellido no debe exceder los 20 caracteres")
      .isAlpha()
      .withMessage("El apellido solo debe incluir letras")
      .toUpperCase(),
    body("tlf")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un numero telefonico")
      .isLength({ max: 12 })
      .withMessage("El numero telefonico no debe exceder los 12 caracteres")
      .isNumeric({ no_symbols: true })
      .withMessage("El numero telefonico no debe incluir simbolos ni letras")
      .bail()
      .custom(Validar.tlfNoRepetido),
    body("email")
      .trim()
      .escape()
      .isLength({ max: 50 })
      .withMessage("El correo electronico no puede exceder los 50 caracteres")
      .isEmail()
      .withMessage("El correo electronico no posee un formato valido")
      .bail()
      .custom(Validar.emailNoRepetido),
    body("rol", "Rol del usuario invalido")
      .trim()
      .isIn(["PROMOTOR", "ADMINISTRADOR"]),
    body("usuario")
      .trim()
      .escape()
      .isLength({ min: 5 })
      .withMessage("El nombre de usuario debe tener minimo 5 caracteres")
      .isLength({ max: 15 })
      .withMessage("El nombre de usuario no debe exceder los 15 caracteres")
      .bail()
      .custom(Validar.nombreUsuarioNoRepetido),
    body("clave")
      .optional({ values: "falsy" })
      .isLength({ min: 5 })
      .withMessage("La clave debe tener minimo 5 caracteres")
      .isLength({ max: 30 })
      .withMessage("La clave no debe exceder los 30 caracteres")
      .bail()
      .custom(function (valorClave, { req }) {
        if (valorClave === req.body.clave2) {
          return true;
        } else {
          throw new Error("Las claves no coinciden");
        }
      }),
    body("clave2")
      .optional({ values: "falsy" })
      .custom(function (valorClave2, { req }) {
        if (valorClave2 === req.body.clave) {
          return true;
        } else {
          throw new Error("Las claves no coinciden");
        }
      }),
    //Esta funcion se ejecuta despues de validados los campos
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea un objeto con los datos del usuario
      const nuevoUsuario = {
        _id: req.params.id,
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
        //Se actualiza el usuario
        await Usuario.findByIdAndUpdate(req.params.id, {
          $set: nuevoUsuario,
        }).exec();
        //Se actualizan TODOS los consejos comunales asociados al usuario
        await CC.updateMany(
          { "usuario._id": req.params.id },
          { $set: { usuario: nuevoUsuario } }
        ).exec();
        //Si todo salio bien se regresa la id del CC actualizado
        return res.status(200).json({ id: req.params.id });
      }
    }),
  ];

exports.borrarUsuario = asyncHandler(async function (req, res, next) {
  /* NO IMPLEMENTADO AUN*/
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
  } else {
    //Si no es nulo
    return res.status(200).json(usr);
  }
});

exports.iniciarSesion = asyncHandler(async function (req, res, next) {
  //Se extrae el usuario y la clave del post
  const { usuario, clave } = req.body;
  //Se busca el usuario por el nombre
  const usr = await Usuario.findOne({ usuario: usuario }).exec();

  if (!usr) {
    //Si no se encontro un usuario que concuerde con el nombre, se manda error
    return res.status(400).json({
      error: {
        message: "Nombre de usuario incorrecto",
      },
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
        process.env.CLAVE_SECRETA,
        {
          expiresIn: "12h",
        }
      );
      //Si todo tuvo exito, se regresa el token junto con el usuario (menos la clave)
      usr.clave = undefined;
      return res.status(200).json({
        token,
        usr,
      });
    }
  }
});

exports.listarUsuarios = asyncHandler(async function (req, res, next) {
  //Se buscan todos los usuarios y se meten en un arreglo
  const listaDeUsuarios = await Usuario.find({}).exec();

  if (listaDeUsuarios.length > 0) {
    //Si el arreglo no esta vacio
    return res.status(200).json(listaDeUsuarios);
  } else {
    //Si el arreglo esta vacio
    return res.status(502).json({ error: { message: "Lista vacia" } });
  }
});

exports.registrarUsuario =
  //Se validan los campos
  [
    body("cedula")
      .trim()
      .isInt({ min: 1 })
      .withMessage("La cedula debe ser un numero mayor que 0")
      .isInt({ max: 999999999 })
      .withMessage("La cedula debe ser un numero menor que 999999999")
      .bail()
      .custom(Validar.cedulaNueva),
    body("nombre")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un nombre")
      .isLength({ max: 20 })
      .withMessage("El nombre no debe exceder los 20 caracteres")
      .isAlpha()
      .withMessage("El nombre solo debe incluir letras")
      .toUpperCase(),
    body("apellido")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un apellido")
      .isLength({ max: 20 })
      .withMessage("El apellido no debe exceder los 20 caracteres")
      .isAlpha()
      .withMessage("El apellido solo debe incluir letras")
      .toUpperCase(),
    body("tlf")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un numero telefonico")
      .isLength({ max: 12 })
      .withMessage("El numero telefonico no debe exceder los 12 caracteres")
      .isNumeric({ no_symbols: true })
      .withMessage("El numero telefonico no debe incluir simbolos ni letras")
      .bail()
      .custom(Validar.tlfNuevo),
    body("email")
      .trim()
      .escape()
      .isLength({ max: 50 })
      .withMessage("El correo electronico no puede exceder los 50 caracteres")
      .isEmail()
      .withMessage("El correo electronico no posee un formato valido")
      .bail()
      .custom(Validar.emailNuevo),
    body("rol", "Rol del usuario invalido")
      .trim()
      .isIn(["PROMOTOR", "ADMINISTRADOR"]),
    body("usuario")
      .trim()
      .escape()
      .isLength({ min: 5 })
      .withMessage("El nombre de usuario debe tener minimo 5 caracteres")
      .isLength({ max: 15 })
      .withMessage("El nombre de usuario no debe exceder los 15 caracteres")
      .bail()
      .custom(Validar.nombreUsuarioNuevo),
    body("clave")
      .isLength({ min: 5 })
      .withMessage("La clave debe tener minimo 5 caracteres")
      .isLength({ max: 30 })
      .withMessage("La clave no debe exceder los 30 caracteres"),
    body(
      "clave2",
      "Las contraseñas que introdujo no coinciden, verifique"
    ).custom(function (valorClave2, { req }) {
      return valorClave2 === req.body.clave;
    }),
    //Esta funcion se ejecuta despues de validados los campos
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea un objeto con los datos del usuario
      const nuevoUsuario = {
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
