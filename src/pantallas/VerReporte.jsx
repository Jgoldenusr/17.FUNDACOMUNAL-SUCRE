//Componentes de react y react router
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExtensionRoundedIcon from "@mui/icons-material/ExtensionRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import FactoryRoundedIcon from "@mui/icons-material/FactoryRounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import FeaturedPlayListRoundedIcon from "@mui/icons-material/FeaturedPlayListRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import FemaleRoundedIcon from "@mui/icons-material/FemaleRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import InsertCommentRoundedIcon from "@mui/icons-material/InsertCommentRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import MaleRoundedIcon from "@mui/icons-material/MaleRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TextsmsRoundedIcon from "@mui/icons-material/TextsmsRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";
//Componentes endogenos
import BotonMenu from "../componentes/BotonMenu";
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Error from "../componentes/Error";
import Spinner from "../componentes/Spinner";

function VerReporte() {
  const { id } = useParams();
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reporte, setReporte] = useState(null);
  const excepcionPromotor =
    miUsuario.rol !== "ADMINISTRADOR" &&
    reporte &&
    miUsuario.id === reporte.usuario._id;

  useEffect(() => {
    async function realizarPeticion() {
      const url = "http://localhost:4000/reportes/" + id;
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
          setReporte(recibido);
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
    <Grid container justifyContent="center">
      <Grid item xs={12} md={5}>
        <Card elevation={6}>
          <CardHeader
            action={
              <BotonMenu
                id={reporte._id}
                opciones={{
                  ocultar: excepcionPromotor ? [] : ["PROMOTOR"],
                  editar: excepcionPromotor ? [] : ["PROMOTOR"],
                }}
                ruta="reportes"
              />
            }
            avatar={
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <DescriptionRoundedIcon />
              </Avatar>
            }
            disableTypography
            title={
              <Typography component="div" variant="subtitle1">
                {`REPORTE DE ${reporte.tipo.toUpperCase()}`}
              </Typography>
            }
            sx={{ bgcolor: "#1976d2", color: "white" }}
          />
          <CardContent sx={{ m: 0, p: 0, "&:last-child": { pb: 0 } }}>
            <List disablePadding dense>
              <ListItem
                divider
                secondaryAction={
                  <BotonMenu
                    id={reporte.usuario._id}
                    opciones={{
                      ocultar: ["PROMOTOR"],
                      verMas: [""],
                      editar: [""],
                    }}
                    ruta="usuarios"
                  />
                }
              >
                <ListItemIcon>
                  <PersonRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="AUTOR"
                  secondary={`${reporte.usuario.apellido} \
                  ${reporte.usuario.nombre}`}
                />
              </ListItem>
              <ListItem
                divider
                secondaryAction={
                  <BotonMenu
                    etc={{ situr: reporte.cc.situr }}
                    id={reporte.cc._id}
                    opciones={{
                      verMas: [],
                      editar: ["PROMOTOR"],
                      verificar: ["PROMOTOR"],
                    }}
                    ruta="ccs"
                  />
                }
              >
                <ListItemIcon>
                  <LocationOnRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="UBICACION"
                  secondary={reporte.cc.nombre}
                />
              </ListItem>
              <ListItem divider>
                <ListItemIcon>
                  <EventRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="FECHA"
                  secondary={reporte.fechaConFormato}
                />
              </ListItem>
              {reporte.tipo === "participacion" ? (
                <>
                  <ListItem divider>
                    <ListItemIcon>
                      <AccountBalanceRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="ORGANOS ADSCRITOS"
                      secondary={reporte.organosAdscritos}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <Diversity3RoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="ACOMPAÑAMIENTO"
                      secondary={reporte.acompanamiento}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <FamilyRestroomRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="FAMILIAS BENEFICIADAS"
                      secondary={reporte.familiasBeneficiadas}
                    />
                  </ListItem>
                </>
              ) : reporte.tipo === "formacion" ? (
                <>
                  <ListItem divider>
                    <ListItemIcon>
                      <AccountBalanceRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="ORGANOS ADSCRITOS"
                      secondary={reporte.organosAdscritos}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <ExtensionRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="ESTRATEGIA"
                      secondary={reporte.estrategia}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <VisibilityRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="MODALIDAD"
                      secondary={reporte.modalidad}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <MenuBookRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="TEMATICA"
                      secondary={reporte.tematica}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <FactCheckRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="VERIFICACION"
                      secondary={reporte.verificacion}
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
                            <FamilyRestroomRoundedIcon />
                          </ListItemIcon>
                          <ListItemText primary="BENEFICIADOS" />
                        </ListItem>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0 }}>
                        <List dense disablePadding>
                          <Divider />
                          <ListItem divider>
                            <ListItemIcon>
                              <MaleRoundedIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="HOMBRES"
                              secondary={reporte.beneficiados.hombres}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <FemaleRoundedIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="MUJERES"
                              secondary={reporte.beneficiados.mujeres}
                            />
                          </ListItem>
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  </ListItem>
                </>
              ) : reporte.tipo === "fortalecimiento" ? (
                <>
                  <ListItem divider>
                    <ListItemIcon>
                      <AccountBalanceRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="ORGANOS ADSCRITOS"
                      secondary={reporte.organosAdscritos}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <Diversity3RoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="ACOMPAÑAMIENTO"
                      secondary={reporte.acompanamiento}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <GroupsRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="ORGANIZACION SOCIOPRODUCTIVA"
                      secondary={reporte.nombreOSP}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <PaidRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="TIPO DE ACTIVIDAD"
                      secondary={reporte.tipoActividad}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <FactoryRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="TIPO DE ORGANIZACION SOCIOPRODUCTIVA"
                      secondary={reporte.tipoOSP}
                    />
                  </ListItem>
                  {reporte.proyectoCFG?.tipo && reporte.proyectoCFG?.etapa && (
                    <ListItem disablePadding divider>
                      <Accordion square elevation={0} sx={{ width: "100%" }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ pr: 2, pl: 0 }}
                        >
                          <ListItem dense component="div">
                            <ListItemIcon>
                              <ConstructionRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary="PROYECTO CONSEJO FEDERAL DE GOBIERNO" />
                          </ListItem>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                          <List dense disablePadding>
                            <Divider />
                            <ListItem divider>
                              <ListItemIcon>
                                <TourRoundedIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="ESTADO"
                                secondary={reporte.proyectoCFG.etapa}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <WarehouseRoundedIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="TIPO"
                                secondary={reporte.proyectoCFG.tipo}
                              />
                            </ListItem>
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    </ListItem>
                  )}
                </>
              ) : reporte.tipo === "incidencias" ? (
                <>
                  <ListItem divider>
                    <ListItemIcon>
                      <AccountBalanceRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="ORGANOS ADSCRITOS"
                      secondary={reporte.organosAdscritos}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <ErrorRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="TIPO"
                      secondary={reporte.tipoIncidencia}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <SearchRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="AREA SUSTANTIVA"
                      secondary={reporte.areaSustantiva}
                    />
                  </ListItem>
                </>
              ) : reporte.tipo === "casoadmin" ? (
                <>
                  <ListItem divider>
                    <ListItemIcon>
                      <AccountBalanceRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="ORGANOS ADSCRITOS"
                      secondary={reporte.organosAdscritos}
                    />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <InsertCommentRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="CASO" secondary={reporte.caso} />
                  </ListItem>
                  <ListItem divider>
                    <ListItemIcon>
                      <BusinessCenterRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="TIPO" secondary={reporte.tipoCaso} />
                  </ListItem>
                </>
              ) : reporte.tipo === "comunicaciones" ? (
                <>
                  <ListItem divider>
                    <ListItemIcon>
                      <AccountBalanceRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="ORGANOS ADSCRITOS"
                      secondary={reporte.organosAdscritos}
                    />
                  </ListItem>
                  {reporte.prensa?.notas && reporte.prensa?.resenas && (
                    <ListItem disablePadding divider>
                      <Accordion square elevation={0} sx={{ width: "100%" }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ pr: 2, pl: 0 }}
                        >
                          <ListItem dense component="div">
                            <ListItemIcon>
                              <NewspaperRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary="PRENSA" />
                          </ListItem>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                          <List dense disablePadding>
                            <Divider />
                            <ListItem divider>
                              <ListItemIcon>
                                <FeaturedPlayListRoundedIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="NOTAS"
                                secondary={reporte.prensa.notas}
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <TextsmsRoundedIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="RESEÑAS"
                                secondary={reporte.prensa.resenas}
                              />
                            </ListItem>
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    </ListItem>
                  )}
                  {reporte.redes && (
                    <ListItem disablePadding divider>
                      <Accordion square elevation={0} sx={{ width: "100%" }}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ pr: 2, pl: 0 }}
                        >
                          <ListItem dense component="div">
                            <ListItemIcon>
                              <RssFeedRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary="REDES" />
                          </ListItem>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                          {reporte.redes.map((info, i) => {
                            let par = i % 2 === 0;
                            if (info.cuenta && info.publicaciones) {
                              return (
                                <List
                                  dense
                                  disablePadding
                                  key={`RED-${i}`}
                                  sx={{ bgcolor: par ? "#f5f5f5" : "white" }}
                                >
                                  <Divider />
                                  <ListItem divider>
                                    <ListItemIcon>
                                      <AccountCircleRoundedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="CUENTA"
                                      secondary={info.cuenta}
                                    />
                                  </ListItem>
                                  <ListItem>
                                    <ListItemIcon>
                                      <FeedRoundedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary="PUBLICACIONES"
                                      secondary={info.publicaciones}
                                    />
                                  </ListItem>
                                </List>
                              );
                            }
                          })}
                        </AccordionDetails>
                      </Accordion>
                    </ListItem>
                  )}
                </>
              ) : (
                <>
                  <ListItem divider>
                    <ListItemIcon>
                      <EventAvailableRoundedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="FECHA DE REGISTRO"
                      secondary={reporte.fechaRegistroConFormato}
                    />
                  </ListItem>
                </>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  /* jshint ignore:end */
}

export default VerReporte;
