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
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
//Iconos MUI
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import FlagCircleRoundedIcon from "@mui/icons-material/FlagCircleRounded";
import OutlinedFlagRoundedIcon from "@mui/icons-material/OutlinedFlagRounded";
import Send from "@mui/icons-material/Send";
//Componentes endogenos
import AlertaBorrar from "../componentes/AlertaBorrar";
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Error from "../componentes/Error";
import Spinner from "../componentes/Spinner";
import { formularioVacioComuna } from "../config/plantillas";
//Etc
import { OpcionesCC } from "../config/opciones";

function FormularioComuna() {
  const navegarHasta = useNavigate();
  const { id } = useParams();
  const { miUsuario } = useContext(ContextoAutenticado);
  const [borrar, setBorrar] = useState(false);
  const [cargando, setCargando] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState(null);
  const [formulario, setFormulario] = useState({ ...formularioVacioComuna });
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    async function buscarComunaParaEditar() {
      const url = "http://localhost:4000/comunas/" + id;
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
      buscarComunaParaEditar();
    } else {
      setFormulario({ ...formularioVacioComuna });
    }
  }, [id]);

  const actualizarFormulario = function (campo, propiedad) {
    return function (evento) {
      if (propiedad) {
        setFormulario({
          ...formulario,
          [propiedad]: { [campo]: evento.target.value },
        });
      } else {
        if (campo === "municipios") {
          setFormulario({
            ...formulario,
            parroquias: "",
            [campo]: evento.target.value,
          });
        } else {
          setFormulario({
            ...formulario,
            [campo]: evento.target.value,
          });
        }
      }
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

  const realizarPeticion = async function (evento) {
    evento.preventDefault();
    setSubiendo(true);
    setErroresValidacion(null);
    /* jshint ignore:start */
    const url = id
      ? "http://localhost:4000/comunas/" + formulario._id
      : "http://localhost:4000/comunas";
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
        navegarHasta(`/comunas/${recibido.id}`, { replace: true });
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
    const url = "http://localhost:4000/comunas/" + formulario._id;
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
        navegarHasta("/comunas", { replace: true });
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
                <FlagCircleRoundedIcon sx={{ fontSize: 56 }} />
                <Typography component="div" variant="h5">
                  Actualizar comuna
                </Typography>
              </>
            ) : (
              <>
                <OutlinedFlagRoundedIcon sx={{ fontSize: 56 }} />
                <Typography component="div" variant="h5">
                  Registrar nueva comuna
                </Typography>
              </>
            )}
          </CardContent>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Estado donde se ubica la comuna</InputLabel>
                  <Select disabled value={formulario.estados}>
                    <MenuItem value="SUCRE">SUCRE</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Municipio donde se ubica la comuna</InputLabel>
                  <Select
                    error={esInvalido("municipios")}
                    onChange={actualizarFormulario("municipios")}
                    value={formulario.municipios}
                  >
                    {OpcionesCC.municipios.map((opcion) => (
                      <MenuItem key={opcion} value={opcion}>
                        {opcion}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error>
                    {mostrarMsjInvalido("municipios")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Parroquia donde se ubica la comuna</InputLabel>
                  <Select
                    error={esInvalido("parroquias")}
                    onChange={actualizarFormulario("parroquias")}
                    value={formulario.parroquias}
                  >
                    {formulario.municipios &&
                      OpcionesCC.parroquias[`${formulario.municipios}`].map(
                        (opcion) => (
                          <MenuItem key={opcion} value={opcion}>
                            {opcion}
                          </MenuItem>
                        )
                      )}
                  </Select>
                  <FormHelperText error>
                    {mostrarMsjInvalido("parroquias")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Tipo de comuna</InputLabel>
                  <Select
                    error={esInvalido("tipo")}
                    onChange={actualizarFormulario("tipo")}
                    value={formulario.tipo}
                  >
                    {OpcionesCC.tipoComuna.map((opcion) => (
                      <MenuItem key={opcion} value={opcion}>
                        {opcion}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error>
                    {mostrarMsjInvalido("tipo")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Nombre de la comuna</InputLabel>
                  <FilledInput
                    error={esInvalido("nombre")}
                    inputProps={{ maxLength: 100 }}
                    onChange={actualizarFormulario("nombre")}
                    value={formulario.nombre}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("nombre")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Cedula del usuario asociado</InputLabel>
                  <FilledInput
                    error={esInvalido("usuario.cedula")}
                    inputProps={{ maxLength: 11 }}
                    onChange={actualizarFormulario("cedula", "usuario")}
                    value={formulario.usuario?.cedula || ""}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("usuario.cedula")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Codigo situr de la comuna</InputLabel>
                  <FilledInput
                    error={esInvalido("situr")}
                    inputProps={{ maxLength: 20 }}
                    onChange={actualizarFormulario("situr")}
                    value={formulario.situr}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("situr")}
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

/*

*/
export default FormularioComuna;
