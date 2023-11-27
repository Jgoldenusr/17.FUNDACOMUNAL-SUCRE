//Componentes de react y react router
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
//Componentes MUI
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
//Rutas predefinidas
import { rutasGET, rutasPOST, rutasETC } from "../config/rutas";
//Modulos endogenos
import ContextoAutenticado from "./ContextoAutenticado";

function BarraLateral({ movil, mostrarBarra }) {
  const navegarHasta = useNavigate();
  const { miUsuario, borrarUsuario } = useContext(ContextoAutenticado);

  const redirigirHasta = function (ruta) {
    return function () {
      if (movil) mostrarBarra();
      navegarHasta(ruta, { replace: true });
    };
  };

  /* jshint ignore:start */
  return (
    <Box component="nav" sx={{ flexShrink: { sm: 0 }, width: { sm: 250 } }}>
      <Drawer
        ModalProps={{ keepMounted: true }}
        onClose={mostrarBarra}
        open={!movil ? true : movil}
        PaperProps={{
          sx: { backgroundImage: "url('/barra.png')" },
          elevation: 6,
        }}
        sx={{
          display: !movil
            ? { xs: "none", sm: "block" }
            : { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
          },
        }}
        variant={!movil ? "permanent" : "temporary"}
      >
        <Toolbar>
          <Box
            component="img"
            src="/logo.png"
            sx={{ my: 1, width: 200, height: 90 }}
          />
        </Toolbar>
        <Divider />
        <List>
          {rutasGET.map((unaRuta, i) => {
            if (!unaRuta.listaNegra.includes(miUsuario.rol)) {
              return (
                <ListItem disablePadding key={`RUG-${i}`}>
                  <ListItemButton onClick={redirigirHasta(unaRuta.ruta)}>
                    <ListItemIcon>
                      <unaRuta.icono />
                    </ListItemIcon>
                    <ListItemText primary={unaRuta.nombre} />
                  </ListItemButton>
                </ListItem>
              );
            }
          })}
        </List>
        <Divider />
        <List>
          {rutasPOST.map((unaRuta, i) => {
            if (!unaRuta.listaNegra.includes(miUsuario.rol)) {
              return (
                <ListItem disablePadding key={`RUP-${i}`}>
                  <ListItemButton onClick={redirigirHasta(unaRuta.ruta)}>
                    <ListItemIcon>
                      <unaRuta.icono />
                    </ListItemIcon>
                    <ListItemText primary={unaRuta.nombre} />
                  </ListItemButton>
                </ListItem>
              );
            }
          })}
        </List>
        <Divider />
        <List>
          {rutasETC.map((unaRuta, i) => {
            if (!unaRuta.listaNegra.includes(miUsuario.rol)) {
              return (
                <ListItem disablePadding key={`RUE-${i}`}>
                  <ListItemButton
                    onClick={
                      unaRuta.ruta
                        ? redirigirHasta(unaRuta.ruta)
                        : borrarUsuario
                    }
                  >
                    <ListItemIcon>
                      <unaRuta.icono />
                    </ListItemIcon>
                    <ListItemText primary={unaRuta.nombre} />
                  </ListItemButton>
                </ListItem>
              );
            }
          })}
        </List>
      </Drawer>
    </Box>
  );
  /* jshint ignore:end */
}

export default BarraLateral;
