//Componentes de react y react router
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
//Componentes MUI
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
//Iconos MUI
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import FingerprintRoundedIcon from "@mui/icons-material/FingerprintRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MapsHomeWorkRoundedIcon from "@mui/icons-material/MapsHomeWorkRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
//Componentes endogenos
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Error404 from "../componentes/Error404";
import Spinner from "../componentes/Spinner";

function VerCC() {
  const { id } = useParams();
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [cc, setCC] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function realizarPeticion() {
      const url = "http://localhost:4000/ccs/" + id;
      const peticion = {
        headers: new Headers({
          Authorization: `Bearer ${miUsuario.token}`,
        }),
        mode: "cors",
      };

      try {
        const respuesta = await fetch(url, peticion);
        if (respuesta.ok) {
          const recibido = await respuesta.json();
          setCC(recibido);
        } else {
          const recibido = await respuesta.json();
          setError(recibido.error);
        }
      } catch (errorPeticion) {
        setError(errorPeticion);
      } finally {
        setCargando(false);
      }
    }
    realizarPeticion();
  }, []);

  /* jshint ignore:start */
  return cargando ? (
    <Spinner />
  ) : error ? (
    <Error404 error={error} />
  ) : (
    <Grid container>
      <Grid item xs={12} md={5}>
        <Card elevation={6}>
          <Link className="no-deco" to="editar">
            <CardContent
              sx={{ bgcolor: "#1976d2", color: "white", textAlign: "center" }}
            >
              <LocationOnRoundedIcon sx={{ fontSize: 56 }} />
              <Typography component="div" variant="subtitle1">
                {cc.nombre}
              </Typography>
            </CardContent>
          </Link>
          <CardContent sx={{ m: 0, p: 0, "&:last-child": { pb: 0 } }}>
            <List disablePadding dense>
              <ListItem divider>
                <ListItemIcon>
                  <FingerprintRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="SITUR" secondary={cc.situr} />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <FlagRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="COMUNA"
                  secondary={`${cc.comuna || "SIN COMUNA"}`}
                />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <MapsHomeWorkRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="TIPO" secondary={cc.tipo} />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <ExploreRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="REDI" secondary={cc.redi} />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <TravelExploreRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="ESTADOS" secondary={cc.estados} />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <MapRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="MUNICIPIOS" secondary={cc.municipios} />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <MyLocationRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="PARROQUIAS" secondary={cc.parroquias} />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <PushPinRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="LOCALIDAD" secondary={cc.localidad} />
              </ListItem>
              <ListItem disablePadding divider>
                <Accordion square elevation={0} sx={{ width: "100%" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ pr: 2, pl: 0 }}
                  >
                    <ListItem dense component="div">
                      <ListItemIcon>
                        <PersonRoundedIcon />
                      </ListItemIcon>
                      <ListItemText primary="USUARIO ASOCIADO" />
                    </ListItem>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <Link
                      className="no-deco"
                      to={`/usuarios/${cc.usuario._id}`}
                      replace={true}
                    >
                      <List dense disablePadding>
                        <Divider />
                        <ListItem divider>
                          <ListItemIcon>
                            <DriveFileRenameOutlineRoundedIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="APELLIDO Y NOMBRE"
                            secondary={`${cc.usuario.apellido} ${cc.usuario.nombre}`}
                          />
                        </ListItem>
                        <ListItem divider>
                          <ListItemIcon>
                            <LockRoundedIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="ROL"
                            secondary={cc.usuario.rol}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <BadgeRoundedIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="CEDULA"
                            secondary={`V-${cc.usuario.cedula}`}
                          />
                        </ListItem>
                      </List>
                    </Link>
                  </AccordionDetails>
                </Accordion>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  /* jshint ignore:end */
}

export default VerCC;