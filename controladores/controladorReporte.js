const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const CC = require("../modelos/cc");
const Promotor = require("../modelos/promotor");
const Reporte = require("../modelos/reporte");

exports.listarReportes = asyncHandler(async function (req, res, next) {
  const listaDeReportes = await Reporte.find({})
    .populate("cc")
    .populate("promotor")
    .sort({ fecha: "-1" })
    .exec();

  if (listaDeReportes.length > 0) {
    //La lista no esta vacia.
    return res.status(200).json(listaDeReportes);
  } else {
    //La lista esta vacia.
    return res.status(502).json({ error: { message: "Lista vacia" } });
  }
});
exports.nuevoReporte =
  //Se validan los campos
  [
    body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
    body("cedula")
      .trim()
      .isInt({ min: 1 })
      .withMessage("La cedula debe ser un numero mayor a 0")
      .escape(),
    body("situr") //revisar si esta repetido y forzar con una regex
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'situr' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'situr' no debe exceder los 50 caracteres")
      .toUpperCase()
      .escape(),
    body("tipo", "Tipo no permitido")
      .optional({ values: "falsy" })
      .trim()
      .isIn(["PARTICIPACION"])
      .escape(),
    body("acompanamiento", "Acompanamiento no permitido")
      .optional({ values: "falsy" })
      .trim()
      .isIn([
        "ASAMBLEAS INFORMATIVAS PARA LA CONFORMACION DEL CONSEJO COMUNAL",
        "ASAMBLEAS PARA LA ESCOGENCIA DE LA COMISION ELECTORAL PERMANENTE",
        "PROCESO DE POSTULACION DE LAS VOCERIAS DEL CONSEJO COMUNAL",
        "PROCESO DE ELECCIONES DE VOCERIAS",
        "ASAMBLEA INFORMATIVA DEL EQUIPO PROMOTOR PROVISIONAL",
        "ELABORACION MAPA DE PROBLEMAS Y SOLUCIONES",
        "ASAMBLEA DE RENDICION DE CUENTA",
        "JURAMENTACION DE VOCERIAS ELECTAS",
        "ELABORACION DE PLAN DE DESARROLLO INTEGRAL COMUNITARIO O PLAN PATRIA COMUNAL",
        "ELECCIONES DE COMISIONES PROVISIONALES DE COMUNAS",
        "PROCESO DEL REFERENDUM DE CARTAS FUNDACIONALES",
        "MESA DE TRABAJO DE ALGUN COMITE",
        "ELABORACION DE LA AGENDA CONCRETA DE ACCION",
      ])
      .escape(),
    body("organosAdscritos")
      .optional({ values: "falsy" })
      .trim()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un organo adscrito")
      .isLength({ max: 30 })
      .withMessage("El campo organos adscritos no debe pasar las 30 letras")
      .toUpperCase()
      .escape(),
    body("familiasBeneficiadas")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Las familias deben ser mayores a 0")
      .escape(),
    //Se ejecuta despues de validados los campos
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Esto es un objeto, mas no una instancia del modelo reporte
      const nuevoReporte = {
        fecha: req.body.fecha,
        cedula: req.body.cedula,
        situr: req.body.situr,
        tipo: req.body.tipo,
        acompanamiento: req.body.acompanamiento,
        organosAdscritos: req.body.organosAdscritos,
        familiasBeneficiadas: req.body.familiasBeneficiadas,
      };

      if (!errores.isEmpty()) {
        //Si hubieron errores
        return res.status(400).json({
          reporte: nuevoReporte,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Se buscan las id de los respectivos documentos (por cedula y por situr)
        const [nuevoCC, nuevoPromotor] = await Promise.all([
          CC.findOne({ situr: req.body.situr }, "_id").exec(),
          Promotor.findOne({ cedula: req.body.cedula }, "_id").exec(),
        ]);
        if (!nuevoCC || !nuevoPromotor) {
          //Si algun valor es falso
          return res.status(400).json({
            reporte: nuevoReporte,
            error: {
              message: "Cedula o situr erroneo",
            },
          });
        } else {
          //Se asignan las id al reporte para poder crearlo
          nuevoReporte.cc = nuevoCC._id;
          nuevoReporte.promotor = nuevoPromotor._id;
          //Ahora si se crea el reporte
          const reporteFinal = new Reporte(nuevoReporte);
          //Finalmente se guarda
          await reporteFinal.save(); //Se guarda
          return res.status(200).json(reporteFinal);
        }
      }
    }),
  ];
