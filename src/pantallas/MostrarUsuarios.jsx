//Componentes de react y react router
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
//Componentes MUI
import {
  Avatar,
  Badge,
  Button,
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
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TuneIcon from "@mui/icons-material/Tune";

function MostrarUsuarios() {
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [parametros, setParametros] = useSearchParams();
  const [realizarConsulta, setRealizarConsulta] = useState(true);
  const [usuarios, setUsuarios] = useState(null);

  const agregarParametrosURL = function (url) {
    let nuevaURL = url;

    if (parametros.get("apellido")) {
      nuevaURL += `apellido=${parametros.get("apellido").toUpperCase()}&`;
    }
    if (parametros.get("cedula")) {
      nuevaURL += `cedula=${parametros.get("cedula")}&`;
    }
    if (parametros.get("nombre")) {
      nuevaURL += `nombre=${parametros.get("nombre").toUpperCase()}&`;
    }
    if (parametros.get("rol")) {
      nuevaURL += `rol=${parametros.get("rol")}&`;
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
      let miConsulta = {};
      parametros.set(campo, valorCampo);
      for (let [clave, valor] of parametros) {
        if (clave && valor) miConsulta[clave] = valor;
      }
      setParametros(miConsulta);
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

      const url = agregarParametrosURL("http://localhost:4000/usuarios?");
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
          setUsuarios(recibido);
        } else {
          const recibido = await respuesta.json();
          setError(recibido.error);
          setUsuarios(null);
        }
      } catch (errorPeticion) {
        setError(errorPeticion);
        setUsuarios(null);
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
      <Grid item xs={12}>
        <Card component="form" onSubmit={manejarConsulta}>
          <CardHeader sx={{ bgcolor: "#1976d2", color: "white", p: 1 }} />
          <CardContent sx={{ "&:last-child": { pb: 2 } }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Cedula</InputLabel>
                  <FilledInput
                    inputProps={{ maxLength: 9 }}
                    onChange={actualizarParametros("cedula")}
                    value={parametros.get("cedula") || ""}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Usuario</InputLabel>
                  <FilledInput
                    inputProps={{ maxLength: 20 }}
                    onChange={actualizarParametros("usuario")}
                    value={parametros.get("usuario") || ""}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Rol</InputLabel>
                  <Select
                    onChange={actualizarParametros("rol")}
                    value={parametros.get("rol") || ""}
                  >
                    <MenuItem value="">CUALQUIERA</MenuItem>
                    <MenuItem value="ADMINISTRADOR">ADMINISTRADOR</MenuItem>
                    <MenuItem value="PROMOTOR">PROMOTOR</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2.5}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Nombre</InputLabel>
                  <FilledInput
                    inputProps={{ maxLength: 20 }}
                    onChange={actualizarParametros("nombre")}
                    value={parametros.get("nombre") || ""}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={2.5}>
                <FormControl fullWidth size="small" variant="filled">
                  <InputLabel>Apellido</InputLabel>
                  <FilledInput
                    inputProps={{ maxLength: 20 }}
                    onChange={actualizarParametros("apellido")}
                    value={parametros.get("apellido") || ""}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={1}>
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
        <AlertaError error={error} />
      ) : (
        usuarios?.map((usuario) => {
          return (
            <Grid item xs={12} md={4} xl={3} key={usuario._id}>
              <Card elevation={6}>
                <CardHeader
                  disableTypography
                  action={
                    <BotonMenu
                      id={usuario._id}
                      opciones={{
                        editar: [],
                        ocultar: ["PROMOTOR"],
                        reportes: [],
                        verMas: [],
                      }}
                      ruta="usuarios"
                    />
                  }
                  avatar={
                    <Badge
                      badgeContent={usuario.cc.length}
                      color="error"
                      max={999}
                      overlap="circular"
                    >
                      <Avatar sx={{ bgcolor: "#1976d2" }}>
                        {usuario.rol === "ADMINISTRADOR" ? (
                          <AdminPanelSettingsIcon />
                        ) : (
                          <PersonRoundedIcon />
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
                      {usuario.cedula}
                    </Typography>
                  }
                  title={
                    <Typography
                      noWrap
                      textOverflow={"ellipsis"}
                      variant="body1"
                    >
                      {`${usuario.apellido} ${usuario.nombre}`}
                    </Typography>
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

export default MostrarUsuarios;
