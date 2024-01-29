//Componentes de react y react router
import { useState } from "react";
import { Outlet } from "react-router-dom";
//Componentes MUI
import { Box, Fab } from "@mui/material";
//Iconos MUI
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
//Componentes endogenos
import BarraLateral from "../componentes/BarraLateral";

function Envoltorio() {
  const [movil, setActivarMovil] = useState(false);

  const mostrarBarra = () => {
    setActivarMovil(!movil);
  };

  return (
    /* jshint ignore:start */
    <Box
      sx={{
        backgroundImage: "url('/body.png')",
        minHeight: "100vh",
        display: { sm: "flex" },
      }}
    >
      <BarraLateral mostrarBarra={mostrarBarra} movil={movil} />
      <Fab
        color="primary"
        onClick={mostrarBarra}
        sx={{
          display: { sm: "none" },
          position: "fixed",
          right: 15,
          top: 15,
        }}
      >
        <MenuRoundedIcon />
      </Fab>
      <Box
        component="main"
        sx={{
          flexGrow: { sm: 1 },
          p: 5,
          width: { sm: `calc(100vw - ${250}px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
    /* jshint ignore:end */
  );
}

export default Envoltorio;