exports.buscarReporte = asyncHandler(async function (req, res, next) {
  //Se busca el reporte por el parametro pasado por url
  const nuevoReporte = await Reporte.findById(req.params.id)
    .populate("cc")
    .populate("promotor")
    .exec();
  //La funcion anterior no falla cuando no encuentra nada, sino que regresa null
  if (nuevoReporte === null) {
    //Se verifica si 'nuevoReporte' es nulo y envia un mensaje endogeno
    return res
      .status(404)
      .json({ error: { message: "No se encontro el reporte" } });
  } else {
    //Si no es nulo, se envia una respuesta exitosa
    return res.status(200).json(nuevoReporte);
  }
});
exports.actualizarReporte =
  //Se validan los campos
  [
    body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
    body("cedula")
      .trim()
      .isInt({ min: 1 })
      .withMessage("La cedula debe ser un numero mayor a 0")
      .escape(),
    body("situr") //revisar si esta repetido y forzar con una regex
      .trim()
      .isLength({ min: 1 })
      .withMessage("El campo 'situr' no debe estar vacio")
      .isLength({ max: 30 })
      .withMessage("El campo 'situr' no debe exceder los 50 caracteres")
      .toUpperCase()
      .escape(),
    body("tipo", "Tipo no permitido")
      .optional({ values: "falsy" })
      .trim()
      .isIn(["PARTICIPACION"])
      .escape(),
    body("acompanamiento", "Acompanamiento no permitido")
      .optional({ values: "falsy" })
      .trim()
      .isIn([
        "ASAMBLEAS INFORMATIVAS PARA LA CONFORMACION DEL CONSEJO COMUNAL",
        "ASAMBLEAS PARA LA ESCOGENCIA DE LA COMISION ELECTORAL PERMANENTE",
        "PROCESO DE POSTULACION DE LAS VOCERIAS DEL CONSEJO COMUNAL",
        "PROCESO DE ELECCIONES DE VOCERIAS",
        "ASAMBLEA INFORMATIVA DEL EQUIPO PROMOTOR PROVISIONAL",
        "ELABORACION MAPA DE PROBLEMAS Y SOLUCIONES",
        "ASAMBLEA DE RENDICION DE CUENTA",
        "JURAMENTACION DE VOCERIAS ELECTAS",
        "ELABORACION DE PLAN DE DESARROLLO INTEGRAL COMUNITARIO O PLAN PATRIA COMUNAL",
        "ELECCIONES DE COMISIONES PROVISIONALES DE COMUNAS",
        "PROCESO DEL REFERENDUM DE CARTAS FUNDACIONALES",
        "MESA DE TRABAJO DE ALGUN COMITE",
        "ELABORACION DE LA AGENDA CONCRETA DE ACCION",
      ])
      .escape(),
    body("organosAdscritos")
      .optional({ values: "falsy" })
      .trim()
      .isLength({ min: 1 })
      .withMessage("Debe especificar un organo adscrito")
      .isLength({ max: 30 })
      .withMessage("El campo organos adscritos no debe pasar las 30 letras")
      .toUpperCase()
      .escape(),
    body("familiasBeneficiadas")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Las familias deben ser mayores a 0")
      .escape(),
    //Se ejecuta despues de validados los campos
    asyncHandler(async function (req, res, next) {
      //Los errores de la validacion se pasan a esta constante
      const errores = validationResult(req);
      //Esto es un objeto, mas no una instancia del modelo reporte
      const nuevoReporte = {
        fecha: req.body.fecha,
        cedula: req.body.cedula,
        situr: req.body.situr,
        tipo: req.body.tipo,
        acompanamiento: req.body.acompanamiento,
        organosAdscritos: req.body.organosAdscritos,
        familiasBeneficiadas: req.body.familiasBeneficiadas,
        _id: req.params.id,
      };

      if (!errores.isEmpty()) {
        //Si hubieron errores
        return res.status(400).json({
          reporte: nuevoReporte,
          error: {
            array: errores.array(),
            message: "Hubieron errores en el proceso de validacion",
          },
        });
      } else {
        //Si no hubieron errores
        //Se buscan las id de los respectivos documentos (por cedula y por situr)
        const [nuevoCC, nuevoPromotor] = await Promise.all([
          CC.findOne({ situr: req.body.situr }, "_id").exec(),
          Promotor.findOne({ cedula: req.body.cedula }, "_id").exec(),
        ]);
        if (!nuevoCC || !nuevoPromotor) {
          //Si algun valor es falso
          return res.status(400).json({
            reporte: nuevoReporte,
            error: {
              message: "Cedula o situr erroneo",
            },
          });
        } else {
          //Se asignan al nuevo reporte
          nuevoReporte.cc = nuevoCC._id;
          nuevoReporte.promotor = nuevoPromotor._id;
          //Ahora si se crea el reporte
          const reporteFinal = new Reporte(nuevoReporte);
          //Finalmente se actualiza
          await Reporte.findByIdAndUpdate(req.params.id, reporteFinal, {}); //Se actualiza
          return res.status(200).json(reporteFinal);
        }
      }
    }),
  ];
exports.borrarReporte = asyncHandler(async function (req, res, next) {
  await Reporte.findByIdAndRemove(req.params.id);
  return res.status(200).json(req.params.id);
});
