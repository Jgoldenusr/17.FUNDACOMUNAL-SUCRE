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
  CardContent,
  CardHeader,
  Divider,
  Grid2 as Grid,
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
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import FingerprintRoundedIcon from "@mui/icons-material/FingerprintRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MapsHomeWorkRoundedIcon from "@mui/icons-material/MapsHomeWorkRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
//Componentes endogenos
import BotonMenu from "../componentes/BotonMenu";
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Error from "../componentes/Error";
import ReportesTrimestrales from "../componentes/ReportesTrimestrales";
import ReportesTotales from "../componentes/ReportesTotales";
import Spinner from "../componentes/Spinner";

function VerComuna() {
  const { id } = useParams();
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [comuna, setComuna] = useState(null);
  const [dataReportes, setDataReportes] = useState([]);
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState(new Date().getFullYear());

  useEffect(() => {
    async function realizarPeticion() {
      const url1 = "http://localhost:4000/comunas/" + id;
      const url2 = `http://localhost:4000/reportes/estadisticas?comuna=${id}&periodo=${periodo}`;
      const peticion = {
        headers: new Headers({
          Authorization: `Bearer ${miUsuario.token}`,
        }),
        mode: "cors",
      };

      try {
        const [respuesta1, respuesta2] = await Promise.all([
          fetch(url1, peticion),
          fetch(url2, peticion),
        ]);
        if (respuesta1.ok && respuesta2.ok) {
          const [recibido1, recibido2] = await Promise.all([
            respuesta1.json(),
            respuesta2.json(),
          ]);
          setComuna(recibido1);
          setDataReportes(recibido2);
        } else {
          setError({
            message:
              "Error procesando su solicitud, es posible que el recurso no exista  o haya sido eliminado",
          });
        }
      } catch (errorPeticion) {
        setError(errorPeticion);
      } finally {
        setCargando(false);
      }
    }
    realizarPeticion();
  }, [periodo]);

  const cambiarPeriodo = function (anio) {
    return function (e) {
      e.preventDefault();
      setPeriodo(anio);
    };
  };

  /* jshint ignore:start */
  return cargando ? (
    <Spinner />
  ) : error ? (
    <Error error={error} />
  ) : (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6, xl: 12 }}>
        <Card elevation={6}>
          <CardHeader
            action={
              <BotonMenu
                id={comuna._id}
                opciones={{
                  editar: ["PROMOTOR"],
                  reportes: [],
                }}
                ruta="comuna"
              />
            }
            avatar={
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <LocationOnRoundedIcon />
              </Avatar>
            }
            disableTypography
            title={
              <Typography component="div" variant="subtitle1">
                {comuna.nombre}
              </Typography>
            }
            sx={{ bgcolor: "#1976d2", color: "white" }}
          />
          <CardContent sx={{ m: 0, p: 0, "&:last-child": { pb: 0 } }}>
            <List disablePadding dense>
              <ListItem divider>
                <ListItemIcon>
                  <FingerprintRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="SITUR" secondary={comuna.situr} />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <MapsHomeWorkRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="TIPO" secondary={comuna.tipo} />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <TravelExploreRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="ESTADOS" secondary={comuna.estados} />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <MapRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="MUNICIPIOS"
                  secondary={comuna.municipios}
                />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <MyLocationRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="PARROQUIAS"
                  secondary={comuna.parroquias}
                />
              </ListItem>
              {comuna.usuario ? (
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
                        <ListItemText primary="USUARIO" />
                      </ListItem>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <Link
                        className="no-deco"
                        to={`/usuarios/${comuna.usuario._id}`}
                      >
                        <List dense disablePadding>
                          <Divider />
                          <ListItem divider>
                            <ListItemIcon>
                              <DriveFileRenameOutlineRoundedIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="APELLIDO Y NOMBRE"
                              secondary={`${comuna.usuario.apellido} ${comuna.usuario.nombre}`}
                            />
                          </ListItem>
                          <ListItem divider>
                            <ListItemIcon>
                              <LockRoundedIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="ROL"
                              secondary={comuna.usuario.rol}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <BadgeRoundedIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="CEDULA"
                              secondary={comuna.usuario.cedula}
                            />
                          </ListItem>
                        </List>
                      </Link>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
              ) : (
                <ListItem sx={{ bgcolor: "#f5f5f5" }} divider>
                  <ListItemIcon>
                    <FlagRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="USUARIO" secondary="SIN ASOCIAR" />
                </ListItem>
              )}
              {comuna.cc?.length > 0 ? (
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
                        <ListItemText primary="UBICACIONES" />
                      </ListItem>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      {comuna.cc.map((cc, i) => {
                        let par = i % 2 === 0;
                        return (
                          <Link
                            className="no-deco"
                            key={cc._id}
                            to={`/ccs/${cc._id}`}
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
              ) : (
                <ListItem sx={{ bgcolor: "#f5f5f5" }} divider>
                  <ListItemIcon>
                    <FlagRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="UBICACIONES" secondary="SIN ASOCIAR" />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid
        container
        alignContent={"flex-start"}
        display="flex"
        size={{ xs: 12, md: 6, xl: 12 }}
        spacing={3}
      >
        <Grid size={{ xs: 12 }}>
          <ReportesTotales
            cb={cambiarPeriodo}
            data={dataReportes}
            filtro="comuna"
            id={comuna._id}
            periodo={periodo}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <ReportesTrimestrales
            data={dataReportes}
            filtro="comuna"
            id={comuna._id}
            periodo={periodo}
          />
        </Grid>
      </Grid>
    </Grid>
  );
  /* jshint ignore:end */
}

export default VerComuna;
