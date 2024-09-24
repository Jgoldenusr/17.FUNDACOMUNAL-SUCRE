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
  InputLabel,
  Typography,
} from "@mui/material";
//Iconos MUI
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import Send from "@mui/icons-material/Send";
//Componentes endogenos
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Error from "../componentes/Error";
import Spinner from "../componentes/Spinner";
import { formularioVacioOpcion } from "../config/plantillas";

function FormularioOpcion() {
  const navegarHasta = useNavigate();
  const { id } = useParams();
  const [cargando, setCargando] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState(null);
  const [formulario, setFormulario] = useState(formularioVacioOpcion);
  const [subiendo, setSubiendo] = useState(false);
  const { miUsuario } = useContext(ContextoAutenticado);

  useEffect(() => {
    //Se declaran estas dos funciones para buscar los datos
    async function buscarOpcion() {
      const url = "http://localhost:4000/config/" + id;
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
    buscarOpcion();
  }, []);

  const actualizarFormulario = function (campo, i) {
    return function (evento) {
      if (i && i >= 0) {
        const temp = formulario[campo].map((item, idx) => {
          if (i !== idx) return item;
          return evento.target.value;
        });
        setFormulario({
          ...formulario,
          [campo]: temp,
        });
      } else {
        setFormulario({
          ...formulario,
          [campo]: evento.target.value,
        });
      }
    };
  };

  const agregarAlArray = function () {
    setFormulario({
      ...formulario,
      array: formulario.array.concat([""]),
    });
  };

  const borrarDelArray = function (i) {
    return function () {
      let miArray = [...formulario.array];
      if (miArray.length > 1) {
        miArray = miArray.filter((item, itemId) => i !== itemId);
      } else {
        miArray = [""];
      }
      setFormulario({
        ...formulario,
        array: miArray,
      });
      setErroresValidacion(null);
    };
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

  const realizarPeticion = async function (evento) {
    evento.preventDefault();
    setSubiendo(true);
    setErroresValidacion(null);
    /* jshint ignore:start */
    const url = `http://localhost:4000/config/${formulario._id}`;
    /* jshint ignore:end */
    const peticion = {
      body: JSON.stringify(formulario),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${miUsuario.token}`,
      }),
      mode: "cors",
      method: "PUT",
    };

    try {
      const respuesta = await fetch(url, peticion);
      if (respuesta.ok) {
        navegarHasta("/config", { replace: true });
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
            <TuneOutlinedIcon sx={{ fontSize: 56 }} />
            <Typography component="div" variant="h5">
              Editar opcion
            </Typography>
          </CardContent>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Coleccion</InputLabel>
                  <FilledInput
                    error={esInvalido("coleccion")}
                    inputProps={{ maxLength: 30 }}
                    onChange={actualizarFormulario("coleccion")}
                    value={formulario.coleccion}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("coleccion")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Campo (URI)</InputLabel>
                  <FilledInput
                    error={esInvalido("campo")}
                    inputProps={{ maxLength: 100 }}
                    onChange={actualizarFormulario("campo")}
                    value={formulario.campo}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("campo")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {formulario.array.map((item, i) => {
                return (
                  <Grid container key={`ARR-${i}`} size={12} spacing={3}>
                    <Grid size={10}>
                      <FormControl fullWidth variant="filled">
                        <InputLabel>Opcion</InputLabel>
                        <FilledInput
                          error={esInvalido(`array[${i}]`)}
                          onChange={actualizarFormulario("array", i)}
                          value={item}
                        />
                        <FormHelperText error>
                          {mostrarMsjInvalido(`array[${i}]`)}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      alignItems="center"
                      display="flex"
                      justifyContent="center"
                      size={2}
                    >
                      <IconButton color="primary" onClick={agregarAlArray}>
                        <AddRoundedIcon />
                      </IconButton>
                      <IconButton color="error" onClick={borrarDelArray(i)}>
                        <RemoveRoundedIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                );
              })}
              <Grid size={{ xs: 12 }}>
                <Button
                  fullWidth
                  color="primary"
                  disabled={subiendo}
                  endIcon={<Send />}
                  size="large"
                  sx={{ height: 56 }}
                  type="submit"
                  variant="contained"
                >
                  Actualizar configuracion
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  /* jshint ignore:end */
}

export default FormularioOpcion;
