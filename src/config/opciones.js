const OpcionesCC = {
  tipo: ["INDIGENA", "RURAL", "URBANO"],
  redi: [
    "ANDES",
    "CAPITAL",
    "CENTRAL",
    "GUAYANA",
    "INSULAR",
    "LLANOS",
    "OCCIDENTAL",
    "ORIENTAL",
  ],
  municipios: [
    "ANDRES ELOY BLANCO",
    "ANDRES MATA",
    "ARISMENDI",
    "BENITEZ",
    "BERMUDEZ",
    "BOLIVAR",
    "CAJIGAL",
    "CRUZ SALMERON ACOSTA",
    "LIBERTADOR",
    "MARIÑO",
    "MEJIA",
    "MONTES",
    "RIBERO",
    "SUCRE",
    "VALDEZ",
  ],
  parroquias: {
    ["ANDRES ELOY BLANCO"]: ["MARIÑO", "ROMULO GALLEGOS"],
    ["ANDRES MATA"]: ["SAN JOSE DE AEROCUAR", "TAVERA ACOSTA"],
    ["ARISMENDI"]: [
      "RIO CARIBE",
      "ANTONIO JOSE DE SUCRE",
      "EL MORRO DE PUERTO SANTO",
      "PUERTO SANTO",
      "SAN JUAN DE LAS GALDONAS",
    ],
    ["BENITEZ"]: [
      "EL PILAR",
      "EL RINCON",
      "GENERAL FRANCISCO ANTONIO VAZQUEZ",
      "GUARAUNOS",
      "TUNAPUICITO",
      "UNION",
    ],
    ["BERMUDEZ"]: [
      "SANTA CATALINA",
      "SANTA ROSA",
      "SANTA TERESA",
      "BOLIVAR",
      "MACARAPANA",
    ],
    ["BOLIVAR"]: ["MARIGUITAR"],
    ["CAJIGAL"]: ["LIBERTAD", "EL PAUJIL", "YAGUARAPARO"],
    ["CRUZ SALMERON ACOSTA"]: ["ARAYA", "CHACOPATA", "MANICUARE"],
    ["LIBERTADOR"]: ["TUNAPUY", "CAMPO ELIAS"],
    ["MARIÑO"]: [
      "IRAPA",
      "CAMPO CLARO",
      "MARAVAL",
      "SAN ANTONIO DE IRAPA",
      "SORO",
    ],
    ["MEJIA"]: ["MEJIA"],
    ["MONTES"]: [
      "CUMANACOA",
      "ARENAS",
      "ARICAGUA",
      "COCOLLAR",
      "SAN FERNANDO",
      "SAN LORENZO",
    ],
    ["RIBERO"]: [
      "VILLA FRONTADO",
      "CATUARO",
      "RENDON",
      "SANTA CRUZ",
      "SANTA MARIA",
    ],
    ["SUCRE"]: [
      "ALTAGRACIA",
      "SANTA INES",
      "VALENTIN VALIENTE",
      "AYACUCHO",
      "SAN JUAN",
      "RAUL LEONI",
      "GRAN MARISCAL",
    ],
    ["VALDEZ"]: ["CRISTOBAL COLON", "BIDEAU", "PUNTA DE PIEDRAS", "GUIRIA"],
  },
  comuna: {
    ["ALTAGRACIA"]: [
      "AGROECOLOGICA Y MINERA GRAN MARISCAL DE AYACUCHO",
      "SOCIOPRODUCTIVA Y DE SERVICIO ALIANZA REVOLUCIONARIA 2 Y 3",
      "SOCIOPRODUCTIVA EL LEGADO DEL COMANDANTE",
      "SOCIALISTA DE PRODUCCION INTEGRAL DEL SUR MARISCAL SUCRE",
      "SOCIOPRODUCTIVA COMANDANTE ETERNO POR SIEMPRE",
      "SOCIOPRODUCTIVA MAISANTA CORAZON DE CHAVEZ",
      "SOCIOPRODUCTIVA LA PATRIA GRANDE DE SUCRE",
      "SOCIOPRODUCTIVA TURISTICA LOS HIJOS DE CHAVEZ",
      "SOCIOPRODUCTIVA Y SERVICIOS TRES PICOS HUGO RAFAEL CHAVEZ FRIAS",
      "SOCIALISTA DE PRODUCCION Y SERVICIOS UN NUEVO AMANECER REVOLUCIONARIO ERNESTO CHE GUEVARA",
      "SOCIALISTA DE PRODUCCION Y SERVICIOS LA LUCHA ESFUERZO SOBERANO POR VENEZUELA",
      "COMUNA DE PRODUCCION Y SERVICIO ROBERT SERRA",
      "BOLIVARIANA REVOLUCIONARIA Y SOCIALISTA",
      "SOCIO-PRODUCTIVA SIMON BOLIVAR",
      "SOCIO PRODUCTIVA Y DE SERVICIOS BEBEDERO POTENCIA",
      "SOCIOPRODUCTIVA EQUIDAD JUSTICIA SOCIAL SAN LUIS GONZAGA",
      "COMUNA URBANA SOCIOPRODUCTIVA SEMILLEROS SOBERANO CANCAMURE",
      "SOCIO PRODUCTIVA Y DE SERVICIO 3 DE FEBRERO MARISCAL SUCRE",
      "COMUNA SOCIO PRODUCTIVA ECOLOGICA TURISTICA Y DE SERVICIO CASCO CENTRAL UNIDO",
      "SOCIOPRODUCTIVA DE BIENES Y SERVICIOS MAMA ROSA",
    ],
    ["ARAYA"]: [
      "COMUNA PESQUERA VIRGEN DEL VALLE GUERIMACHE",
      "SOCIO-PRODUCTIVA EMILIA HERNANDEZ",
      "SOCIO-PRODUCTIVA ANGEL HERNANDEZ",
      "SOCIO-PRODUCTIVA BRISAS MARINAS",
    ],
    ["ARENAS"]: [
      "CHAVEZ Y MADURO CONDUCTORES DE VICTORIA",
      "SOCIOPRODUCTIVA LAS 7 POTENCIAS AGRICOLAS",
      "AGROTURISTICA NUESTRA SEÑORA DE LA CANDELARIA",
    ],
    ["ARICAGUA"]: [
      "AGROTURISTICA NUESTRO ESFUERZO DEL EJE NRO 02",
      "COMUNA PRODUCTIVA RICAS AGUAS UNIDAS",
    ],
    ["AYACUCHO"]: [
      "AGROTURISTICA UNION DE ACTIVOS REPRESENTANTES DE BARBACOAS UDARBA",
      "AGRO-ARTE-TURISMO-PESQUERA VISTA MOCHIMA",
      "AGROPECUARIA EZEQUIEL ZAMORA",
      "AGROTURISTICA Y DE SERVICIO UNION EL TACAL",
      "SOCIOPRODUCTIVA TURISTICA Y PESQUERA VENCEDORES EN REVOLUCION DE SAN LUIS",
      "COMUNA SOCIALISTA SOCIOPRODUCTIVA CUMANAGOTO POTENCIA",
      "SOCIOPRODUCTIVA INTEGRACION GUERRERO DE AYACUCHO",
      "SOCIALISTA Y PRODUCTIVA LAZARO HERNANDEZ",
    ],
    ["BIDEAU"]: ["BOLIVAR CHAVEZ Y BIDEAU"],
    ["BOLIVAR"]: [
      "COMUNA SOCIALISTA AGROECOLOGICA TURISTICA GUACA TESORO ESCONDIDO",
      "SOCIALISTA AGRO-TURISTICA CHARALLAVE",
      "AGRO-TURISTICA PESQUERA EZEQUIEL ZAMORA",
      "AGRO-TURISTICA PESQUERA BAHIA LIBERTADORA",
      "SOCIALISTA PRODUCTIVA HUGO CHAVEZ",
      "PRODUCTIVA Y ECOLOGICA REVOLUCION SOCIALISTA UNIDOS POR UNA MISION",
      "ECOTURISTICA Y SOCIOPRODUCTIVA VECINOS Y VECINAS DE PLAYA GRANDE",
      "SOCIALISTA PRODUCTIVA Y ECOLOGICA SUEÑOS DEL COMANDANTE ETERNO",
      "ECO TURISTICA Y AGROPESQUERA CHAVEZ DEFENSOR DE LA PATRIA",
      "SOCIALISTA PRODUCTIVA Y TURISTICA GIGANTE DEL SUR",
    ],
    ["CAMPO CLARO"]: ["AGRO-TURISTICA-PESQUERA VIVIR BIEN"],
    ["CATUARO"]: ["EL SUEÑO DEL GIGANTE"],
    ["CHACOPATA"]: [
      "AGRO-PRODUCTIVA TURISTICA Y PESQUERA CHACOPATA SOMOS TODOS",
      "PESQUERA Y AGROPECUARIA POTENCIA CAIMANERA",
    ],
    ["COCOLLAR"]: [
      "SOCIO PRODUCTIVA COLINAS DEL TURIMIQUIRE",
      "PRODUCTIVA TURISTICA DOMINGO MONTES",
    ],
    ["CUMANACOA"]: [
      "LAS CINCO FORTALEZAS DE LA REVOLUCION BOLIVARIANA",
      "COMUNA SOCIALISTA PRODUCTIVA CHAVEZ POR SIEMPRE",
      "PRODUCTIVA REINALDO GUEVARA VILLAFRANCA",
      "SOCIALISTA PRODUCTIVA RIBERAS DEL MANZANARES",
      "SOCIOPRODUCTIVA PAZ Y VICTORIA EN REVOLUCION",
      "SOCIOPRODUCTIVA FRANCISCO DE MIRANDA",
      "COMUNA SOCIO PRODUCTIVA SIETE SOLES EN VICTORIA",
      "COMUNA SOCIOPRODUCTIVA KAYAURIMA",
    ],
    ["EL MORRO DE PUERTO SANTO"]: ["PESQUERA TURISTICA BAHIA EL MORRO"],
    ["EL PAUJIL"]: ["LOS SUEÑOS DE CHAVEZ"],
    ["EL PILAR"]: [
      "LA YAGUAINA",
      "AGRO-TURISTICA LAS MINAS DE BENITEZ",
      "EL PILAR DE MACUARE",
      "COMUNA AGRO-PRODUCTIVA-TURISTICA LOS MANANTIALES",
      "COMUNA AGROPROUCTIVA-PESQUERA-TURISTICA TURUEPANO",
    ],
    ["EL RINCON"]: ["SOCIOPRODUCTIVA LA PUERTA DE PARIA"],
    ["GRAN MARISCAL"]: [
      "AGROTURISTICA KARIÑA AMIGOS DE LA MONTAÑA",
      "INDIGENA KARIÑA AGROTURISTICA GRAN MARISCAL DE LOS ALTOS DE SUCRE",
      "AGROPRODUCTIVA INDIGENA KARIÑA SERRANIAS DEL TURIMIQUIRE",
    ],
    ["GUARAUNOS"]: [
      "AGROPRODUCTIVA GUARAUNO TIERRA DE HOMBRES Y MUJERES LIBRES",
    ],
    ["GUIRIA"]: [
      "INTEGRAL SOCIOPRODUCTIVA GUATAPANARE HUGO CHAVEZ",
      "SOCIOPRODUCTIVA INTEGRAL VALDEZ PETENCIA",
      "AGROECOLOGICA Y SOCIOPRODUCTIVA INTEGRAL LOS GUAYACANES DE VALDEZ",
      "AGROECOLOGICA Y SOCIOPRODUCTIVA INTEGRAL GENERACION DE ORO",
      "SOCIOPRODUCTIVA PASO CORONEL",
    ],
    ["IRAPA"]: ["COREMAR"],
    ["LIBERTAD"]: [
      "ALIANZA AGROECOLOGICA HUGO CHAVEZ",
      "CORAZON DE PARIA",
      "COMUNIDADES UNIDAS",
    ],
    ["MACARAPANA"]: ["AGRO-TURISTICA VALLE DE MACARAPANA"],
    ["MANICUARE"]: [
      "PESQUERA Y DE ARTESANIA MANICUARE AZUL DE CRUZ SALMERON ACOSTA",
      "AGRO-TURISTICA-LA AVANZADA PENINSULAR",
    ],
    ["MARIGUITAR"]: [
      "SOCIALISTA AGRO-PESQUERA TURISTICA CHAVEZ POR SIEMPRE",
      "AGROTURISTICA NUESTRO ESFUERZO EN REVOLUCION",
      "AGRO TURISTICA Y PESQUERA UNIDOS EN VICTORIA",
      "AGROPESQUERA TURISTICA COLINAS Y BRISAS COSTERA CORAZON DE CHAVEZ",
      "AGROPECUARIA TURISTICA PESQUERA Y DE SERVICIO LA AVANZADORA SOCIALISTA",
      "AGROPESQUERA ARTESANAL Y DE SERVICIOS INVENCIBLES COMO CHAVEZ",
      "AGROPESQUERA, CULTURAL Y DE SERVICIO GOLINDANO EN REVOLUCION",
      "4F VICTORIOSA",
      "AGROPECUARIA ARTESNAL Y ECOTURISTICA DARIO VIVE",
    ],
    ["MARIÑO"]: [
      "AGROSOCIALISTA ZONA ALTA EL SUEÑO DE CHAVEZ",
      "AGROTURISTICA LOS 9 GUERREROS UNIDOS EN REVOLUCION CON EL COMANDANTE CHAVEZ",
      "AGROTURISTICA RIO FIGUERA",
    ],
    ["MEJIA"]: [
      "AGROPESQUERA Y TURISTICA ALI PRIMERA DE PERICANTAR",
      "AGROPESQUERA TURISTICA TIERRA DE SUCRE",
      "AGROPRODUCTIVA EDERMINA FRANCO",
      "AGROECOLOGICA Y TURISTICA LA ESPERANZA DE MEJIA",
      "AGROPESQUERA Y TURISTICA SAN ANTONIO DE PADUA",
      "AGROPESQUERA Y TURISTICA VENCEDORES DE MEJIA",
      "AGROPESQUERA Y TURISTICA TODOS UNIDOS EN REVOLUCION",
      "AGROPECUARIA Y TURISTICA TIERRA DULCE DEL SOCIALISMO",
      "AGROPECUARIA Y TURISTICA REVOLUCIONARIOS DEL CARMEN",
    ],
    ["PUERTO SANTO"]: ["AGROPESQUERA ARTESANAL PUERTO SANTO"],
    ["PUNTA DE PIEDRAS"]: [
      "AGROECOLOGICA Y SOCIO PRODUCTIVA INTEGRAL LA AVANZADORA DE YOCO",
    ],
    ["RAUL LEONI"]: [
      "LOS VALLES KARIÑAS DE LAS SERRANIAS DEL SILENCIO",
      "AGROTURISTICA PESQUERA INDIGENAS DE NURUCUAL",
      "INDIGENA KARIÑA COSTERA PESQUERA COMERCIAL TURISTICA",
      "SOCIOPRODUCTIVA AGRICOLA TURISTICA DE PESCA PLAYA COLORADA",
      "SOCIOPRODUCTIVA AGROTURISTICA UNIDOS DEL EJE COSTERO",
      "COMUNA INDIGENA KARIÑA AGROTURISTICA PESQUERA Y TRANSPORTE GUERRERA Y GUERREROS DE CHAVEZ",
      "COMUNA INDIGENA APACUANA",
      "INDIGENA AGROTURISTICA LA UNION DE SAN PEDRITO",
      "AGRICOLA KARIÑA FRANJA DEL TURIMIQUIRE",
      "AGROTURISTICA PESQUERA KARIÑA CACIQUE MARAGUEY",
      "AGROPRODUCTIVA INDIGENA KARIÑA SANTA CRUZ",
    ],
    ["RENDON"]: [
      "SOCIALISTA AGROTURISTICA PESQUERA Y ARTESANAL COMANDANTE SUPREMO HUGO CHAVEZ",
      "SOCIALISTA AGROTURISTICA PRINCIPIO DE UNA LUCHA",
    ],
    ["RIO CARIBE"]: [
      "AGROTURISTICA TIERRA DEL CACAO",
      "ECOLOGICA PATRIMONIAL ALBA CARIBE LUNA",
      "ECOLOGICA PATRIMONIAL ALBA CARIBE SOL",
      "AGROPESQUERA TURISTICA BAHIAS DE MEDINA",
      "AGROECOLOGICA FLOR DEL CACAO",
    ],
    ["ROMULO GALLEGO"]: ["ROMULO GALLEGOS"],
    ["SAN ANTONIO DE IRAPA"]: ["TIERRA DE GRACIA"],
    ["SAN FERNANDO"]: [
      "PRODUCTIVA LA PATRIA NUEVA",
      "AGROTURISTICA ARTESANAL RIO SAN JUAN",
      "PRODUCTIVA RIO KUMANA",
    ],
    ["SAN JOSE DE AEROCUAR"]: [
      "GENERALISIMO ANTONIO JOSE DE SUCRE",
      "LOS CAMPEARI",
      "SOCIALISTA ANDRES MATA",
      "COMUNA SOCIALISTA EN LA UNION ESTA LA FUERZA DE NUESTROS PUEBLOS",
    ],
    ["SAN JUAN"]: [
      "EL DESPERTAR DE LOS PUEBLOS BOLIVARIANOS SAN JUAN DE MACARAPANA",
      "SOCIALISTA AGROTURISTICA SAN JUAN BAUTISTA",
      "INTEGRAL BOLIVARIANA EL ULTIMO HOMBRE A CABALLO",
      "SOCIALISTA AGROECOTURISTICA REVOLUCIONARIOS DE GUARANACHE",
      "AGROTURISTICA RIBERAS DE TATARACUAL",
    ],
    ["SAN JUAN DE LAS GALDONAS"]: [
      "AGRO-PESQUERA-TURISTICA HORIZONTE DE PARIA",
    ],
    ["SAN LORENZO"]: [
      "PRODUCTIVA Y TURISTICA CRUZ ALEJANDRO QUINAL",
      "AGROPRODUCTIVA Y TURISTICA CHAVEZ EN MONTES",
    ],
    ["SANTA CATALINA"]: [
      "VALLE DE CANCHUNCHU",
      "SOCIALISTA SOCIO-PRODUCTIVA EL MUCO",
      "AGROPECUARIA MONTAÑA FRESCA DEL CHARCAL",
      "SOCIALISTA PRODUCTIVA Y ECOLOGICA DEL SUR CORAZON DE MI PATRIA",
      "SOCIALISTA ECO-PRODUCTIVA TURISTICA Y PESQUERA SUCRE TIERRA DE GRACIA",
      "SOCIOPRODUCTIVA Y ECOTURISTICA GUAYACAN DE LAS FLORES",
      "SOCIALISTA ECOPRODUCTIVA Y TURISTICA ALI PRIMERA",
      "SOCIALISTA INTEGRAL DR SANTOS ANIBAL DOMINICCI",
      "GRAN ALIANZA CENTRO CARUPANO",
      "SOCIALISTA BOLIVARIANA TURISTICA Y PRODUCTIVA EL CARUPANAZO",
      "PRODUCTIVA TURISTICA JOSE FELIX RIVAS",
    ],
    ["SANTA CRUZ"]: ["AGROTURISTICA VICENTE TEJERA"],
    ["SANTA INES"]: [
      "RAICES",
      "BOLIVARIANA SOCIALISTA AGROTURISTICA PRODUCTIVA EL ARBOL DE LAS 3 RAICES",
      "AGRO-TURISTICA-MINERA NELLYS CALLES",
      "COMUNA DE SERVICIOS TURISTICOS AGROURBANA COMANDANTE ETERNO",
      "AGRO ECOTURISTICA Y MINERA RIO MANZANARES",
      "TURISTICA PESQUERA VENCEDORES DE SANTA INES",
      "AGROTURISTICA Y DE SERVICIO LAS CATACUMBAS DE SANTA INES",
      "AGRO-MINERA PRODUCTIVA Y DE SERVICIOS BOCA DE SABANA SOMOS TODOS",
      "CAMPECHE SOMOS TODOS",
      "AGRO-PRODUCTIVA Y DE SERVICIOS SUCRE POTENCIA",
      "AGROPRODUCTIVA TURISTICA DE SERVICIOS URBANA CENTRO HISTORICO",
    ],
    ["SANTA MARIA"]: [
      "SOCIALISTA AGROTURISTICA INDIGENA EL VALLE DE SOPOCUAL",
      "INDIGENA SOCIALISTA AGROTURISTICA Y ARTESANAL CASIKE TEREPAIMA",
      "SOCIALISTA AGROTURISTICA INDIGENAS CHAIMAS DEL GUACHARO",
    ],
    ["SANTA ROSA"]: [
      "SOCIALISTA AGRO-TURISTICA-PRODUCTIVA BRISAS DEL CAMPO",
      "AGRO-PRODUCTIVA-TURISTICA KARUPANA TIERRA DE GRACIA",
    ],
    ["TAVERA ACOSTA"]: [
      "AGRO-TURISTICA CAÑO SAN JUAN",
      "LOMAS SOCIALISTAS UNIDAS",
      "DR. JESUS ESTEBAN CASTAÑEDA EN EL CORAZON DE SU PUEBLO",
      "SOCIALISTA SAN FRANCISCO DE ASIS",
    ],
    ["TUNAPUICITO"]: ["AGRICOLA TIERRA PRODUCTIVA LA CERBATANA"],
    ["TUNAPUY"]: [
      "CUMBRES DE LIBERTADOR",
      "AGROSOCIO PRODUCTIVA Y TURISTICA CHAVEZ Y BOLIVAR NUESTRO",
      "AGROPRODUCTIVA POTENCIA PARIANA",
    ],
    ["UNION"]: ["LUCHADORES DE UNION"],
    ["VALENTIN VALIENTE"]: [
      "SOCIOPRODUCTIVA BRISAS DEL GOLGO",
      "COMUNA SOCIO PRODUCTIVA GUERREROS EN VALENTIN GARCIA",
      "PRODUCTIVA INTEGRAL CACIQUE CAYAURIMA",
      "SOCIOPRODUCTIVA EL PEÑON ESFUERZO DE CHAVEZ",
      "COMUNA DE PRODUCCION INTEGRAL MARIA RODRIGUEZ",
      "SOCIOPRODUCTIVA BATALLADORES DE CAIGUIRE",
      "PUEBLO NUEVO",
    ],
    ["VILLA FRONTADO"]: [
      "COMUNA URBANA SUPREMA DEL COMANDANTE",
      "SOCIALISTA AGRO-TURISTICA-PESQUERA EL ARAÑERO DE SABANETA",
      "AGROTURISTICA ANTONIO JOSE DE SUCRE",
      "COMUNA AGROPETUR UNIDOS POR NUESTRAS COMUNIDADES",
    ],
    ["YAGUARAPARO"]: [
      "AGROPECUARIA CAJIGAL",
      "POR AMOR Y EN HONOR A NUESTRO COMANDANTE",
    ],
  },
};

