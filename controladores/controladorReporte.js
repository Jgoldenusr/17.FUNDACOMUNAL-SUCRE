const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Reporte = require("../modelos/reporte");
const ReporteCasoAdmin = require("../modelos/reporteCasoAdmin");
const ReporteComunicaciones = require("../modelos/reporteComunicaciones");
const ReporteFormacion = require("../modelos/reporteFormacion");
const ReporteFortalecimiento = require("../modelos/reporteFortalecimiento");
const ReporteIncidencias = require("../modelos/reporteIncidencias");
//const ReporteInterno = require("../modelos/reporteInterno");
const ReporteParticipacion = require("../modelos/reporteParticipacion");
const Validar = require("../config/validadores");
const mongoose = require("mongoose");

exports.borrarReporte = asyncHandler(async function (req, res, next) {
  await Reporte.findByIdAndRemove(req.params.id).exec();
  return res.status(200).json(req.params.id);
});

exports.buscarReporte = asyncHandler(async function (req, res, next) {
  const { poblar } = req.query; //se extraen los parametros de la consulta
  //Se arma la consulta inicial
  let consulta = Reporte.findById(req.params.id);
  //Solo se poblaran los campos de la consulta en funcion de los parametros
  if (poblar) {
    consulta.populate("cc").populate("usuario");
  }
  const nuevoReporte = await consulta.exec();
  //La funcion findByID no falla cuando no encuentra nada, sino que regresa null
  if (nuevoReporte === null) {
    //Se verifica si 'nuevoReporte' es nulo
    return res
      .status(404)
      .json({ error: { message: "No se encontro el reporte" } });
  } else {
    //Si no es nulo, se envia una respuesta exitosa
    return res.status(200).json(nuevoReporte);
  }
});

exports.estadisticas = asyncHandler(async function (req, res, next) {
  const { desde, hasta, idusr, idcc } = req.query; //se extraen los parametros de la CONSULTA
  let parametros = {};
  //Se va agregando los parametros de la agregacion si aplican
  if (desde && hasta) {
    parametros.fecha = { $gte: new Date(desde), $lte: new Date(hasta) };
  }
  if (idusr) {
    parametros.usuario = { $eq: new mongoose.Types.ObjectId(idusr) };
  }
  if (idcc) {
    parametros.cc = { $eq: new mongoose.Types.ObjectId(idcc) };
  }
  //se construye la consulta
  const conteoReportes = await Reporte.aggregate()
    .match(parametros)
    .addFields({
      fecha: {
        $dateToString: { format: "%Y-%m-%d", date: "$fecha" },
      },
    })
    .group({ _id: "$fecha", reportes: { $count: {} } })
    .project({ _id: 0, fecha: "$_id", reportes: 1 })
    .sort({ fecha: 1 })
    .exec();
  return res.status(200).json(conteoReportes);
});

exports.listarReportes = asyncHandler(async function (req, res, next) {
  const { desde, hasta, idcc, idusr } = req.query; //se extraen los parametros de la consulta
  let parametros = {};

  if (desde && hasta) {
    //Se agrega el filtro de fecha
    parametros.fecha = {
      $gte: new Date(desde),
      $lt: new Date(hasta),
    };
  }
  if (idcc) {
    //Se agrega el filtro de tipo
    parametros.cc = idcc;
  }
  if (idusr) {
    //Se agrega el filtro de usuario
    parametros.usuario = idusr;
  }

  //Se buscan todos los reportes segun los mas recientes
  const listaDeReportes = await Reporte.find(parametros)
    .populate("cc", "nombre")
    .populate("usuario", "nombre apellido")
    .sort({ fecha: -1 })
    .exec();
  //Los resultados de la busqueda se meten en un arreglo
  if (listaDeReportes.length > 0) {
    //El arreglo no esta vacio
    return res.status(200).json(listaDeReportes);
  } else {
    //El arreglo esta vacio
    return res.status(502).json({ error: { message: "Lista vacia" } });
  }
});

