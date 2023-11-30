import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AddLocationAltRoundedIcon from "@mui/icons-material/AddLocationAltRounded";
import ContentPasteSearchRoundedIcon from "@mui/icons-material/ContentPasteSearchRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const rutasGET = [
  {
    ruta: "/",
    nombre: "Inicio",
    icono: HomeRoundedIcon,
    listaNegra: [],
  },
  {
    ruta: "/",
    nombre: "Buscar",
    icono: ContentPasteSearchRoundedIcon,
    listaNegra: [],
  },
  {
    ruta: "ccs",
    nombre: "Ubicaciones",
    icono: LocationOnRoundedIcon,
    listaNegra: ["PROMOTOR"],
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
];

const rutasPOST = [
  {
    ruta: "ccs/nuevo",
    nombre: "Nueva ubicacion",
    icono: AddLocationAltRoundedIcon,
    listaNegra: ["PROMOTOR"],
  },
  {
    ruta: "usuarios/nuevo",
    nombre: "Nuevo usuario",
    icono: PersonAddAltRoundedIcon,
    listaNegra: ["PROMOTOR"],
  },
  {
    ruta: "reportes/nuevo",
    nombre: "Nuevo reporte",
    icono: NoteAddRoundedIcon,
    listaNegra: [],
  },
];

const rutasETC = [
  {
    ruta: "/",
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

export { rutasGET, rutasPOST, rutasETC };
