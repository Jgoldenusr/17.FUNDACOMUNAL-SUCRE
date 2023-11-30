//Componentes de react y react router
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
//Componentes MUI
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
//Componentes endogenos
import ContextoAutenticado from "./ContextoAutenticado";
//Iconos MUI
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

function BotonMenu({ id, ruta, situr }) {
  const navegarHasta = useNavigate();
  const { miUsuario } = useContext(ContextoAutenticado);
  const [ancla, setAncla] = useState(null);
  const abierto = Boolean(ancla);

  const clickEditar = function () {
    navegarHasta(`${ruta ? `../${ruta}/` : ""}${id}/editar`, {
      replace: ruta ? true : false,
    });
  };

  const clickVerificar = function () {
    navegarHasta(`../reportes/nuevo?situr=${situr}`, {
      replace: true,
    });
  };

  const clickVerMas = function () {
    navegarHasta(`${ruta ? `../${ruta}/` : ""}${id}`, {
      replace: ruta ? true : false,
    });
  };

  const manejarClickAbrir = (evento) => {
    setAncla(evento.currentTarget);
  };

  const manejarCierre = () => {
    setAncla(null);
  };

  /* jshint ignore:start */
  return (
    <>
      <IconButton color="inherit" onClick={manejarClickAbrir}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={ancla} open={abierto} onClose={manejarCierre}>
        <MenuItem onClick={clickVerMas}>
          <ListItemIcon>
            <InsertChartOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver mas</ListItemText>
        </MenuItem>
        {miUsuario.rol === "ADMINISTRADOR" && (
          <MenuItem onClick={clickEditar}>
            <ListItemIcon>
              <SettingsOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar</ListItemText>
          </MenuItem>
        )}
        {miUsuario.rol === "ADMINISTRADOR" && situr && (
          <MenuItem onClick={clickVerificar}>
            <ListItemIcon>
              <VerifiedRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Verificar</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
  /* jshint ignore:end */
}

export default BotonMenu;
