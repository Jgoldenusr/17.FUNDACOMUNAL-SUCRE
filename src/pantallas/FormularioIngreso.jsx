//Componentes de react y react router
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
//Componentes MUI
import {
  Box,
  Button,
  Checkbox,
  FilledInput,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Paper,
  Typography,
} from "@mui/material";
//Componentes endogenos
import AlertaError from "../componentes/AlertaError";
import ContextoAutenticado from "../componentes/ContextoAutenticado";
//Iconos MUI
import FacebookRounded from "@mui/icons-material/FacebookRounded";
import GitHub from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import Send from "@mui/icons-material/Send";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import XIcon from "@mui/icons-material/X";

function FormularioIngreso() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [formulario, setFormulario] = useState({
    usuario: "",
    clave: "",
  });
  const [mostrarClave, setMostrarClave] = useState(false);
  const { guardarUsuario } = useContext(ContextoAutenticado);
  const navegarHasta = useNavigate();

  const actualizarFormulario = function (campo) {
    return function (evento) {
      setFormulario({ ...formulario, [campo]: evento.target.value });
    };
  };

  const clickMostrarClave = function () {
    setMostrarClave(!mostrarClave);
  };

  const mouseDownMostrarClave = function (evento) {
    evento.preventDefault();
  };

  const realizarPeticion = async function (evento) {
    evento.preventDefault();
    setCargando(true);
    setError(null);

    const url = "http://localhost:4000/usuarios/ingresar";
    const peticion = {
      body: JSON.stringify(formulario),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      mode: "cors",
      method: "POST",
    };

    try {
      const respuesta = await fetch(url, peticion);
      if (respuesta.ok) {
        const recibido = await respuesta.json();
        guardarUsuario(recibido);
        navegarHasta("/", { replace: true });
      } else {
        const recibido = await respuesta.json();
        setError(recibido.error);
      }
    } catch (errorPeticion) {
      setError(errorPeticion);
    } finally {
      setCargando(false);
    }
  };

  return (
    /* jshint ignore:start */
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid item xs={false} sm={4} md={7} sx={{ position: "relative" }}>
        <Box
          sx={{
            height: "100%",
            backgroundImage: "url('/logo-principal.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "0",
            left: "0",
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(25,118,210, 0.3)",
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        sx={{
          backgroundImage: "url('/body.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        component={Paper}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            component="img"
            sx={{
              backgroundColor: "#1976d2",
              width: "100%",
              height: "8vh",
              justifySelf: "flex-start",
            }}
            src="/cintillo.png"
          />
          <Box component="img" src="/logo.png" sx={{ mt: 4 }} />
          <Box
            noValidate
            component="form"
            onSubmit={realizarPeticion}
            sx={{ mx: 3 }}
          >
            <FormControl fullWidth margin="normal" variant="filled">
              <InputLabel>Usuario</InputLabel>
              <FilledInput
                autoFocus
                autoComplete="username"
                inputProps={{ maxLength: 20 }}
                onChange={actualizarFormulario("usuario")}
                value={formulario.usuario}
              />
            </FormControl>
            <FormControl fullWidth margin="normal" variant="filled">
              <InputLabel>Clave</InputLabel>
              <FilledInput
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={clickMostrarClave}
                      onMouseDown={mouseDownMostrarClave}
                      edge="end"
                    >
                      {mostrarClave ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                inputProps={{ maxLength: 30 }}
                onChange={actualizarFormulario("clave")}
                type={mostrarClave ? "text" : "password"}
                value={formulario.clave}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="recordar" color="primary" />}
              label="Recordar mis datos"
            />
            <Button
              fullWidth
              disabled={cargando}
              endIcon={<Send />}
              size="large"
              sx={{ mb: 2, mt: 2 }}
              type="submit"
              variant="contained"
            >
              Ingresar
            </Button>
          </Box>
          <Box sx={{ mt: 3 }}>
            <IconButton href="https://www.facebook.com/fundacomunalsucre">
              <FacebookRounded />
            </IconButton>
            <IconButton href="https://www.twitter.com/fundacomunalsu2">
              <XIcon />
            </IconButton>
            <IconButton href="https://www.instagram.com/fundacomunalsucre">
              <InstagramIcon />
            </IconButton>
            <IconButton href="https://github.com/Jgoldenusr/17.FUNDACOMUNAL-SUCRE">
              <GitHub />
            </IconButton>
          </Box>
          <Box sx={{ px: 3 }}>
            <Typography
              align="center"
              variant="subtitle2"
              sx={{ color: "gray", fontSize: "0.7rem" }}
            >
              Final de la Avenida Humbold, cruce con calle Araya, Cumana -
              Estado Sucre © FUNDACOMUNAL. Todos los derechos reservados.
            </Typography>
            <Typography
              align="center"
              variant="subtitle2"
              sx={{ color: "gray", fontSize: "0.7rem" }}
            >
              CONTACTO AL: cyefundasucre@gmail.com
            </Typography>
          </Box>
          {error ? <AlertaError error={error} /> : ""}
        </Box>
      </Grid>
    </Grid>
    /* jshint ignore:end */
  );
}

export default FormularioIngreso;
