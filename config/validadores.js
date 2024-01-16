const CC = require("../modelos/cc");
const Usuario = require("../modelos/usuario");
const Opcion = require("../modelos/opcion");
const { DateTime } = require("luxon");

exports.cedulaExiste = async function (valorCedula) {
  const cedulaExiste = await Usuario.findOne({ cedula: valorCedula }).exec();
  if (cedulaExiste) {
    return true;
  } else {
    throw new Error("La cedula proporcionada no existe");
  }
};

exports.cedulaNoRepetida = async function (valorCedula, { req }) {
  const cedulaExiste = await Usuario.findOne({
    cedula: valorCedula,
    _id: { $ne: req.params.id },
  }).exec();
  if (cedulaExiste) {
    throw new Error("La cedula ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.cedulaNueva = async function (valorCedula) {
  const cedulaExiste = await Usuario.findOne({ cedula: valorCedula }).exec();
  if (cedulaExiste) {
    throw new Error("La cedula ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.cedulaTienePatronValido = function (valorCedula) {
  const expresionRegular = new RegExp(`^[V|E]-[0-9]{5,9}$`);

  if (expresionRegular.test(valorCedula)) {
    return true;
  } else {
    throw new Error(`La cedula tiene un patron invalido`);
  }
};

exports.emailNoRepetido = async function (valorEmail, { req }) {
  const emailExiste = await Usuario.findOne({
    email: valorEmail,
    _id: { $ne: req.params.id },
  }).exec();
  if (emailExiste) {
    throw new Error("El correo electronico ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.emailNuevo = async function (valorEmail) {
  const emailExiste = await Usuario.findOne({ email: valorEmail }).exec();
  if (emailExiste) {
    throw new Error("El correo electronico ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.fechaValida = function (valorFecha) {
  const miFecha = DateTime.fromISO(valorFecha);
  const fechaMinima = DateTime.fromISO("2020-01-01").startOf("day");
  const fechaMaxima = DateTime.now().endOf("day");
  if (miFecha < fechaMinima) {
    throw new Error("La fecha no puede ser anterior al 2020");
  }
  if (miFecha > fechaMaxima) {
    throw new Error("La fecha excede el limite permitido");
  }
  return true;
};

exports.sanearFecha = function (valorFecha) {
  let miFecha = DateTime.fromISO(valorFecha);

  if (!miFecha.isValid) {
    miFecha = DateTime.fromJSDate(new Date());
  }

  return miFecha.setZone("UTC").toISODate();
};

exports.nombreUsuarioNoRepetido = async function (valorUsuario, { req }) {
  const usuarioExiste = await Usuario.findOne({
    usuario: valorUsuario,
    _id: { $ne: req.params.id },
  }).exec();
  if (usuarioExiste) {
    throw new Error("El nombre de usuario ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.nombreUsuarioNuevo = async function (valorUsuario) {
  const usuarioExiste = await Usuario.findOne({ usuario: valorUsuario }).exec();
  if (usuarioExiste) {
    throw new Error("El nombre de usuario ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.siturExiste = async function (valorSitur) {
  const siturExiste = await CC.findOne({ situr: valorSitur }).exec();
  if (siturExiste) {
    return true;
  } else {
    throw new Error("El situr proporcionado no existe");
  }
};

exports.siturNoRepetido = async function (valorSitur, { req }) {
  const siturExiste = await CC.findOne({
    situr: valorSitur,
    _id: { $ne: req.params.id },
  }).exec();
  if (siturExiste) {
    throw new Error("El situr ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.siturNuevo = async function (valorSitur) {
  const siturExiste = await CC.findOne({ situr: valorSitur }).exec();
  if (siturExiste) {
    throw new Error("El situr ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.siturTienePatronValido = function (valorSitur, { req }) {
  /* jshint ignore:start */
  const primerCaracter =
    req.body.tipo === "INDIGENA" ? "I" : req.body.tipo === "RURAL" ? "R" : "U";
  const expresionRegular = new RegExp(
    `^${primerCaracter}-CCO-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{5}$`
  );
  /* jshint ignore:end */

  if (expresionRegular.test(valorSitur)) {
    return true;
  } else {
    throw new Error(
      `El situr debe tener el patron ${primerCaracter}-CCO-99-99-99-99999`
    );
  }
};

exports.tlfNoRepetido = async function (valorTlf, { req }) {
  const tlfExiste = await Usuario.findOne({
    tlf: valorTlf,
    _id: { $ne: req.params.id },
  }).exec();
  if (tlfExiste) {
    throw new Error("El telefono ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.tlfNuevo = async function (valorTlf) {
  const tlfExiste = await Usuario.findOne({ tlf: valorTlf }).exec();
  if (tlfExiste) {
    throw new Error("El telefono ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.usuarioReportaCC = async function (idCC, { req }) {
  //Revisar esto
  const usuarioReportaCC = req.user.cc.find(
    (usrCC) => usrCC._id.toString() === idCC.toString()
  );
  const esAdmin = req.user.rol === "ADMINISTRADOR";

  if (usuarioReportaCC || esAdmin) {
    return true;
  } else {
    throw new Error("El usuario no tiene acceso al consejo comunal");
  }
};

exports.validarCampo = function (uri) {
  return async function (valorCampo) {
    //Revisar esto
    const campoValido = await Opcion.findOne({
      campo: uri,
      array: { $in: [valorCampo] },
    }).exec();

    if (campoValido) {
      return true;
    } else {
      throw new Error("Valor invalido");
    }
  };
};
