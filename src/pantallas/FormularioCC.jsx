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
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
//Iconos MUI
import AddLocationAltRoundedIcon from "@mui/icons-material/AddLocationAltRounded";
import EditLocationAltRoundedIcon from "@mui/icons-material/EditLocationAltRounded";
import Send from "@mui/icons-material/Send";
//Componentes endogenos
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Error from "../componentes/Error";
import Spinner from "../componentes/Spinner";
import { formularioVacioCC } from "../config/plantillas";
import { OpcionesCC } from "../config/opciones";

function FormularioCC() {
  const navegarHasta = useNavigate();
  const { id } = useParams();
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState(null);
  const [formulario, setFormulario] = useState({ ...formularioVacioCC });
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    async function buscarCCParaEditar() {
      const url = "http://localhost:4000/ccs/" + id;
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
      buscarCCParaEditar();
    } else {
      setFormulario({ ...formularioVacioCC });
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
            comuna: "",
            parroquias: "",
            [campo]: evento.target.value,
          });
        } else if (campo === "parroquias") {
          setFormulario({
            ...formulario,
            comuna: "",
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
      ? "http://localhost:4000/ccs/" + formulario._id
      : "http://localhost:4000/ccs";
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
        navegarHasta(`/ccs/${recibido.id}`, { replace: true });
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
    <Grid container justifyContent="center">
      <Grid item xs={12} md={10}>
        <Card component="form" elevation={6} onSubmit={realizarPeticion}>
          <CardContent
            sx={{ bgcolor: "#1976d2", color: "white", textAlign: "center" }}
          >
            {id ? (
              <>
                <EditLocationAltRoundedIcon sx={{ fontSize: 56 }} />
                <Typography component="div" variant="h5">
                  Actualizar consejo comunal
                </Typography>
              </>
            ) : (
              <>
                <AddLocationAltRoundedIcon sx={{ fontSize: 56 }} />
                <Typography component="div" variant="h5">
                  Registrar nuevo consejo comunal
                </Typography>
              </>
            )}
          </CardContent>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Estado donde se ubica el C.C.</InputLabel>
                  <Select
                    disabled
                    error={esInvalido("estados")}
                    onChange={actualizarFormulario("estados")}
                    value={formulario.estados}
                  >
                    <MenuItem value="SUCRE">SUCRE</MenuItem>
                  </Select>
                  <FormHelperText error>
                    {mostrarMsjInvalido("estados")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Redi del consejo comunal</InputLabel>
                  <Select
                    disabled
                    error={esInvalido("redi")}
                    onChange={actualizarFormulario("redi")}
                    value={formulario.redi}
                  >
                    {OpcionesCC.redi.map((opcion) => (
                      <MenuItem key={opcion} value={opcion}>
                        {opcion}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error>
                    {mostrarMsjInvalido("redi")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Tipo de consejo comunal</InputLabel>
                  <Select
                    error={esInvalido("tipo")}
                    onChange={actualizarFormulario("tipo")}
                    value={formulario.tipo}
                  >
                    {OpcionesCC.tipo.map((opcion) => (
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Municipio donde se ubica el C.C.</InputLabel>
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Parroquia donde se ubica el C.C.</InputLabel>
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>
                    Comuna donde se incluye el C.C. (Opcional)
                  </InputLabel>
                  <Select
                    error={esInvalido("comuna")}
                    onChange={actualizarFormulario("comuna")}
                    value={formulario.comuna}
                  >
                    <MenuItem value="">SIN COMUNA</MenuItem>
                    {formulario.parroquias &&
                      OpcionesCC.comuna[`${formulario.parroquias}`] &&
                      OpcionesCC.comuna[`${formulario.parroquias}`].map(
                        (opcion) => (
                          <MenuItem key={opcion} value={opcion}>
                            {opcion}
                          </MenuItem>
                        )
                      )}
                  </Select>
                  <FormHelperText error>
                    {mostrarMsjInvalido("comuna")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Localidad donde se ubica el C.C.</InputLabel>
                  <FilledInput
                    error={esInvalido("localidad")}
                    inputProps={{ maxLength: 100 }}
                    onChange={actualizarFormulario("localidad")}
                    value={formulario.localidad}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("localidad")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Nombre del consejo comunal</InputLabel>
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
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Cedula del usuario asociado</InputLabel>
                  <FilledInput
                    error={esInvalido("usuario.cedula")}
                    inputProps={{ maxLength: 11 }}
                    onChange={actualizarFormulario("cedula", "usuario")}
                    value={formulario.usuario.cedula}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("usuario.cedula")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Codigo situr del consejo comunal</InputLabel>
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
              <Grid item xs={12} md={6}>
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
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  /* jshint ignore:end */
}

/*

*/
export default FormularioCC;