exports.nuevoParticipacion = [
  body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
  body("cc")
    .trim()
    .isMongoId()
    .withMessage("La id proporcionada es invalida")
    .bail()
    .custom(Validar.usuarioReportaCC),
  body("organosAdscritos")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'organos adscritos' no debe estar vacio")
    .bail()
    .isLength({ max: 30 })
    .withMessage("El campo 'organos adscritos' debe ser menor a 30 caracteres")
    .toUpperCase(),
  body("acompanamiento", "Acompanamiento invalido")
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
      "ELABORACION DE LA AGENDA CONCRETA DE ACCION (ACA)",
      "PROCESO FORMATIVO MUNICIPAL A.C.A",
      "PROCESO FORMATIVO MUNICIPAL PARA EL REGISTRO DE LOS CONSEJOS COMUNALES",
      "PROCESOS FORMATIVOS MUNICIPAL ELECTORALES",
      "LEVANTAMIENTO CARTOGRAFICO",
      "PROCESAMIENTO CARTOGRAFICO (DIGITALIZACION DE MAPA)",
      "ELABORACION DE LA CARTOGRAFIA COMUNALES",
    ]),
  body("familiasBeneficiadas")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El campo 'familias beneficiadas' debe ser mayor a 0")
    .bail()
    .isInt({ max: 999999999 })
    .withMessage("El campo 'familias beneficiadas' excede la cifra maxima"),
  //Se ejecuta despues de validados los campos
  asyncHandler(async function (req, res, next) {
    //Los errores de la validacion se pasan a esta constante
    const errores = validationResult(req);
    //Se crea un objeto del nuevo reporte
    const nuevoReporte = {
      cc: req.body.cc,
      fecha: req.body.fecha || undefined,
      organosAdscritos: req.body.organosAdscritos,
      usuario: req.user._id,
      acompanamiento: req.body.acompanamiento,
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
      //Si no hubieron errores
      const reporteFinal = new ReporteParticipacion(nuevoReporte);
      //Finalmente se guarda
      await reporteFinal.save(); //Se guarda
      return res.status(200).json({ id: reporteFinal._id });
    }
  }),
];

exports.actualizarParticipacion = [
  body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
  body("cc")
    .trim()
    .isMongoId()
    .withMessage("La id proporcionada es invalida")
    .bail()
    .custom(Validar.usuarioReportaCC),
  body("organosAdscritos")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'organos adscritos' no debe estar vacio")
    .bail()
    .isLength({ max: 30 })
    .withMessage("El campo 'organos adscritos' debe ser menor a 30 caracteres")
    .toUpperCase(),
  body("acompanamiento", "Acompanamiento invalido")
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
      "ELABORACION DE LA AGENDA CONCRETA DE ACCION (ACA)",
      "PROCESO FORMATIVO MUNICIPAL A.C.A",
      "PROCESO FORMATIVO MUNICIPAL PARA EL REGISTRO DE LOS CONSEJOS COMUNALES",
      "PROCESOS FORMATIVOS MUNICIPAL ELECTORALES",
      "LEVANTAMIENTO CARTOGRAFICO",
      "PROCESAMIENTO CARTOGRAFICO (DIGITALIZACION DE MAPA)",
      "ELABORACION DE LA CARTOGRAFIA COMUNALES",
    ]),
  body("familiasBeneficiadas")
    .trim()
    .isInt({ min: 1 })
    .withMessage("El campo 'familias beneficiadas' debe ser mayor a 0")
    .bail()
    .isInt({ max: 999999999 })
    .withMessage("El campo 'familias beneficiadas' excede la cifra maxima"),
  //Se ejecuta despues de validados los campos
  asyncHandler(async function (req, res, next) {
    //Los errores de la validacion se pasan a esta constante
    const errores = validationResult(req);
    //Se crea un objeto del nuevo reporte
    const nuevoReporte = {
      cc: req.body.cc,
      fecha: req.body.fecha || undefined,
      organosAdscritos: req.body.organosAdscritos,
      usuario: req.user._id,
      acompanamiento: req.body.acompanamiento,
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
      //Si no hubieron errores
      //Se actualiza el reporte
      await ReporteParticipacion.findByIdAndUpdate(req.params.id, {
        $set: nuevoReporte,
      }).exec();
      //Exito
      return res.status(200).json({ id: req.params.id });
    }
  }),
];

