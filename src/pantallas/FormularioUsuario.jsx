//Componentes de react y react router
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
//Componentes MUI
import {
  Button,
  Card,
  CardContent,
  FilledInput,
  FormControl,
  FormHelperText,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
//Iconos MUI
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import Send from "@mui/icons-material/Send";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
//Componentes endogenos
import AlertaBorrar from "../componentes/AlertaBorrar";
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Error from "../componentes/Error";
import Spinner from "../componentes/Spinner";
import { formularioVacioUsuario } from "../config/plantillas";

function FormularioUsuario() {
  const navegarHasta = useNavigate();
  const { id } = useParams();
  const { miUsuario } = useContext(ContextoAutenticado);
  const [borrar, setBorrar] = useState(false);
  const [cargando, setCargando] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState(null);
  const [formulario, setFormulario] = useState({ ...formularioVacioUsuario });
  const [mostrarClave, setMostrarClave] = useState(false);
  const [mostrarClave2, setMostrarClave2] = useState(false);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    async function buscarUsuarioParaEditar() {
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
          setFormulario(recibido);
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
    if (id) {
      buscarUsuarioParaEditar();
    } else {
      setFormulario({ ...formularioVacioUsuario });
    }
  }, [id]);

  const actualizarFormulario = function (campo) {
    return function (evento) {
      setFormulario({ ...formulario, [campo]: evento.target.value });
    };
  };

  const clickMostrarClave = function () {
    setMostrarClave(!mostrarClave);
  };

  const clickMostrarClave2 = function () {
    setMostrarClave2(!mostrarClave2);
  };

  const esInvalido = function (campo) {
    let resultado = false;
    if (erroresValidacion && erroresValidacion.array) {
      erroresValidacion.array.forEach((error) => {
        if (error.path === campo) {
          resultado = true;
        }
      });
    }
    return resultado;
  };

  const mostrarAlertaBorrar = function () {
    setErroresValidacion(null);
    setBorrar(true);
  };

  const mostrarMsjInvalido = function (campo) {
    let msj = "";
    if (erroresValidacion && erroresValidacion.array) {
      erroresValidacion.array.forEach((error) => {
        if (error.path === campo) {
          msj = error.msg;
        }
      });
    }
    return msj;
  };

  const mouseDownMostrarClave = function (evento) {
    evento.preventDefault();
  };

  const realizarPeticion = async function (evento) {
    evento.preventDefault();
    setSubiendo(true);
    setErroresValidacion(null);
    /* jshint ignore:start */
    const url = id
      ? "http://localhost:4000/usuarios/" + formulario._id
      : "http://localhost:4000/usuarios";
    /* jshint ignore:end */
    const peticion = {
      body: JSON.stringify(formulario),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${miUsuario.token}`,
      }),
      mode: "cors",
      method: id ? "PUT" : "POST",
    };

    try {
      const respuesta = await fetch(url, peticion);
      if (respuesta.ok) {
        const recibido = await respuesta.json();
        navegarHasta(`/usuarios/${recibido.id}`, { replace: true });
      } else {
        const recibido = await respuesta.json();
        if (recibido.error.array) {
          setErroresValidacion(recibido.error);
        } else {
          setError(recibido.error);
        }
      }
    } catch (errorPeticion) {
      setError(errorPeticion);
    } finally {
      setSubiendo(false);
    }
  };

  const realizarPeticionBorrar = async function () {
    setSubiendo(true);
    /* jshint ignore:start */
    const url = "http://localhost:4000/usuarios/" + formulario._id;
    /* jshint ignore:end */
    const peticion = {
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${miUsuario.token}`,
      }),
      mode: "cors",
      method: "DELETE",
    };

    try {
      const respuesta = await fetch(url, peticion);
      if (respuesta.ok) {
        navegarHasta("/usuarios", { replace: true });
      } else {
        const recibido = await respuesta.json();
        setError(recibido.error);
      }
    } catch (errorPeticion) {
      setError(errorPeticion);
    } finally {
      setSubiendo(false);
    }
  };

  /* jshint ignore:start */
  return cargando ? (
    <Spinner />
  ) : error ? (
    <Error error={error} />
  ) : (
    <Grid container display="flex" justifyContent="center">
      <Grid size={{ xs: 12, md: 10 }}>
        <Card component="form" elevation={6} onSubmit={realizarPeticion}>
          <CardContent
            sx={{ bgcolor: "#1976d2", color: "white", textAlign: "center" }}
          >
            {id ? (
              <>
                <ManageAccountsRoundedIcon sx={{ fontSize: 56 }} />
                <Typography component="div" variant="h5">
                  Actualizar usuario
                </Typography>
              </>
            ) : (
              <>
                <PersonAddAltRoundedIcon sx={{ fontSize: 56 }} />
                <Typography component="div" variant="h5">
                  Registrar nuevo usuario
                </Typography>
              </>
            )}
          </CardContent>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Primer nombre</InputLabel>
                  <FilledInput
                    error={esInvalido("nombre")}
                    inputProps={{ maxLength: 20 }}
                    onChange={actualizarFormulario("nombre")}
                    value={formulario.nombre}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("nombre")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Primer apellido</InputLabel>
                  <FilledInput
                    error={esInvalido("apellido")}
                    inputProps={{ maxLength: 20 }}
                    onChange={actualizarFormulario("apellido")}
                    value={formulario.apellido}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("apellido")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Cedula</InputLabel>
                  <FilledInput
                    error={esInvalido("cedula")}
                    inputProps={{ maxLength: 11 }}
                    onChange={actualizarFormulario("cedula")}
                    value={formulario.cedula}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("cedula")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Nombre de usuario</InputLabel>
                  <FilledInput
                    error={esInvalido("usuario")}
                    inputProps={{ maxLength: 20 }}
                    onChange={actualizarFormulario("usuario")}
                    value={formulario.usuario}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("usuario")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Rol</InputLabel>
                  <Select
                    error={esInvalido("rol")}
                    onChange={actualizarFormulario("rol")}
                    value={formulario.rol}
                  >
                    <MenuItem value="PROMOTOR">PROMOTOR</MenuItem>
                    <MenuItem value="ADMINISTRADOR">ADMINISTRADOR</MenuItem>
                  </Select>
                  <FormHelperText error>
                    {mostrarMsjInvalido("rol")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Clave</InputLabel>
                  <FilledInput
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
                  <FormHelperText error>
                    {mostrarMsjInvalido("clave")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Confirme la clave</InputLabel>
                  <FilledInput
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={clickMostrarClave2}
                          onMouseDown={mouseDownMostrarClave}
                          edge="end"
                        >
                          {mostrarClave2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    inputProps={{ maxLength: 30 }}
                    onChange={actualizarFormulario("clave2")}
                    type={mostrarClave2 ? "text" : "password"}
                    value={formulario.clave2}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("clave2")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Numero telefonico</InputLabel>
                  <FilledInput
                    error={esInvalido("tlf")}
                    inputProps={{ maxLength: 12 }}
                    onChange={actualizarFormulario("tlf")}
                    value={formulario.tlf}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("tlf")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>E-mail</InputLabel>
                  <FilledInput
                    error={esInvalido("email")}
                    inputProps={{ maxLength: 50 }}
                    onChange={actualizarFormulario("email")}
                    value={formulario.email}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("email")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={id ? 6 : 12}>
                <Button
                  fullWidth
                  disabled={subiendo}
                  endIcon={<Send />}
                  size="large"
                  sx={{ height: 56 }}
                  type="submit"
                  variant="contained"
                >
                  {id ? "Actualizar" : "Registrar"}
                </Button>
              </Grid>
              {id ? (
                <Grid size={6}>
                  <Button
                    fullWidth
                    color="error"
                    disabled={subiendo}
                    endIcon={<DeleteRoundedIcon />}
                    onClick={mostrarAlertaBorrar}
                    size="large"
                    sx={{ height: 56 }}
                    variant="contained"
                  >
                    Borrar
                  </Button>
                </Grid>
              ) : (
                ""
              )}
            </Grid>
          </CardContent>
          {borrar ? (
            <AlertaBorrar
              realizarPeticion={realizarPeticionBorrar}
              setBorrar={setBorrar}
            />
          ) : (
            ""
          )}
        </Card>
      </Grid>
    </Grid>
  );
  /* jshint ignore:end */
}

export default FormularioUsuario;
