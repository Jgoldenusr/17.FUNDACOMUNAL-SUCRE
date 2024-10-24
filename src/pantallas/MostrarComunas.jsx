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
import GiteRoundedIcon from "@mui/icons-material/GiteRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
//Etc
import { OpcionesCC } from "../config/opciones";

function MostrarComunas() {
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [comunas, setComunas] = useState(null);
  const [error, setError] = useState(null);
  const [parametros, setParametros] = useSearchParams();
  const [realizarConsulta, setRealizarConsulta] = useState(true);

  const agregarParametrosURL = function (url) {
    let nuevaURL = url;

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

  const manejarConsulta = function (evento) {
    evento.preventDefault();
    setRealizarConsulta(true);
  };

  useEffect(() => {
    async function realizarPeticion() {
      setCargando(true);
      setError(null);

      const url = agregarParametrosURL("http://localhost:4000/comunas?");
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
          setComunas(recibido);
        } else {
          const recibido = await respuesta.json();
          setError(recibido.error);
          setComunas(null);
        }
      } catch (errorPeticion) {
        setError(errorPeticion);
        setComunas(null);
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
              <Grid size={{ xs: 6, md: 3 }}>
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
              <Grid size={{ xs: 6, md: 3 }}>
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
              <Grid size={{ xs: 6, md: 2 }}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    onChange={actualizarParametros("tipo")}
                    value={parametros.get("tipo") || ""}
                  >
                    <MenuItem value="">CUALQUIERA</MenuItem>
                    {OpcionesCC.tipoComuna?.map((opcion) => {
                      return (
                        <MenuItem key={opcion} value={opcion}>
                          {opcion}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
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
                  <SearchRoundedIcon />
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
          {comunas?.docs?.map((comuna) => {
            return (
              <Grid size={{ xs: 12, md: 6, xl: 4 }} key={comuna._id}>
                <Card elevation={6}>
                  <CardHeader
                    disableTypography
                    action={
                      <BotonMenu
                        id={comuna._id}
                        opciones={{
                          editar: ["PROMOTOR"],
                          reportes: [],
                          verMas: [],
                        }}
                        ruta="comunas"
                      />
                    }
                    avatar={
                      <Badge
                        color="error"
                        invisible={!!(comuna.cc?.length > 0 && comuna.usuario)}
                        variant="dot"
                      >
                        <Avatar sx={{ bgcolor: "#1976d2" }}>
                          {comuna.tipo === "INDIGENA" ? (
                            <ForestRoundedIcon />
                          ) : comuna.tipo === "RURAL" ? (
                            <CabinRoundedIcon />
                          ) : comuna.tipo === "SUB-URBANO O MIXTO" ? (
                            <GiteRoundedIcon />
                          ) : (
                            <HomeWorkRoundedIcon />
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
                        {comuna.situr}
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
                          {comuna.nombre}
                        </Typography>
                        <Typography
                          noWrap
                          sx={{ fontStyle: "italic" }}
                          textOverflow={"ellipsis"}
                          variant="body1"
                        >
                          {`${comuna.municipios}, ${comuna.parroquias}`}
                        </Typography>
                      </>
                    }
                  />
                </Card>
              </Grid>
            );
          })}
          {comunas?.totalPages > 1 && (
            <Grid size={{ xs: 12 }}>
              <Box display="flex" justifyContent="center">
                <Pagination
                  count={comunas.totalPages}
                  page={comunas.page}
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

export default MostrarComunas;