const OpcionesReporte = {
  tipo: [
    "casoadmin",
    "comunicaciones",
    "formacion",
    "fortalecimiento",
    "incidencias",
    "interno",
    "participacion",
  ],
  tipoFiltro: [
    "casoadmin",
    "comunicaciones",
    "formacion",
    "fortalecimiento",
    "incidencias",
    "interno",
    "participacion",
    "renovacion",
  ],
  participacion: {
    acompanamiento: [
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
    ],
  },
  formacion: {
    estrategia: [
      "TALLER",
      "CHARLA",
      "CONVERSATORIO",
      "CAPACITACION",
      "MESA DE TRABAJO",
      "FORO",
      "SEMINARIO",
      "INDUCCION",
      "VIDEO CONFERENCIA",
    ],
    modalidad: ["PRESENCIAL", "VIRTUAL", "MIXTA"],
    tematica: [
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
    ],
    verificacion: ["LISTA DE ASISTENCIA", "FOTOGRAFIA", "AMBOS", "NINGUNO"],
  },
  fortalecimiento: {
    acompanamiento: [
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
    ],
    tipoActividad: [
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
    ],
    tipoOSP: [
      "CONSEJO COMUNAL",
      "UNIDAD DE PRODUCCION FAMILIAR",
      "EMPRESA DE PRODUCCION SOCIAL DIRECTA",
      "EMPRESA DE PRODUCCION SOCIAL INDIRECTA",
      "EMPRESA DE PRODUCCION SOCIAL MIXTA",
      "EMPRENDEDORES",
      "GRUPO DE INTERCAMBIO SOLIDARIO",
      "COOPERATIVAS",
    ],
    proyectoCFG: {
      etapa: ["ETAPA 1", "ETAPA 2", "ETAPA 3", "CULMINADO"],
      tipo: [
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
      ],
    },
  },
  incidencias: {
    areaSustantiva: [
      "PARTICIPACION",
      "FORMACION",
      "FORTALECIMIENTO",
      "CARTOGRAFIA",
    ],
  },
  casoadmin: {
    tipoCaso: ["CASO", "DENUNCIA", "ADMINISTRATIVO", "ASESORIA"],
  },
};

export { OpcionesCC, OpcionesReporte };