exports.nuevoFormacion = [
  body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
  body("cc")
    .trim()
    .isMongoId()
    .withMessage("La id proporcionada es invalida")
    .bail()
    .custom(Validar.usuarioReportaCC),
  body("organosAdscritos")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'organos adscritos' no debe estar vacio")
    .bail()
    .isLength({ max: 30 })
    .withMessage("El campo 'organos adscritos' debe ser menor a 30 caracteres")
    .toUpperCase(),
  body("beneficiados.hombres")
    .trim()
    .isInt({ min: 0 })
    .withMessage("El campo 'hombres' no puede ser menor a 0")
    .bail()
    .isInt({ max: 999999999 })
    .withMessage("El campo 'hombres' excede la cifra maxima"),
  body("beneficiados.mujeres")
    .trim()
    .isInt({ min: 0 })
    .withMessage("El campo 'mujeres' no puede ser menor a 0")
    .bail()
    .isInt({ max: 999999999 })
    .withMessage("El campo 'mujeres' excede la cifra maxima"),
  body("estrategia", "Estrategia invalida")
    .trim()
    .isIn([
      "TALLER",
      "CHARLA",
      "CONVERSATORIO",
      "CAPACITACION",
      "MESA DE TRABAJO",
      "FORO",
      "SEMINARIO",
      "INDUCCION",
      "VIDEO CONFERENCIA",
    ]),
  body("modalidad", "Modalidad invalida")
    .trim()
    .isIn(["PRESENCIAL", "VIRTUAL", "MIXTA"]),
  body("tematica", "Tematica invalida")
    .trim()
    .isIn([
      "3R.NETS",
      "COLECTIVO DE COORDINACION COMUNITARIA",
      "PLAN PATRIA COMUNAL O PLAN DE DESARROLLO COMUNITARIO",
      "SISTEMA ECONOMICO COMUNAL",
      "REGISTRO DE CONSEJOS COMUNALES",
      "CARTOGRAFIA COMUNAL",
      "COMISION ELECTORAL PERMANENTE",
      "COMISION ELECTORAL PROVISIONAL",
      "FUNCIONES DE VOCERIAS, COMITES Y MESAS TECNICAS",
      "LEYES DE ORGANIZACION COMUNAL",
      "PROCESO FORMATIVO MUNICIPAL A.C.A",
      "PROCESO FORMATIVO MUNICIPAL PARA EL REGISTROS DE LOS CONSEJOS COMUNALES",
      "PROCESOS FORMATIVOS MUNICIPAL ELECTORALES",
    ]),
  body("verificacion", "Verificacion invalida")
    .trim()
    .isIn(["LISTA DE ASISTENCIA", "FOTOGRAFIA", "AMBOS", "NINGUNO"]),
  //Se ejecuta despues de validados los campos
  asyncHandler(async function (req, res, next) {
    //Los errores de la validacion se pasan a esta constante
    const errores = validationResult(req);
    //Se crea un objeto del nuevo reporte
    const nuevoReporte = {
      cc: req.body.cc,
      fecha: req.body.fecha || undefined,
      organosAdscritos: req.body.organosAdscritos,
      usuario: req.user._id,
      beneficiados: {
        hombres: req.body.beneficiados.hombres,
        mujeres: req.body.beneficiados.mujeres,
      },
      estrategia: req.body.estrategia,
      modalidad: req.body.modalidad,
      tematica: req.body.tematica,
      verificacion: req.body.verificacion,
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
      const reporteFinal = new ReporteFormacion(nuevoReporte);
      //Finalmente se guarda
      await reporteFinal.save(); //Se guarda
      return res.status(200).json({ id: reporteFinal._id });
    }
  }),
];

exports.actualizarFormacion = [
  body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
  body("cc")
    .trim()
    .isMongoId()
    .withMessage("La id proporcionada es invalida")
    .bail()
    .custom(Validar.usuarioReportaCC),
  body("organosAdscritos")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'organos adscritos' no debe estar vacio")
    .bail()
    .isLength({ max: 30 })
    .withMessage("El campo 'organos adscritos' debe ser menor a 30 caracteres")
    .toUpperCase(),
  body("beneficiados.hombres")
    .trim()
    .isInt({ min: 0 })
    .withMessage("El campo 'hombres' no puede ser menor a 0")
    .bail()
    .isInt({ max: 999999999 })
    .withMessage("El campo 'hombres' excede la cifra maxima"),
  body("beneficiados.mujeres")
    .trim()
    .isInt({ min: 0 })
    .withMessage("El campo 'mujeres' no puede ser menor a 0")
    .bail()
    .isInt({ max: 999999999 })
    .withMessage("El campo 'mujeres' excede la cifra maxima"),
  body("estrategia", "Estrategia invalida")
    .trim()
    .isIn([
      "TALLER",
      "CHARLA",
      "CONVERSATORIO",
      "CAPACITACION",
      "MESA DE TRABAJO",
      "FORO",
      "SEMINARIO",
      "INDUCCION",
      "VIDEO CONFERENCIA",
    ]),
  body("modalidad", "Modalidad invalida")
    .trim()
    .isIn(["PRESENCIAL", "VIRTUAL", "MIXTA"]),
  body("tematica", "Tematica invalida")
    .trim()
    .isIn([
      "3R.NETS",
      "COLECTIVO DE COORDINACION COMUNITARIA",
      "PLAN PATRIA COMUNAL O PLAN DE DESARROLLO COMUNITARIO",
      "SISTEMA ECONOMICO COMUNAL",
      "REGISTRO DE CONSEJOS COMUNALES",
      "CARTOGRAFIA COMUNAL",
      "COMISION ELECTORAL PERMANENTE",
      "COMISION ELECTORAL PROVISIONAL",
      "FUNCIONES DE VOCERIAS, COMITES Y MESAS TECNICAS",
      "LEYES DE ORGANIZACION COMUNAL",
      "PROCESO FORMATIVO MUNICIPAL A.C.A",
      "PROCESO FORMATIVO MUNICIPAL PARA EL REGISTROS DE LOS CONSEJOS COMUNALES",
      "PROCESOS FORMATIVOS MUNICIPAL ELECTORALES",
    ]),
  body("verificacion", "Verificacion invalida")
    .trim()
    .isIn(["LISTA DE ASISTENCIA", "FOTOGRAFIA", "AMBOS", "NINGUNO"]),
  //Se ejecuta despues de validados los campos
  asyncHandler(async function (req, res, next) {
    //Los errores de la validacion se pasan a esta constante
    const errores = validationResult(req);
    //Se crea un objeto del nuevo reporte
    const nuevoReporte = {
      cc: req.body.cc,
      fecha: req.body.fecha || undefined,
      organosAdscritos: req.body.organosAdscritos,
      usuario: req.user._id,
      beneficiados: {
        hombres: req.body.beneficiados.hombres,
        mujeres: req.body.beneficiados.mujeres,
      },
      estrategia: req.body.estrategia,
      modalidad: req.body.modalidad,
      tematica: req.body.tematica,
      verificacion: req.body.verificacion,
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
      //Se actualiza el reporte
      await ReporteFormacion.findByIdAndUpdate(req.params.id, {
        $set: nuevoReporte,
      }).exec();
      //Exito
      return res.status(200).json({ id: req.params.id });
    }
  }),
];

