const CC = require("../modelos/cc");
const Usuario = require("../modelos/usuario");

exports.cedulaExiste = async function (valorCedula) {
  const cedulaExiste = await Usuario.findOne({ cedula: valorCedula });
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
  });
  if (cedulaExiste) {
    throw new Error("La cedula ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.cedulaNueva = async function (valorCedula) {
  const cedulaExiste = await Usuario.findOne({ cedula: valorCedula });
  if (cedulaExiste) {
    throw new Error("La cedula ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.emailNoRepetido = async function (valorEmail, { req }) {
  const emailExiste = await Usuario.findOne({
    email: valorEmail,
    _id: { $ne: req.params.id },
  });
  if (emailExiste) {
    throw new Error("El correo electronico ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.emailNuevo = async function (valorEmail) {
  const emailExiste = await Usuario.findOne({ email: valorEmail });
  if (emailExiste) {
    throw new Error("El correo electronico ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.nombreUsuarioNoRepetido = async function (valorUsuario, { req }) {
  const usuarioExiste = await Usuario.findOne({
    usuario: valorUsuario,
    _id: { $ne: req.params.id },
  });
  if (usuarioExiste) {
    throw new Error("El nombre de usuario ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.nombreUsuarioNuevo = async function (valorUsuario) {
  const usuarioExiste = await Usuario.findOne({ usuario: valorUsuario });
  if (usuarioExiste) {
    throw new Error("El nombre de usuario ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.siturNoRepetido = async function (valorSitur, { req }) {
  const siturExiste = await CC.findOne({
    situr: valorSitur,
    _id: { $ne: req.params.id },
  });
  if (siturExiste) {
    throw new Error("El situr ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.siturNuevo = async function (valorSitur) {
  const siturExiste = await CC.findOne({ situr: valorSitur });
  if (siturExiste) {
    throw new Error("El situr ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.tlfNoRepetido = async function (valorTlf, { req }) {
  const tlfExiste = await Usuario.findOne({
    tlf: valorTlf,
    _id: { $ne: req.params.id },
  });
  if (tlfExiste) {
    throw new Error("El telefono ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.tlfNuevo = async function (valorTlf) {
  const tlfExiste = await Usuario.findOne({ tlf: valorTlf });
  if (tlfExiste) {
    throw new Error("El telefono ya se encuentra en uso");
  } else {
    return true;
  }
};

exports.siturValido = async function (situr, { req }) {
  /* jshint ignore:start */
  const prefijoSitur =
    req.body.tipo === "INDIGENA"
      ? "I-CCO-"
      : req.body.tipo === "RURAL"
      ? "R-CCO-"
      : req.body.tipo === "URBANO"
      ? "U-CCO-"
      : "";
  const expresionRegular = /^(R|U|I)-CCO-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{5}$/;
  const siturCompleto = prefijoSitur + situr;
  /* jshint ignore:end */

  if (expresionRegular.test(siturCompleto)) {
    return true;
  } else {
    throw new Error(
      "El situr debe tener el patron (R o U o I)-CCO-99-99-99-99999"
    );
  }
};
exports.usuarioReportaCC = async function (idCC, { req }) {
  const usuarioReportaCC = req.user.cc.find((usrCC) => usrCC._id == idCC);
  const esAdmin = req.user.rol === "ADMINISTRADOR";

  if (usuarioReportaCC || esAdmin) {
    return true;
  } else {
    throw new Error("El usuario no tiene acceso al consejo comunal");
  }
};
