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
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import FingerprintRoundedIcon from "@mui/icons-material/FingerprintRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import MapsHomeWorkRoundedIcon from "@mui/icons-material/MapsHomeWorkRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
//Componentes endogenos
import BotonMenu from "../componentes/BotonMenu";
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Error from "../componentes/Error";
import ReportesTrimestrales from "../componentes/ReportesTrimestrales";
import ReportesTotales from "../componentes/ReportesTotales";
import Spinner from "../componentes/Spinner";
import Tarjeta from "../componentes/Tarjeta";

function VerCC() {
  const { id } = useParams();
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [cc, setCC] = useState(null);
  const [dataReportes, setDataReportes] = useState([]);
  const [error, setError] = useState(null);
  const [periodo, setPeriodo] = useState(new Date().getFullYear());

  useEffect(() => {
    async function realizarPeticion() {
      const url1 = "http://localhost:4000/ccs/" + id;
      const url2 = `http://localhost:4000/reportes/estadisticas?cc=${id}&periodo=${periodo}`;
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
          setCC(recibido1);
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
                etc={{ situr: cc.situr }}
                id={cc._id}
                opciones={{
                  editar: ["PROMOTOR"],
                  reportes: [],
                  verificar: ["PROMOTOR"],
                }}
                ruta="ccs"
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
                {cc.nombre}
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
                <ListItemText primary="SITUR" secondary={cc.situr} />
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
              {cc.comuna ? (
                <ListItem disablePadding divider>
                  <Accordion square elevation={0} sx={{ width: "100%" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ pr: 2, pl: 0 }}
                    >
                      <ListItem dense component="div">
                        <ListItemIcon>
                          <FlagRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="COMUNA" />
                      </ListItem>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <Link
                        className="no-deco"
                        to={`/comunas/${cc.comuna._id}`}
                      >
                        <List dense disablePadding>
                          <Divider />
                          <ListItem divider>
                            <ListItemIcon>
                              <DriveFileRenameOutlineRoundedIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="NOMBRE"
                              secondary={cc.comuna.nombre}
                            />
                          </ListItem>
                          <ListItem divider>
                            <ListItemIcon>
                              <MapsHomeWorkRoundedIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="TIPO"
                              secondary={cc.comuna.tipo}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <FingerprintRoundedIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="SITUR"
                              secondary={cc.comuna.situr}
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
                  <ListItemText primary="COMUNA" secondary="SIN ASOCIAR" />
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
            filtro="cc"
            id={cc._id}
            periodo={periodo}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <ReportesTrimestrales
            data={dataReportes}
            filtro="cc"
            id={cc._id}
            periodo={periodo}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {cc.estaRenovado && !cc.estaRenovado.vencido ? (
            <Tarjeta
              color="#2e7d32"
              Icono={EventAvailableRoundedIcon}
              titulo={cc.estaRenovado.desde}
              url={`/reportes/${cc.estaRenovado.idReporte}`}
            >
              <Typography variant="h6">Renovado</Typography>
            </Tarjeta>
          ) : (
            <Tarjeta
              color="#d32f2f"
              Icono={EventBusyRoundedIcon}
              titulo={cc.estaRenovado ? cc.estaRenovado.desde : "Sin fecha"}
              url={
                cc.estaRenovado ? `/reportes/${cc.estaRenovado.idReporte}` : ""
              }
            >
              <Typography variant="h6">No renovado</Typography>
            </Tarjeta>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {cc.estaVigente && !cc.estaVigente.vencido ? (
            <Tarjeta
              color="#2e7d32"
              Icono={VerifiedRoundedIcon}
              titulo={cc.estaVigente.desde}
              url={`/reportes/${cc.estaVigente.idReporte}`}
            >
              <Typography variant="h6">Vigente</Typography>
            </Tarjeta>
          ) : (
            <Tarjeta
              color="#d32f2f"
              Icono={NewReleasesRoundedIcon}
              titulo={cc.estaVigente ? cc.estaVigente.desde : "Sin fecha"}
              url={
                cc.estaVigente ? `/reportes/${cc.estaVigente.idReporte}` : ""
              }
            >
              <Typography variant="h6">No vigente</Typography>
            </Tarjeta>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
  /* jshint ignore:end */
}

export default VerCC;
