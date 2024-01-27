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
import ReportePDF from "../componentes/reportePDF";
//Iconos MUI
import FilePresentRoundedIcon from "@mui/icons-material/FilePresentRounded";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlagiarismRoundedIcon from "@mui/icons-material/PlagiarismRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
//Etc
import { pdf } from "@react-pdf/renderer";

function BotonMenu({ etc, id, opciones, ruta, cb }) {
  const navegarHasta = useNavigate();
  const { miUsuario } = useContext(ContextoAutenticado);
  const [ancla, setAncla] = useState(null);
  const abierto = Boolean(ancla);

  const clickEditar = function () {
    navegarHasta(`${ruta ? `../${ruta}/` : ""}${id}/editar`);
  };

  /* jshint ignore:start */
  const clickImprimir = async function () {
    const blob = await pdf(<ReportePDF reporte={etc} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "REP-" + id + ".pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  /* jshint ignore:end */

  const clickReportes = function () {
    navegarHasta(`../reportes?${ruta.slice(0, -1)}=${id}`);
  };

  const clickVerificar = function () {
    navegarHasta(`../reportes/nuevo?situr=${etc.situr}`);
  };

  const clickVerMas = function () {
    navegarHasta(`${ruta ? `../${ruta}/` : ""}${id}`);
  };

  const manejarClickAbrir = (evento) => {
    setAncla(evento.currentTarget);
  };

  const manejarCierre = () => {
    setAncla(null);
  };

  const obtenerPeriodos = function () {
    let periodos = [];
    let fechaActual = new Date();
    let anioActual = fechaActual.getFullYear();

    for (let i = 0; i < 10; i++) {
      periodos.push(anioActual - i);
    }

    return periodos;
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
          {opciones.descargar &&
            !opciones.descargar.includes(miUsuario.rol) && (
              <MenuItem onClick={clickImprimir}>
                <ListItemIcon>
                  <FilePresentRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Imprimir</ListItemText>
              </MenuItem>
            )}
          {opciones.periodos &&
            !opciones.periodos.includes(miUsuario.rol) &&
            obtenerPeriodos().map((anio) => {
              return (
                <MenuItem key={`PER-${anio}`} onClick={cb(anio)}>
                  <ListItemText>{anio}</ListItemText>
                </MenuItem>
              );
            })}
        </Menu>
      </>
    );
  }
  /* jshint ignore:end */
}

/*
<PDFDownloadLink document={}>
*/
export default BotonMenu;
