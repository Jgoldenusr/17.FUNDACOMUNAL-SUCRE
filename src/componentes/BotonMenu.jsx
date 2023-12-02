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
import PlagiarismRoundedIcon from "@mui/icons-material/PlagiarismRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

function BotonMenu({ etc, id, opciones, ruta }) {
  const navegarHasta = useNavigate();
  const { miUsuario } = useContext(ContextoAutenticado);
  const [ancla, setAncla] = useState(null);
  const abierto = Boolean(ancla);

  const clickEditar = function () {
    navegarHasta(`${ruta ? `../${ruta}/` : ""}${id}/editar`, {
      replace: ruta ? true : false,
    });
  };

  const clickReportes = function () {
    navegarHasta(`../reportes?${ruta.slice(0, -1)}=${id}`, {
      replace: true,
    });
  };

  const clickVerificar = function () {
    navegarHasta(`../reportes/nuevo?situr=${etc.situr}`, {
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
  if (opciones.ocultar && opciones.ocultar.includes(miUsuario.rol)) {
    return "";
  } else {
    return (
      <>
        <IconButton color="inherit" onClick={manejarClickAbrir}>
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={ancla} open={abierto} onClose={manejarCierre}>
          {opciones.verMas && !opciones.verMas.includes(miUsuario.rol) && (
            <MenuItem onClick={clickVerMas}>
              <ListItemIcon>
                <InsertChartOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Ver mas</ListItemText>
            </MenuItem>
          )}
          {opciones.editar && !opciones.editar.includes(miUsuario.rol) && (
            <MenuItem onClick={clickEditar}>
              <ListItemIcon>
                <SettingsOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Editar</ListItemText>
            </MenuItem>
          )}
          {opciones.reportes && !opciones.reportes.includes(miUsuario.rol) && (
            <MenuItem onClick={clickReportes}>
              <ListItemIcon>
                <PlagiarismRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Reportes</ListItemText>
            </MenuItem>
          )}
          {opciones.verificar &&
            !opciones.verificar.includes(miUsuario.rol) && (
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
  }
  /* jshint ignore:end */
}

export default BotonMenu;
