const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Usuario = require("../modelos/usuario");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
require("dotenv").config();

exports.registrarUsuario =
  //Se validan los campos
  [
    body("usuario")
      .trim()
      .isLength({ min: 1 })
      .withMessage("El nombre de usuario no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El nombre de usuario no debe exceder los 30 caracteres")
      .bail()
      .custom(async function (valorUsuario) {
        const usuarioExiste = await Usuario.findOne({ usuario: valorUsuario });
        if (usuarioExiste) {
          throw new Error("El nombre de usuario ya se encuentra en uso");
        } else {
          return true;
        }
      }),
    body("clave", "Debe introducir una contraseña")
      .exists()
      .isLength({ min: 1 }),
    body("clave2", "Las contraseñas no coinciden")
      .exists()
      .custom(function (valorClave2, { req }) {
        return valorClave2 === req.body.clave;
      }),
    //Se ejecuta despues de validados los campos
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Se crea el objeto usuario (pero no se guarda aun)
      const nuevoUsuario = {
        usuario: req.body.usuario,
      };

      if (!errores.isEmpty()) {
        //Si hubieron errores
        return res.status(400).json({
          usuario: nuevoUsuario,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si no hubieron errores, encripto la clave
        const claveEncriptada = await bcryptjs.hash(req.body.clave, 10);
        //Si hubo un error encriptando la clave
        if (!claveEncriptada) {
          return res.status(502).json({
            usuario: nuevoUsuario,
            error: {
              message: "Error creando el hash de la clave",
            },
          });
        } else {
          nuevoUsuario.clave = claveEncriptada;
          const usuarioFinal = new Usuario(nuevoUsuario);
          await usuarioFinal.save();
          return res.status(200).json({ success: true });
        }
      }
    }),
  ];
exports.autenticarUsuario = asyncHandler(async function (req, res, next) {
  //Se extrae el usuario y la clave del post
  const { usuario, clave } = req.body;
  //Se busca el usuario por el nombre
  const nuevoUsuario = await Usuario.findOne({ usuario: usuario });

  if (!nuevoUsuario) {
    //Si no se encontro un usuario que concuerde con el nombre, se manda error
    return res.status(400).json({
      error: {
        message: "Nombre de usuario incorrecto",
      },
    });
  } else {
    //Si se encontro un usuario, se comparan las contraseñas
    const usuarioAutenticado = await bcryptjs.compare(
      clave,
      nuevoUsuario.clave
    );
    if (!usuarioAutenticado) {
      //Si no concordaron las claves
      return res.status(400).json({
        error: {
          message: "Clave incorrecta",
        },
      });
    } else {
      //Si las claves concordaron se genera el token
      const token = jwt.sign(
        { _id: nuevoUsuario._id },
        process.env.CLAVE_SECRETA,
        { expiresIn: "12h" }
      );
      //Se manda el token a la respuesta
      return res.status(200).json({
        token,
      });
    }
  }
});
exports.buscarUsuario = asyncHandler(async function (req, res, next) {
  //Funcion solo para desarrollo
  const nuevoUsuario = await Usuario.findById(req.params.id).exec();
  if (nuevoUsuario === null) {
    return res
      .status(404)
      .json({ error: { message: "No se encontro el usuario" } });
  } else {
    return res.status(200).json(nuevoUsuario);
  }
});
exports.listarUsuarios = asyncHandler(async function (req, res, next) {
  //Funcion solo para desarrollo
  const listaDeUsuarios = await Usuario.find({}).exec();

  if (listaDeUsuarios.length > 0) {
    return res.status(200).json(listaDeUsuarios);
  } else {
    return res.status(502).json({ error: { message: "Lista vacia" } });
  }
});
exports.actualizarUsuario = asyncHandler(async function (req, res, next) {
  /* NO IMPLEMENTADO AUN*/
});
exports.borrarUsuario = asyncHandler(async function (req, res, next) {
  /* NO IMPLEMENTADO AUN*/
});