exports.nuevoFortalecimiento = [
  body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
  body("cc")
    .trim()
    .isMongoId()
    .withMessage("La id proporcionada es invalida")
    .bail()
    .custom(Validar.usuarioReportaCC),
  body("organosAdscritos")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'organos adscritos' no debe estar vacio")
    .bail()
    .isLength({ max: 30 })
    .withMessage("El campo 'organos adscritos' debe ser menor a 30 caracteres")
    .toUpperCase(),
  body("acompanamiento", "Acompanamiento invalido")
    .trim()
    .isIn([
      "COMITE DE ECONOMIA COMUNAL PARA LA ACTIVACION DE (OSP)",
      "MESAS DEL CONSEJO DE ECONOMIA",
      "ELABORACION DE PLANES PRODUCTIVOS",
      "FUNCIONAMIENTO O REIMPULSO DE (UPF)",
      "FUNCIONAMIENTO O REIMPULSO DE (EPS)",
      "PROYECTOS DEL CONSEJO FEDERAL DE GOBIERNO (CFG)",
      "FUNCIONAMIENTO O REIMPULSO DE EMPRENDEDORES",
      "FUNCIONAMIENTO O REIMPULSO DE COOPERATIVAS",
      "GRUPO DE INTERCAMBIO SOLIDARIO",
      "PROCESO DE ASAMBLEA PARA APROBACION DE PROYECTO",
      "PLAN SIEMBRA",
      "PROYECTOS DE VIVEROS",
      "PLAN TESTIL",
      "PLAN CONUCO Y CEREALES",
      "CONSTRUCCION DEL CIRCUITO ECONOMICO ESTADAL",
      "IDENTIFICACION DE LAS EXPERIENCIAS PRODUCTIVAS",
    ]),
  body("nombreOSP")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'nombreOSP' no debe estar vacio")
    .bail()
    .isLength({ max: 100 })
    .withMessage("El campo 'nombreOSP' no debe exceder los 100 caracteres")
    .toUpperCase(),
  body("tipoActividad", "Tipo de actividad economica invalido")
    .trim()
    .isIn([
      "AGROPECUARIA",
      "SERVICIO DE ADMINISTRACION PUBLICA",
      "INDUSTRIA MANU FACTURERA",
      "ESTABLECIMIENTO FINANCIERO",
      "CONSTRUCCION",
      "ELECTRICIDAD, GAS Y AGUA",
      "MINERALES METALICOS Y NO METALICOS",
      "PETROLEO CRUDO Y GAS NATURAL",
      "COMERCIO",
      "OTROS SERVICIOS",
      "COMUNICACIONES",
      "TRANSPORTE Y ALMACENAMIENTO",
    ]),
  body("tipoOSP", "Tipo de organizacion socioproductiva invalido")
    .trim()
    .isIn([
      "CONSEJO COMUNAL",
      "UNIDAD DE PRODUCCION FAMILIAR",
      "EMPRESA DE PRODUCCION SOCIAL DIRECTA",
      "EMPRESA DE PRODUCCION SOCIAL INDIRECTA",
      "EMPRESA DE PRODUCCION SOCIAL MIXTA",
      "EMPRENDEDORES",
      "GRUPO DE INTERCAMBIO SOLIDARIO",
      "COOPERATIVAS",
    ]),
  body("proyectoCFG.tipo", "Tipo de proyecto CFG invalido")
    .optional({ values: "falsy" })
    .trim()
    .isIn([
      "AMBIENTAL",
      "CULTURAL",
      "DEPORTIVO",
      "EDUCACION",
      "ELECTRICIDAD",
      "INFRAESTRUCTURA MARITIMA, FLUVIAL Y LA ACUICULTURA",
      "MANEJO INTEGRAL DEL AGUA",
      "MUROS",
      "PROCESOS INDUSTRIALES",
      "SALUD",
      "SERVICIOS PRODUCTIVOS",
      "SISTEMA DE PRODUCCION AGRICOLA",
      "SISTEMAS AGROPECUARIOS",
      "VIALIDAD",
      "VIVIENDA",
    ]),
  body("proyectoCFG.etapa", "Etapa del proyecto CFG invalida")
    .optional({ values: "falsy" })
    .trim()
    .isIn(["ETAPA 1", "ETAPA 2", "ETAPA 3", "CULMINADO"]),
  //Se ejecuta despues de validados los campos
  asyncHandler(async function (req, res, next) {
    //Los errores de la validacion se pasan a esta constante
    const errores = validationResult(req);
    //Se crea un objeto del nuevo reporte
    const nuevoReporte = {
      cc: req.body.cc,
      fecha: req.body.fecha || undefined,
      organosAdscritos: req.body.organosAdscritos,
      usuario: req.user._id,
      acompanamiento: req.body.acompanamiento,
      nombreOSP: req.body.nombreOSP,
      tipoActividad: req.body.tipoActividad,
      tipoOSP: req.body.tipoOSP,
      proyectoCFG: {
        etapa: req.body.proyectoCFG.etapa,
        tipo: req.body.proyectoCFG.tipo,
      },
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
      const reporteFinal = new ReporteFortalecimiento(nuevoReporte);
      //Finalmente se guarda
      await reporteFinal.save(); //Se guarda
      return res.status(200).json({ id: reporteFinal._id });
    }
  }),
];

