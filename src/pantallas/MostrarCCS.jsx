//Componentes de react y react router
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
//Componentes MUI
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FilledInput,
  FormControl,
  Grid2 as Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Typography,
} from "@mui/material";
//Componentes endogenos
import AlertaError from "../componentes/AlertaError";
import BotonMenu from "../componentes/BotonMenu";
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Spinner from "../componentes/Spinner";
//Iconos MUI
import CabinRoundedIcon from "@mui/icons-material/CabinRounded";
import ForestRoundedIcon from "@mui/icons-material/ForestRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import TuneIcon from "@mui/icons-material/Tune";
//Etc
import { OpcionesCC } from "../config/opciones";

function MostrarCCS() {
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [ccs, setCCS] = useState(null);
  const [comunas, setComunas] = useState([]);
  const [error, setError] = useState(null);
  const [parametros, setParametros] = useSearchParams();
  const [realizarConsulta, setRealizarConsulta] = useState(true);

  const agregarParametrosURL = function (url) {
    let nuevaURL = url;

    if (parametros.get("comuna")) {
      nuevaURL += `comuna=${parametros.get("comuna")}&`;
    }
    if (parametros.get("estatus")) {
      nuevaURL += `estatus=${parametros.get("estatus")}&`;
    }
    if (parametros.get("municipios")) {
      nuevaURL += `municipios=${parametros.get("municipios")}&`;
    }
    if (parametros.get("parroquias")) {
      nuevaURL += `parroquias=${parametros.get("parroquias")}&`;
    }
    if (parametros.get("situr")) {
      nuevaURL += `situr=${parametros.get("situr")}&`;
    }
    if (parametros.get("tipo")) {
      nuevaURL += `tipo=${parametros.get("tipo")}&`;
    }
    if (parametros.get("p")) {
      nuevaURL += `p=${parametros.get("p")}`;
    }

    return nuevaURL;
  };

  const actualizarParametros = function (campo) {
    return async function (evento, valorPag) {
      evento.preventDefault();
      let valorCampo = campo === "p" ? valorPag : evento.target.value;
      //Logica de algunos campos
      if (campo === "municipios") {
        parametros.delete("parroquias");
        parametros.delete("comuna");
      }
      if (campo === "parroquias") {
        const arrayComunas = await buscarComunas(
          `municipios=${parametros.get("municipios")}&parroquias=${
            evento.target.value
          }&solonombres=true`
        );
        parametros.delete("comuna");
        setComunas(arrayComunas);
      }
      if (campo !== "p") {
        parametros.delete("p");
      }
      parametros.set(campo, valorCampo);
      let miConsulta = {};
      for (let [clave, valor] of parametros) {
        if (clave && valor) miConsulta[clave] = valor;
      }
      setParametros(miConsulta);
      if (campo === "p") {
        setRealizarConsulta(true);
      }
    };
  };

  const buscarComunas = async function (parametros) {
    const url = `http://localhost:4000/comunas?${parametros}`;
    const peticion = {
      headers: new Headers({
        Authorization: `Bearer ${miUsuario.token}`,
      }),
      mode: "cors",
    };
    let arrayDeOpciones;
    try {
      const respuesta = await fetch(url, peticion);
      if (respuesta.ok) {
        const recibido = await respuesta.json();
        arrayDeOpciones = recibido;
      } else {
        arrayDeOpciones = [];
      }
    } catch (errorPeticion) {
      arrayDeOpciones = [];
    }
    return arrayDeOpciones;
  };

  const manejarConsulta = function (evento) {
    evento.preventDefault();
    setRealizarConsulta(true);
  };

  useEffect(() => {
    async function realizarPeticion() {
      setCargando(true);
      setError(null);

      const url = agregarParametrosURL("http://localhost:4000/ccs?");
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
          setCCS(recibido);
        } else {
          const recibido = await respuesta.json();
          setError(recibido.error);
          setCCS(null);
        }
      } catch (errorPeticion) {
        setError(errorPeticion);
        setCCS(null);
      } finally {
        setRealizarConsulta(false);
        setCargando(false);
      }
    }
    if (realizarConsulta) {
      realizarPeticion();
    }
  }, [realizarConsulta]);

  /* jshint ignore:start */
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Card component="form" onSubmit={manejarConsulta}>
          <CardHeader sx={{ bgcolor: "#1976d2", color: "white", p: 1 }} />
          <CardContent sx={{ "&:last-child": { pb: 2 } }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, md: 4 }}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Municipios</InputLabel>
                  <Select
                    onChange={actualizarParametros("municipios")}
                    value={parametros.get("municipios") || ""}
                  >
                    <MenuItem value="">CUALQUIERA</MenuItem>
                    {OpcionesCC.municipios?.map((opcion) => {
                      return (
                        <MenuItem key={opcion} value={opcion}>
                          {opcion}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Parroquias</InputLabel>
                  <Select
                    onChange={actualizarParametros("parroquias")}
                    value={parametros.get("parroquias") || ""}
                  >
                    <MenuItem value="">CUALQUIERA</MenuItem>
                    {OpcionesCC.parroquias[
                      `${parametros.get("municipios") || "VACIO"}`
                    ].map((opcion) => {
                      return (
                        <MenuItem key={opcion} value={opcion}>
                          {opcion}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Comuna</InputLabel>
                  <Select
                    onChange={actualizarParametros("comuna")}
                    value={parametros.get("comuna") || ""}
                  >
                    <MenuItem value="">SIN COMUNA</MenuItem>
                    {comunas.map((opcion) => {
                      return (
                        <MenuItem key={opcion} value={opcion}>
                          {opcion}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, md: 3.5 }}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Estatus</InputLabel>
                  <Select
                    onChange={actualizarParametros("estatus")}
                    value={parametros.get("estatus") || ""}
                  >
                    <MenuItem value="">CUALQUIERA</MenuItem>
                    <MenuItem value="norenovado">NO RENOVADO</MenuItem>
                    <MenuItem value="novigente">NO VIGENTE</MenuItem>
                    <MenuItem value="renovado">RENOVADO</MenuItem>
                    <MenuItem value="vigente">VIGENTE</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, md: 3.5 }}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    onChange={actualizarParametros("tipo")}
                    value={parametros.get("tipo") || ""}
                  >
                    <MenuItem value="">CUALQUIERA</MenuItem>
                    {OpcionesCC.tipo?.map((opcion) => {
                      return (
                        <MenuItem key={opcion} value={opcion}>
                          {opcion}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Situr</InputLabel>
                  <FilledInput
                    inputProps={{ maxLength: 20 }}
                    onChange={actualizarParametros("situr")}
                    value={parametros.get("situr") || ""}
                  />
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 1 }}>
                <Button
                  fullWidth
                  disabled={cargando}
                  size="large"
                  sx={{
                    height: 48,
                  }}
                  type="submit"
                  variant="contained"
                >
                  <TuneIcon />
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {cargando ? (
        <Spinner />
      ) : error ? (
        <AlertaError error={error} icono={SearchOffIcon} titulo="Oops!" />
      ) : (
        <>
          {ccs?.docs?.map((cc) => {
            return (
              <Grid size={{ xs: 12, md: 6, xl: 4 }} key={cc._id}>
                <Card elevation={6}>
                  <CardHeader
                    disableTypography
                    action={
                      <BotonMenu
                        etc={{ situr: cc.situr }}
                        id={cc._id}
                        opciones={{
                          editar: ["PROMOTOR"],
                          reportes: [],
                          verificar: ["PROMOTOR"],
                          verMas: [],
                        }}
                        ruta="ccs"
                      />
                    }
                    avatar={
                      <Badge
                        color="error"
                        invisible={!!cc.comuna}
                        variant="dot"
                      >
                        <Avatar
                          sx={{
                            bgcolor:
                              cc.estaRenovado &&
                              !cc.estaRenovado.vencido &&
                              cc.estaVigente &&
                              !cc.estaVigente.vencido
                                ? "#2e7d32"
                                : (!cc.estaRenovado ||
                                    cc.estaRenovado.vencido) &&
                                  (!cc.estaVigente || cc.estaVigente.vencido)
                                ? "#d32f2f"
                                : "#ff9800",
                          }}
                        >
                          {cc.tipo === "URBANO" ? (
                            <HomeWorkRoundedIcon />
                          ) : cc.tipo === "RURAL" ? (
                            <CabinRoundedIcon />
                          ) : (
                            <ForestRoundedIcon />
                          )}
                        </Avatar>
                      </Badge>
                    }
                    sx={{
                      "& .MuiCardHeader-content": {
                        display: "block",
                        overflow: "hidden",
                      },
                    }}
                    subheader={
                      <Typography
                        noWrap
                        color="text.secondary"
                        textOverflow={"ellipsis"}
                        variant="body2"
                      >
                        {cc.situr}
                      </Typography>
                    }
                    title={
                      <>
                        <Typography
                          noWrap
                          sx={{ fontWeight: "bold", lineHeight: 1.5 }}
                          textOverflow={"ellipsis"}
                          variant="subtitle1"
                        >
                          {cc.nombre}
                        </Typography>
                        <Typography
                          noWrap
                          sx={{ fontStyle: "italic" }}
                          textOverflow={"ellipsis"}
                          variant="body1"
                        >
                          {`${cc.municipios}, ${cc.parroquias}`}
                        </Typography>
                      </>
                    }
                  />
                </Card>
              </Grid>
            );
          })}
          {ccs?.totalPages > 1 && (
            <Grid size={{ xs: 12 }}>
              <Box display="flex" justifyContent="center">
                <Pagination
                  count={ccs.totalPages}
                  page={ccs.page}
                  color="primary"
                  onChange={actualizarParametros("p")}
                />
              </Box>
            </Grid>
          )}
        </>
      )}
    </Grid>
  );
  /* jshint ignore:end */
}

export default MostrarCCS;
