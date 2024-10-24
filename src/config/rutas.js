import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AddLocationAltRoundedIcon from "@mui/icons-material/AddLocationAltRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import OutlinedFlagRoundedIcon from "@mui/icons-material/OutlinedFlagRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

const rutas = [
  {
    ruta: "/",
    nombre: "Inicio",
    icono: HomeRoundedIcon,
    listaNegra: [],
  },
  {
    ruta: "comunas",
    nombre: "Comunas",
    icono: FlagRoundedIcon,
    listaNegra: [""],
  },
  {
    ruta: "ccs",
    nombre: "Ubicaciones",
    icono: LocationOnRoundedIcon,
    listaNegra: [""],
  },
  {
    ruta: "usuarios",
    nombre: "Usuarios",
    icono: PersonRoundedIcon,
    listaNegra: ["PROMOTOR"],
  },
  {
    ruta: "reportes",
    nombre: "Reportes",
    icono: DescriptionRoundedIcon,
    listaNegra: [],
  },
  {
    ruta: "comunas/nuevo",
    nombre: "Nueva comuna",
    icono: OutlinedFlagRoundedIcon,
    listaNegra: ["PROMOTOR", "ESPECIAL"],
  },
  {
    ruta: "ccs/nuevo",
    nombre: "Nueva ubicacion",
    icono: AddLocationAltRoundedIcon,
    listaNegra: ["PROMOTOR", "ESPECIAL"],
  },
  {
    ruta: "usuarios/nuevo",
    nombre: "Nuevo usuario",
    icono: PersonAddAltRoundedIcon,
    listaNegra: ["PROMOTOR", "ESPECIAL"],
  },
  {
    ruta: "reportes/nuevo",
    nombre: "Nuevo reporte",
    icono: NoteAddRoundedIcon,
    listaNegra: ["ESPECIAL"],
  },
  /*
  {
    ruta: "/config",
    nombre: "Configuraciones",
    icono: SettingsRoundedIcon,
    listaNegra: ["PROMOTOR"],
  }
  */
  {
    ruta: "/cuenta",
    nombre: "Mi cuenta",
    icono: AccountCircleRoundedIcon,
    listaNegra: [],
  },
  {
    nombre: "Cerrar sesion",
    icono: ExitToAppRoundedIcon,
    listaNegra: [],
  },
];

export { rutas };