exports.actualizarFortalecimiento = [
  body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
  body("cc")
    .trim()
    .isMongoId()
    .withMessage("La id proporcionada es invalida")
    .bail()
    .custom(Validar.usuarioReportaCC),
  body("organosAdscritos")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'organos adscritos' no debe estar vacio")
    .bail()
    .isLength({ max: 30 })
    .withMessage("El campo 'organos adscritos' debe ser menor a 30 caracteres")
    .toUpperCase(),
  body("acompanamiento", "Acompanamiento invalido")
    .trim()
    .isIn([
      "COMITE DE ECONOMIA COMUNAL PARA LA ACTIVACION DE (OSP)",
      "MESAS DEL CONSEJO DE ECONOMIA",
      "ELABORACION DE PLANES PRODUCTIVOS",
      "FUNCIONAMIENTO O REIMPULSO DE (UPF)",
      "FUNCIONAMIENTO O REIMPULSO DE (EPS)",
      "PROYECTOS DEL CONSEJO FEDERAL DE GOBIERNO (CFG)",
      "FUNCIONAMIENTO O REIMPULSO DE EMPRENDEDORES",
      "FUNCIONAMIENTO O REIMPULSO DE COOPERATIVAS",
      "GRUPO DE INTERCAMBIO SOLIDARIO",
      "PROCESO DE ASAMBLEA PARA APROBACION DE PROYECTO",
      "PLAN SIEMBRA",
      "PROYECTOS DE VIVEROS",
      "PLAN TESTIL",
      "PLAN CONUCO Y CEREALES",
      "CONSTRUCCION DEL CIRCUITO ECONOMICO ESTADAL",
      "IDENTIFICACION DE LAS EXPERIENCIAS PRODUCTIVAS",
    ]),
  body("nombreOSP")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'nombreOSP' no debe estar vacio")
    .bail()
    .isLength({ max: 100 })
    .withMessage("El campo 'nombreOSP' no debe exceder los 100 caracteres")
    .toUpperCase(),
  body("tipoActividad", "Tipo de actividad economica invalido")
    .trim()
    .isIn([
      "AGROPECUARIA",
      "SERVICIO DE ADMINISTRACION PUBLICA",
      "INDUSTRIA MANU FACTURERA",
      "ESTABLECIMIENTO FINANCIERO",
      "CONSTRUCCION",
      "ELECTRICIDAD, GAS Y AGUA",
      "MINERALES METALICOS Y NO METALICOS",
      "PETROLEO CRUDO Y GAS NATURAL",
      "COMERCIO",
      "OTROS SERVICIOS",
      "COMUNICACIONES",
      "TRANSPORTE Y ALMACENAMIENTO",
    ]),
  body("tipoOSP", "Tipo de organizacion socioproductiva invalido")
    .trim()
    .isIn([
      "CONSEJO COMUNAL",
      "UNIDAD DE PRODUCCION FAMILIAR",
      "EMPRESA DE PRODUCCION SOCIAL DIRECTA",
      "EMPRESA DE PRODUCCION SOCIAL INDIRECTA",
      "EMPRESA DE PRODUCCION SOCIAL MIXTA",
      "EMPRENDEDORES",
      "GRUPO DE INTERCAMBIO SOLIDARIO",
      "COOPERATIVAS",
    ]),
  body("proyectoCFG.tipo", "Tipo de proyecto CFG invalido")
    .optional({ values: "falsy" })
    .trim()
    .isIn([
      "AMBIENTAL",
      "CULTURAL",
      "DEPORTIVO",
      "EDUCACION",
      "ELECTRICIDAD",
      "INFRAESTRUCTURA MARITIMA, FLUVIAL Y LA ACUICULTURA",
      "MANEJO INTEGRAL DEL AGUA",
      "MUROS",
      "PROCESOS INDUSTRIALES",
      "SALUD",
      "SERVICIOS PRODUCTIVOS",
      "SISTEMA DE PRODUCCION AGRICOLA",
      "SISTEMAS AGROPECUARIOS",
      "VIALIDAD",
      "VIVIENDA",
    ]),
  body("proyectoCFG.etapa", "Etapa del proyecto CFG invalida")
    .optional({ values: "falsy" })
    .trim()
    .isIn(["ETAPA 1", "ETAPA 2", "ETAPA 3", "CULMINADO"]),
  //Se ejecuta despues de validados los campos
  asyncHandler(async function (req, res, next) {
    //Los errores de la validacion se pasan a esta constante
    const errores = validationResult(req);
    //Se crea un objeto del nuevo reporte
    const nuevoReporte = {
      cc: req.body.cc,
      fecha: req.body.fecha || undefined,
      organosAdscritos: req.body.organosAdscritos,
      usuario: req.user._id,
      acompanamiento: req.body.acompanamiento,
      nombreOSP: req.body.nombreOSP,
      tipoActividad: req.body.tipoActividad,
      tipoOSP: req.body.tipoOSP,
      proyectoCFG: {
        etapa: req.body.proyectoCFG.etapa,
        tipo: req.body.proyectoCFG.tipo,
      },
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
      //Se actualiza el reporte
      await ReporteFortalecimiento.findByIdAndUpdate(req.params.id, {
        $set: nuevoReporte,
      }).exec();
      //Exito
      return res.status(200).json({ id: req.params.id });
    }
  }),
];

