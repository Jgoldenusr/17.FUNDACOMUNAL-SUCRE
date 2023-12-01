//Componentes de react y react router
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
//Componentes MUI
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Card,
  CardHeader,
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
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FingerprintRoundedIcon from "@mui/icons-material/FingerprintRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MapsHomeWorkRoundedIcon from "@mui/icons-material/MapsHomeWorkRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
//Componentes endogenos
import BotonMenu from "../componentes/BotonMenu";
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Error from "../componentes/Error";
import Spinner from "../componentes/Spinner";

function VerUsuario() {
  const { id } = useParams();
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function realizarPeticion() {
      const url = "http://localhost:4000/usuarios/" + id;
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
          setUsuario(recibido);
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
    <Error error={error} />
  ) : (
    <Grid container>
      <Grid item xs={12} md={5}>
        <Card elevation={6}>
          <CardHeader
            action={
              <BotonMenu
                id={usuario._id}
                opciones={{
                  ocultar: ["PROMOTOR"],
                  editar: [""],
                }}
                ruta="usuarios"
              />
            }
            avatar={
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <PersonRoundedIcon />
              </Avatar>
            }
            disableTypography
            title={
              <Typography component="div" variant="subtitle1">
                {`${usuario.apellido} ${usuario.nombre}`}
              </Typography>
            }
            sx={{ bgcolor: "#1976d2", color: "white" }}
          />
          <CardContent sx={{ m: 0, p: 0, "&:last-child": { pb: 0 } }}>
            <List disablePadding dense>
              <ListItem divider>
                <ListItemIcon>
                  <BadgeRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="CEDULA"
                  secondary={`V-${usuario.cedula}`}
                />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <AlternateEmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="NOMBRE DE USUARIO"
                  secondary={`@${usuario.usuario}`}
                />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <LockRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="ROL" secondary={usuario.rol} />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <PhoneRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="NUMERO TELEFONICO"
                  secondary={usuario.tlf}
                />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <EmailRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="CORREO ELECTRONICO"
                  secondary={usuario.email}
                />
              </ListItem>
              <ListItem disablePadding divider>
                <Accordion square elevation={0} sx={{ width: "100%" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ pr: 2, pl: 0 }}
                  >
                    <ListItem dense component="div">
                      <ListItemIcon>
                        <LocationOnRoundedIcon />
                      </ListItemIcon>
                      <ListItemText primary="UBICACIONES ASOCIADAS" />
                    </ListItem>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    {usuario.cc.map((cc, i) => {
                      let par = i % 2 === 0;
                      return (
                        <Link
                          className="no-deco"
                          key={cc._id}
                          to={`/ccs/${cc._id}`}
                          replace={true}
                        >
                          <List
                            dense
                            disablePadding
                            sx={{ bgcolor: par ? "#f5f5f5" : "white" }}
                          >
                            <Divider />
                            <ListItem divider>
                              <ListItemIcon>
                                <DriveFileRenameOutlineRoundedIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="NOMBRE DE LA UBICACION"
                                secondary={cc.nombre}
                              />
                            </ListItem>
                            <ListItem divider>
                              <ListItemIcon>
                                <MapsHomeWorkRoundedIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="TIPO"
                                secondary={cc.tipo}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <FingerprintRoundedIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="SITUR"
                                secondary={cc.situr}
                              />
                            </ListItem>
                          </List>
                        </Link>
                      );
                    })}
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

export default VerUsuario;
