const formularioVacioCC = {
  usuario: { cedula: "" },
  comuna: "",
  estados: "SUCRE",
  localidad: "",
  municipios: "",
  nombre: "",
  parroquias: "",
  redi: "ORIENTAL",
  situr: "",
  tipo: "",
};

const formularioVacioUsuario = {
  apellido: "",
  cedula: "",
  clave: "",
  clave2: "",
  email: "",
  nombre: "",
  rol: "PROMOTOR",
  tlf: "",
  usuario: "",
};

const formularioReporteBase = {
  cc: "",
  fecha: "",
  organosAdscritos: "",
  usuario: "",
};

const formularioCasoAdmin = {
  ...formularioReporteBase,
  caso: "",
  tipoCaso: "",
};

const formularioComunicaciones = {
  ...formularioReporteBase,
  prensa: {
    notas: "",
    resenas: "",
  },
  redes: [
    {
      cuenta: "",
      publicaciones: "",
    },
  ],
};

const formularioFormacion = {
  ...formularioReporteBase,
  beneficiados: {
    hombres: "",
    mujeres: "",
  },
  estrategia: "",
  modalidad: "",
  tematica: "",
  verificacion: "",
};

const formularioFortalecimiento = {
  ...formularioReporteBase,
  acompanamiento: "",
  nombreOSP: "",
  tipoActividad: "",
  tipoOSP: "",
  proyectoCFG: {
    etapa: "",
    tipo: "",
  },
};

const formularioIncidencias = {
  ...formularioReporteBase,
  areaSustantiva: "",
  tipoIncidencia: "",
};

const formularioParticipacion = {
  ...formularioReporteBase,
  acompanamiento: "",
  familiasBeneficiadas: "",
};

export {
  formularioVacioCC,
  formularioVacioUsuario,
  formularioReporteBase,
  formularioCasoAdmin,
  formularioComunicaciones,
  formularioFormacion,
  formularioFortalecimiento,
  formularioIncidencias,
  formularioParticipacion,
};