exports.nuevoIncidencias = [
  body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
  body("cc")
    .trim()
    .isMongoId()
    .withMessage("La id proporcionada es invalida")
    .bail()
    .custom(Validar.usuarioReportaCC),
  body("organosAdscritos")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'organos adscritos' no debe estar vacio")
    .bail()
    .isLength({ max: 30 })
    .withMessage("El campo 'organos adscritos' debe ser menor a 30 caracteres")
    .toUpperCase(),
  body("areaSustantiva", "Area sustantiva invalida")
    .trim()
    .isIn(["PARTICIPACION", "FORMACION", "FORTALECIMIENTO", "CARTOGRAFIA"]),
  body("tipoIncidencia")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'tipo de incidencia' no debe estar vacio")
    .bail()
    .isLength({ max: 100 })
    .withMessage(
      "El campo 'tipo de incidencia' debe ser menor a 100 caracteres"
    )
    .toUpperCase(),
  //Se ejecuta despues de validados los campos
  asyncHandler(async function (req, res, next) {
    //Los errores de la validacion se pasan a esta constante
    const errores = validationResult(req);
    //Se crea un objeto del nuevo reporte
    const nuevoReporte = {
      cc: req.body.cc,
      fecha: req.body.fecha || undefined,
      organosAdscritos: req.body.organosAdscritos,
      usuario: req.user._id,
      areaSustantiva: req.body.areaSustantiva,
      tipoIncidencia: req.body.tipoIncidencia,
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
      const reporteFinal = new ReporteIncidencias(nuevoReporte);
      //Finalmente se guarda
      await reporteFinal.save(); //Se guarda
      return res.status(200).json({ id: reporteFinal._id });
    }
  }),
];

