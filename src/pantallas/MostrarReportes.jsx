//Componentes de react y react router
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
//Componentes MUI
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  FilledInput,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
//Componentes endogenos
import AlertaError from "../componentes/AlertaError";
import BotonMenu from "../componentes/BotonMenu";
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Spinner from "../componentes/Spinner";
//Iconos MUI
import AssignmentLateRoundedIcon from "@mui/icons-material/AssignmentLateRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import FmdBadRoundedIcon from "@mui/icons-material/FmdBadRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

function MostrarReportes() {
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [parametros, setParametros] = useSearchParams();
  const [reportes, setReportes] = useState(null);
  const [saltarConsulta, setSaltarConsulta] = useState(false);
  const excepcionPromotor =
    miUsuario.rol !== "ADMINISTRADOR" &&
    miUsuario.id === parametros.get("usuario");

  const agregarParametrosURL = function (url) {
    let nuevaURL = url;

    if (parametros.get("cc")) {
      nuevaURL += `cc=${parametros.get("cc")}&`;
    }
    if (parametros.get("desde") && parametros.get("hasta")) {
      nuevaURL += `desde=${parametros.get("desde")}&hasta=${parametros.get(
        "hasta"
      )}&`;
    }
    if (parametros.get("dia")) {
      nuevaURL += `dia=${parametros.get("dia")}&`;
    }
    if (parametros.get("periodo")) {
      nuevaURL += `periodo=${parametros.get("periodo")}&`;
    }
    if (parametros.get("tipo")) {
      nuevaURL += `tipo=${parametros.get("tipo")}&`;
    }
    if (parametros.get("usuario")) {
      nuevaURL += `usuario=${parametros.get("usuario")}`;
    }

    return nuevaURL;
  };

  const actualizarParametros = function (campo) {
    return function (evento) {
      evento.preventDefault();
      let valorCampo = evento.target.value;

      //Logica de algunos campos
      if (campo === "dia") {
        parametros.delete("desde");
        parametros.delete("hasta");
        parametros.delete("periodo");
      }
      if (campo === "desde" || campo === "hasta") {
        parametros.delete("dia");
        parametros.delete("periodo");
      }
      if (campo === "periodo") {
        parametros.delete("desde");
        parametros.delete("hasta");
        parametros.delete("dia");
      }
      if (!valorCampo && campo === "desde") {
        parametros.delete("hasta");
      }
      if (!valorCampo && campo === "hasta") {
        parametros.delete("desde");
      }
      if (
        (!parametros.get("desde") && campo === "hasta") ||
        (!parametros.get("hasta") && campo === "desde")
      ) {
        setSaltarConsulta(true);
      }
      parametros.set(campo, valorCampo);

      let miConsulta = {};
      for (let [clave, valor] of parametros) {
        if (clave && valor) miConsulta[clave] = valor;
      }
      setParametros(miConsulta);
    };
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

  useEffect(() => {
    async function realizarPeticion() {
      setCargando(true);
      setError(null);

      const url = agregarParametrosURL("http://localhost:4000/reportes?");
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
          setReportes(recibido);
        } else {
          const recibido = await respuesta.json();
          setError(recibido.error);
          setReportes(null);
        }
      } catch (errorPeticion) {
        setError(errorPeticion);
        setReportes(null);
      } finally {
        setCargando(false);
      }
    }
    if (!saltarConsulta) realizarPeticion();
    else setSaltarConsulta(false);
  }, [parametros]);

  /* jshint ignore:start */
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card component="form">
          <CardHeader sx={{ bgcolor: "#1976d2", color: "white", p: 1 }} />
          <CardContent sx={{ "&:last-child": { pb: 2 } }}>
            <Grid container spacing={2}>
              <Grid item xs={2.5}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    onChange={actualizarParametros("tipo")}
                    value={parametros.get("tipo") || ""}
                  >
                    <MenuItem value="">CUALQUIERA</MenuItem>
                    <MenuItem value="casoadmin">CASOADMIN</MenuItem>
                    <MenuItem value="comunicaciones">COMUNICACIONES</MenuItem>
                    <MenuItem value="formacion">FORMACION</MenuItem>
                    <MenuItem value="fortalecimiento">FORTALECIMIENTO</MenuItem>
                    <MenuItem value="incidencias">INCIDENCIAS</MenuItem>
                    <MenuItem value="interno">INTERNO</MenuItem>
                    <MenuItem value="participacion">PARTICIPACION</MenuItem>
                    <MenuItem value="renovacion">RENOVACION</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2.5}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel shrink>Dia especifico</InputLabel>
                  <FilledInput
                    onChange={actualizarParametros("dia")}
                    type="date"
                    value={parametros.get("dia") || ""}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Periodo</InputLabel>
                  <Select
                    onChange={actualizarParametros("periodo")}
                    value={parametros.get("periodo") || ""}
                  >
                    <MenuItem value="">NINGUNO</MenuItem>
                    {obtenerPeriodos().map((periodo) => {
                      return (
                        <MenuItem key={`PER-${periodo}`} value={periodo}>
                          {periodo}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2.5}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel shrink>Desde</InputLabel>
                  <FilledInput
                    onChange={actualizarParametros("desde")}
                    type="date"
                    value={parametros.get("desde") || ""}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={2.5}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel shrink>Hasta</InputLabel>
                  <FilledInput
                    onChange={actualizarParametros("hasta")}
                    type="date"
                    value={parametros.get("hasta") || ""}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {cargando ? (
        <Spinner />
      ) : error ? (
        <AlertaError error={error} />
      ) : (
        reportes?.map((reporte) => {
          return (
            <Grid item xs={12} md={6} xl={4} key={reporte._id}>
              <Card elevation={6}>
                <CardHeader
                  disableTypography
                  action={
                    <BotonMenu
                      id={reporte._id}
                      opciones={{
                        verMas: [],
                        editar: excepcionPromotor ? [] : ["PROMOTOR"],
                      }}
                    />
                  }
                  avatar={
                    <Avatar sx={{ bgcolor: "#1976d2" }}>
                      {reporte.tipo === "casoadmin" ? (
                        <AssignmentLateRoundedIcon />
                      ) : reporte.tipo === "comunicaciones" ? (
                        <RssFeedRoundedIcon />
                      ) : reporte.tipo === "fortalecimiento" ? (
                        <ConstructionRoundedIcon />
                      ) : reporte.tipo === "formacion" ? (
                        <SchoolRoundedIcon />
                      ) : reporte.tipo === "incidencias" ? (
                        <FmdBadRoundedIcon />
                      ) : reporte.tipo === "participacion" ? (
                        <Diversity3RoundedIcon />
                      ) : (
                        <VerifiedRoundedIcon />
                      )}
                    </Avatar>
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
                      {reporte.fechaConFormato}
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
                        {reporte.cc.nombre}
                      </Typography>
                      <Typography
                        noWrap
                        sx={{ fontStyle: "italic" }}
                        textOverflow={"ellipsis"}
                        variant="body1"
                      >
                        {`${reporte.usuario.apellido} \
                    ${reporte.usuario.nombre}`}
                      </Typography>
                    </>
                  }
                />
              </Card>
            </Grid>
          );
        })
      )}
    </Grid>
  );
  /* jshint ignore:end */
}

export default MostrarReportes;