exports.actualizarIncidencias = [
  body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
  body("cc")
    .trim()
    .isMongoId()
    .withMessage("La id proporcionada es invalida")
    .bail()
    .custom(Validar.usuarioReportaCC),
  body("organosAdscritos")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'organos adscritos' no debe estar vacio")
    .bail()
    .isLength({ max: 30 })
    .withMessage("El campo 'organos adscritos' debe ser menor a 30 caracteres")
    .toUpperCase(),
  body("areaSustantiva", "Area sustantiva invalida")
    .trim()
    .isIn(["PARTICIPACION", "FORMACION", "FORTALECIMIENTO", "CARTOGRAFIA"]),
  body("tipoIncidencia")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'tipo de incidencia' no debe estar vacio")
    .bail()
    .isLength({ max: 100 })
    .withMessage(
      "El campo 'tipo de incidencia' debe ser menor a 100 caracteres"
    )
    .toUpperCase(),
  //Se ejecuta despues de validados los campos
  asyncHandler(async function (req, res, next) {
    //Los errores de la validacion se pasan a esta constante
    const errores = validationResult(req);
    //Se crea un objeto del nuevo reporte
    const nuevoReporte = {
      cc: req.body.cc,
      fecha: req.body.fecha || undefined,
      organosAdscritos: req.body.organosAdscritos,
      usuario: req.user._id,
      areaSustantiva: req.body.areaSustantiva,
      tipoIncidencia: req.body.tipoIncidencia,
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
      //Se actualiza el reporte
      await ReporteIncidencias.findByIdAndUpdate(req.params.id, {
        $set: nuevoReporte,
      }).exec();
      //Exito
      return res.status(200).json({ id: req.params.id });
    }
  }),
];

exports.nuevoCasoAdmin = [
  body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
  body("cc")
    .trim()
    .isMongoId()
    .withMessage("La id proporcionada es invalida")
    .bail()
    .custom(Validar.usuarioReportaCC),
  body("organosAdscritos")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'organos adscritos' no debe estar vacio")
    .bail()
    .isLength({ max: 30 })
    .withMessage("El campo 'organos adscritos' debe ser menor a 30 caracteres")
    .toUpperCase(),
  body("caso")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'caso' no debe estar vacio")
    .bail()
    .isLength({ max: 100 })
    .withMessage("El campo 'caso' debe ser menor a 100 caracteres")
    .toUpperCase(),
  body("tipoCaso", "Tipo de caso administrativo invalido")
    .trim()
    .isIn(["CASO", "DENUNCIA", "ADMINISTRATIVO", "ASESORIA"]),
  //Se ejecuta despues de validados los campos
  asyncHandler(async function (req, res, next) {
    //Los errores de la validacion se pasan a esta constante
    const errores = validationResult(req);
    //Se crea un objeto del nuevo reporte
    const nuevoReporte = {
      cc: req.body.cc,
      fecha: req.body.fecha || undefined,
      organosAdscritos: req.body.organosAdscritos,
      usuario: req.user._id,
      caso: req.body.caso,
      tipoCaso: req.body.tipoCaso,
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
      const reporteFinal = new ReporteCasoAdmin(nuevoReporte);
      //Finalmente se guarda
      await reporteFinal.save(); //Se guarda
      return res.status(200).json({ id: reporteFinal._id });
    }
  }),
];

exports.actualizarCasoAdmin = [
  body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
  body("cc")
    .trim()
    .isMongoId()
    .withMessage("La id proporcionada es invalida")
    .bail()
    .custom(Validar.usuarioReportaCC),
  body("organosAdscritos")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'organos adscritos' no debe estar vacio")
    .bail()
    .isLength({ max: 30 })
    .withMessage("El campo 'organos adscritos' debe ser menor a 30 caracteres")
    .toUpperCase(),
  body("caso")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'caso' no debe estar vacio")
    .bail()
    .isLength({ max: 100 })
    .withMessage("El campo 'caso' debe ser menor a 100 caracteres")
    .toUpperCase(),
  body("tipoCaso", "Tipo de caso administrativo invalido")
    .trim()
    .isIn(["CASO", "DENUNCIA", "ADMINISTRATIVO", "ASESORIA"]),
  //Se ejecuta despues de validados los campos
  asyncHandler(async function (req, res, next) {
    //Los errores de la validacion se pasan a esta constante
    const errores = validationResult(req);
    //Esto es un objeto, mas no una instancia del modelo reporte
    const nuevoReporte = {
      cc: req.body.cc,
      fecha: req.body.fecha || undefined,
      organosAdscritos: req.body.organosAdscritos,
      usuario: req.user._id,
      caso: req.body.caso,
      tipoCaso: req.body.tipoCaso,
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
      //Se actualiza el reporte
      await ReporteCasoAdmin.findByIdAndUpdate(req.params.id, {
        $set: nuevoReporte,
      }).exec();
      //Exito
      return res.status(200).json({ id: req.params.id });
    }
  }),
];

exports.nuevoComunicaciones = [
  body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
  body("cc")
    .trim()
    .isMongoId()
    .withMessage("La id proporcionada es invalida")
    .bail()
    .custom(Validar.usuarioReportaCC),
  body("organosAdscritos")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'organos adscritos' no debe estar vacio")
    .bail()
    .isLength({ max: 30 })
    .withMessage("El campo 'organos adscritos' debe ser menor a 30 caracteres")
    .toUpperCase(),
  body("prensa.notas")
    .optional({ values: "falsy" })
    .trim()
    .isInt({ min: 1 })
    .withMessage("El campo 'notas' debe ser mayor a 0")
    .bail()
    .isInt({ max: 999999999 })
    .withMessage("El campo 'notas' excede la cifra maxima"),
  body("prensa.resenas")
    .optional({ values: "falsy" })
    .trim()
    .isInt({ min: 1 })
    .withMessage("El campo 'resenas' debe ser mayor a 0")
    .bail()
    .isInt({ max: 999999999 })
    .withMessage("El campo 'resenas' excede la cifra maxima"),
  body("redes.*.publicaciones")
    .optional({ values: "falsy" })
    .trim()
    .isInt({ min: 1 })
    .withMessage("Las publicaciones deben ser mayores a 0")
    .bail()
    .isInt({ max: 999999999 })
    .withMessage("Las publicaciones exceden la cifra maxima"),
  body("redes.*.cuenta")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'cuenta' no debe estar vacio"),
  //Se ejecuta despues de validados los campos
  asyncHandler(async function (req, res, next) {
    //Los errores de la validacion se pasan a esta constante
    const errores = validationResult(req);
    //Se crea un objeto del nuevo reporte
    const nuevoReporte = {
      cc: req.body.cc,
      fecha: req.body.fecha || undefined,
      organosAdscritos: req.body.organosAdscritos,
      usuario: req.user._id,
      prensa: {
        notas: req.body.prensa.notas,
        resenas: req.body.prensa.resenas,
      },
      redes: [...req.body.redes],
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
      const reporteFinal = new ReporteComunicaciones(nuevoReporte);
      //Finalmente se guarda
      await reporteFinal.save(); //Se guarda
      return res.status(200).json({ id: reporteFinal._id });
    }
  }),
];

exports.actualizarComunicaciones = [
  body("fecha").optional({ values: "falsy" }).isISO8601().toDate(),
  body("cc")
    .trim()
    .isMongoId()
    .withMessage("La id proporcionada es invalida")
    .bail()
    .custom(Validar.usuarioReportaCC),
  body("organosAdscritos")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'organos adscritos' no debe estar vacio")
    .bail()
    .isLength({ max: 30 })
    .withMessage("El campo 'organos adscritos' debe ser menor a 30 caracteres")
    .toUpperCase(),
  body("prensa.notas")
    .optional({ values: "falsy" })
    .trim()
    .isInt({ min: 1 })
    .withMessage("El campo 'notas' debe ser mayor a 0")
    .bail()
    .isInt({ max: 999999999 })
    .withMessage("El campo 'notas' excede la cifra maxima"),
  body("prensa.resenas")
    .optional({ values: "falsy" })
    .trim()
    .isInt({ min: 1 })
    .withMessage("El campo 'resenas' debe ser mayor a 0")
    .bail()
    .isInt({ max: 999999999 })
    .withMessage("El campo 'resenas' excede la cifra maxima"),
  body("redes.*.publicaciones")
    .optional({ values: "falsy" })
    .trim()
    .isInt({ min: 1 })
    .withMessage("Las publicaciones deben ser mayores a 0")
    .bail()
    .isInt({ max: 999999999 })
    .withMessage("Las publicaciones exceden la cifra maxima"),
  body("redes.*.cuenta")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("El campo 'cuenta' no debe estar vacio"),
  //Se ejecuta despues de validados los campos
  asyncHandler(async function (req, res, next) {
    //Los errores de la validacion se pasan a esta constante
    const errores = validationResult(req);
    //Se crea un objeto del nuevo reporte
    const nuevoReporte = {
      cc: req.body.cc,
      fecha: req.body.fecha || undefined,
      organosAdscritos: req.body.organosAdscritos,
      usuario: req.user._id,
      prensa: {
        notas: req.body.prensa.notas,
        resenas: req.body.prensa.resenas,
      },
      redes: [...req.body.redes],
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
      //Se actualiza el reporte
      await ReporteComunicaciones.findByIdAndUpdate(req.params.id, {
        $set: nuevoReporte,
      }).exec();
      //Exito
      return res.status(200).json({ id: req.params.id });
    }
  }),
];
