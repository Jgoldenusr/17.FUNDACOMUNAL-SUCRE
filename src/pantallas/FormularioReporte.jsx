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
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
//Iconos MUI
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import PlagiarismRoundedIcon from "@mui/icons-material/PlagiarismRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import Send from "@mui/icons-material/Send";
//Componentes endogenos
import AlertaBorrar from "../componentes/AlertaBorrar";
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Error404 from "../componentes/Error404";
import Spinner from "../componentes/Spinner";
import {
  formularioCasoAdmin,
  formularioComunicaciones,
  formularioFormacion,
  formularioFortalecimiento,
  formularioIncidencias,
  formularioParticipacion,
} from "../config/plantillas";
import { OpcionesReporte } from "../config/opciones";

function FormularioReporte() {
  const navegarHasta = useNavigate();
  const { id } = useParams();
  const [cargando, setCargando] = useState(id ? true : false);
  const [borrar, setBorrar] = useState(false);
  const [error, setError] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState(null);
  const [formulario, setFormulario] = useState(formularioParticipacion);
  const [subiendo, setSubiendo] = useState(false);
  const [tipo, setTipo] = useState("participacion");
  const { miUsuario } = useContext(ContextoAutenticado);

  useEffect(() => {
    //Se declaran estas dos funciones para buscar los datos
    async function buscarReporteParaEditar() {
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
          setFormulario(recibido);
          setTipo(recibido.tipo);
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
    //Ejecucion (cuando se carga el componente)
    if (id) {
      buscarReporteParaEditar();
    } else {
      setFormulario(formularioParticipacion);
      setTipo("participacion");
    }
  }, [id]);

  const actualizarFormulario = function (campo, propiedad, i) {
    return function (evento) {
      if (propiedad) {
        if (i >= 0) {
          const temp = formulario[propiedad].map((item, idx) => {
            if (i !== idx) return item;
            return { ...item, [campo]: evento.target.value };
          });
          setFormulario({
            ...formulario,
            [propiedad]: temp,
          });
        } else {
          setFormulario({
            ...formulario,
            [propiedad]: {
              ...formulario[propiedad],
              [campo]: evento.target.value,
            },
          });
        }
      } else {
        setFormulario({
          ...formulario,
          [campo]: evento.target.value,
        });
      }
    };
  };

  const agregarRedes = function () {
    setFormulario({
      ...formulario,
      redes: formulario.redes.concat([
        {
          cuenta: "",
          publicaciones: "",
        },
      ]),
    });
  };

  const borrarRedes = function (i) {
    return function () {
      setFormulario({
        ...formulario,
        redes: formulario.redes.filter((item, itemId) => i !== itemId),
      });
      setErroresValidacion(null);
    };
  };

  const cambiarTipoFormulario = function (evento) {
    switch (evento.target.value) {
      case "participacion":
        setFormulario(formularioParticipacion);
        break;
      case "formacion":
        setFormulario(formularioFormacion);
        break;
      case "fortalecimiento":
        setFormulario(formularioFortalecimiento);
        break;
      case "incidencias":
        setFormulario(formularioIncidencias);
        break;
      case "casoadmin":
        setFormulario(formularioCasoAdmin);
        break;
      case "comunicaciones":
        setFormulario(formularioComunicaciones);
        break;
    }
    setErroresValidacion(null);
    setTipo(evento.target.value);
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
      ? `http://localhost:4000/reportes/${tipo}/${formulario._id}`
      : `http://localhost:4000/reportes/${tipo}`;
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
        navegarHasta(`/reportes/${recibido.id}`, { replace: true });
      } else {
        const recibido = await respuesta.json();
        setErroresValidacion(recibido.error);
      }
    } catch (errorPeticion) {
      setErroresValidacion(errorPeticion);
    } finally {
      setSubiendo(false);
    }
  };

  const realizarPeticionBorrar = async function () {
    setSubiendo(true);
    /* jshint ignore:start */
    const url = "http://localhost:4000/reportes/" + formulario._id;
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
        navegarHasta("/reportes", { replace: true });
      } else {
        const recibido = await respuesta.json();
        setErroresValidacion(recibido.error);
      }
    } catch (errorPeticion) {
      setErroresValidacion(errorPeticion);
    } finally {
      setSubiendo(false);
    }
  };

  /* jshint ignore:start */
  return cargando ? (
    <Spinner />
  ) : error ? (
    <Error404 error={error} />
  ) : (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={10}>
        <Card component="form" elevation={6} onSubmit={realizarPeticion}>
          <CardContent
            sx={{ bgcolor: "#1976d2", color: "white", textAlign: "center" }}
          >
            {id ? (
              <>
                <PlagiarismRoundedIcon sx={{ fontSize: 56 }} />
                <Typography component="div" variant="h5">
                  Editar reporte
                </Typography>
              </>
            ) : (
              <>
                <NoteAddRoundedIcon sx={{ fontSize: 56 }} />
                <Typography component="div" variant="h5">
                  Agregar nuevo reporte
                </Typography>
              </>
            )}
          </CardContent>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Tipo de reporte</InputLabel>
                  <Select
                    disabled={id ? true : false}
                    onChange={cambiarTipoFormulario}
                    value={tipo}
                  >
                    <MenuItem value="casoadmin">CASO ADMINISTRATIVO</MenuItem>
                    <MenuItem value="comunicaciones">COMUNICACIONES</MenuItem>
                    <MenuItem value="fortalecimiento">FORTALECIMIENTO</MenuItem>
                    <MenuItem value="formacion">FORMACION</MenuItem>
                    <MenuItem value="incidencias">INCIDENCIAS</MenuItem>
                    <MenuItem value="participacion">PARTICIPACION</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="filled">
                  <InputLabel shrink>Fecha del reporte</InputLabel>
                  <FilledInput
                    onChange={actualizarFormulario("fecha")}
                    type="date"
                    value={formulario.fecha.substring(0, 10)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Consejo comunal</InputLabel>
                  <Select
                    error={esInvalido("cc")}
                    onChange={actualizarFormulario("cc")}
                    value={formulario.cc}
                  >
                    {miUsuario.cc.map((elemento) => (
                      <MenuItem key={elemento._id} value={elemento._id}>
                        {elemento.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error>
                    {mostrarMsjInvalido("cc")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {tipo === "participacion" ? (
                <>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Acompañamiento</InputLabel>
                      <Select
                        error={esInvalido("acompanamiento")}
                        onChange={actualizarFormulario("acompanamiento")}
                        value={formulario.acompanamiento}
                      >
                        {OpcionesReporte.participacion.acompanamiento.map(
                          (opcion) => (
                            <MenuItem key={opcion} value={opcion}>
                              {opcion}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText error>
                        {mostrarMsjInvalido("acompanamiento")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Familias beneficiadas</InputLabel>
                      <FilledInput
                        error={esInvalido("familiasBeneficiadas")}
                        inputProps={{ maxLength: 9 }}
                        onChange={actualizarFormulario("familiasBeneficiadas")}
                        value={formulario.familiasBeneficiadas}
                      />
                      <FormHelperText error>
                        {mostrarMsjInvalido("familiasBeneficiadas")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              ) : tipo === "formacion" ? (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Estrategia</InputLabel>
                      <Select
                        error={esInvalido("estrategia")}
                        onChange={actualizarFormulario("estrategia")}
                        value={formulario.estrategia}
                      >
                        {OpcionesReporte.formacion.estrategia.map((opcion) => (
                          <MenuItem key={opcion} value={opcion}>
                            {opcion}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error>
                        {mostrarMsjInvalido("estrategia")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Modalidad</InputLabel>
                      <Select
                        error={esInvalido("modalidad")}
                        onChange={actualizarFormulario("modalidad")}
                        value={formulario.modalidad}
                      >
                        {OpcionesReporte.formacion.modalidad.map((opcion) => (
                          <MenuItem key={opcion} value={opcion}>
                            {opcion}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error>
                        {mostrarMsjInvalido("modalidad")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Tematica</InputLabel>
                      <Select
                        error={esInvalido("tematica")}
                        onChange={actualizarFormulario("tematica")}
                        value={formulario.tematica}
                      >
                        {OpcionesReporte.formacion.tematica.map((opcion) => (
                          <MenuItem key={opcion} value={opcion}>
                            {opcion}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error>
                        {mostrarMsjInvalido("tematica")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Verificacion</InputLabel>
                      <Select
                        error={esInvalido("verificacion")}
                        onChange={actualizarFormulario("verificacion")}
                        value={formulario.verificacion}
                      >
                        {OpcionesReporte.formacion.verificacion.map(
                          (opcion) => (
                            <MenuItem key={opcion} value={opcion}>
                              {opcion}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText error>
                        {mostrarMsjInvalido("verificacion")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Beneficiados (hombres)</InputLabel>
                      <FilledInput
                        error={esInvalido("beneficiados.hombres")}
                        inputProps={{ maxLength: 9 }}
                        onChange={actualizarFormulario(
                          "hombres",
                          "beneficiados"
                        )}
                        value={formulario.beneficiados.hombres}
                      />
                      <FormHelperText error>
                        {mostrarMsjInvalido("beneficiados.hombres")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Beneficiados (mujeres)</InputLabel>
                      <FilledInput
                        error={esInvalido("beneficiados.mujeres")}
                        inputProps={{ maxLength: 9 }}
                        onChange={actualizarFormulario(
                          "mujeres",
                          "beneficiados"
                        )}
                        value={formulario.beneficiados.mujeres}
                      />
                      <FormHelperText error>
                        {mostrarMsjInvalido("beneficiados.mujeres")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              ) : tipo === "fortalecimiento" ? (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>
                        Nombre de la organizacion socioproductiva
                      </InputLabel>
                      <FilledInput
                        error={esInvalido("nombreOSP")}
                        inputProps={{ maxLength: 100 }}
                        onChange={actualizarFormulario("nombreOSP")}
                        value={formulario.nombreOSP}
                      />
                      <FormHelperText error>
                        {mostrarMsjInvalido("nombreOSP")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Acompañamiento</InputLabel>
                      <Select
                        error={esInvalido("acompanamiento")}
                        onChange={actualizarFormulario("acompanamiento")}
                        value={formulario.acompanamiento}
                      >
                        {OpcionesReporte.fortalecimiento.acompanamiento.map(
                          (opcion) => (
                            <MenuItem key={opcion} value={opcion}>
                              {opcion}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText error>
                        {mostrarMsjInvalido("acompanamiento")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Actividad economica</InputLabel>
                      <Select
                        error={esInvalido("tipoActividad")}
                        onChange={actualizarFormulario("tipoActividad")}
                        value={formulario.tipoActividad}
                      >
                        {OpcionesReporte.fortalecimiento.tipoActividad.map(
                          (opcion) => (
                            <MenuItem key={opcion} value={opcion}>
                              {opcion}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText error>
                        {mostrarMsjInvalido("tipoActividad")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Organizacion socioproductiva</InputLabel>
                      <Select
                        error={esInvalido("tipoOSP")}
                        onChange={actualizarFormulario("tipoOSP")}
                        value={formulario.tipoOSP}
                      >
                        {OpcionesReporte.fortalecimiento.tipoOSP.map(
                          (opcion) => (
                            <MenuItem key={opcion} value={opcion}>
                              {opcion}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText error>
                        {mostrarMsjInvalido("tipoOSP")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>
                        Tipo de proyecto C.F.G. (Opcional)
                      </InputLabel>
                      <Select
                        error={esInvalido("proyectoCFG.tipo")}
                        onChange={actualizarFormulario("tipo", "proyectoCFG")}
                        value={formulario.proyectoCFG.tipo}
                      >
                        {OpcionesReporte.fortalecimiento.proyectoCFG.tipo.map(
                          (opcion) => (
                            <MenuItem key={opcion} value={opcion}>
                              {opcion}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText error>
                        {mostrarMsjInvalido("proyectoCFG.tipo")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>
                        Etapa del proyecto C.F.G. (Opcional)
                      </InputLabel>
                      <Select
                        error={esInvalido("proyectoCFG.etapa")}
                        onChange={actualizarFormulario("etapa", "proyectoCFG")}
                        value={formulario.proyectoCFG.etapa}
                      >
                        {OpcionesReporte.fortalecimiento.proyectoCFG.etapa.map(
                          (opcion) => (
                            <MenuItem key={opcion} value={opcion}>
                              {opcion}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText error>
                        {mostrarMsjInvalido("proyectoCFG.etapa")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              ) : tipo === "incidencias" ? (
                <>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Area sustantiva</InputLabel>
                      <Select
                        error={esInvalido("areaSustantiva")}
                        onChange={actualizarFormulario("areaSustantiva")}
                        value={formulario.areaSustantiva}
                      >
                        {OpcionesReporte.incidencias.areaSustantiva.map(
                          (opcion) => (
                            <MenuItem key={opcion} value={opcion}>
                              {opcion}
                            </MenuItem>
                          )
                        )}
                      </Select>
                      <FormHelperText error>
                        {mostrarMsjInvalido("areaSustantiva")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Tipo de incidencia</InputLabel>
                      <FilledInput
                        error={esInvalido("tipoIncidencia")}
                        inputProps={{ maxLength: 100 }}
                        onChange={actualizarFormulario("tipoIncidencia")}
                        value={formulario.tipoIncidencia}
                      />
                      <FormHelperText error>
                        {mostrarMsjInvalido("tipoIncidencia")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              ) : tipo === "casoadmin" ? (
                <>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Tipo</InputLabel>
                      <Select
                        error={esInvalido("tipoCaso")}
                        onChange={actualizarFormulario("tipoCaso")}
                        value={formulario.tipoCaso}
                      >
                        {OpcionesReporte.casoadmin.tipoCaso.map((opcion) => (
                          <MenuItem key={opcion} value={opcion}>
                            {opcion}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText error>
                        {mostrarMsjInvalido("tipoCaso")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Caso administrativo</InputLabel>
                      <FilledInput
                        error={esInvalido("caso")}
                        inputProps={{ maxLength: 100 }}
                        onChange={actualizarFormulario("caso")}
                        value={formulario.caso}
                      />
                      <FormHelperText error>
                        {mostrarMsjInvalido("caso")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              ) : tipo === "comunicaciones" ? (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Notas de prensa (opcional)</InputLabel>
                      <FilledInput
                        error={esInvalido("prensa.notas")}
                        inputProps={{ maxLength: 9 }}
                        onChange={actualizarFormulario("notas", "prensa")}
                        value={formulario.prensa.notas}
                      />
                      <FormHelperText error>
                        {mostrarMsjInvalido("prensa.notas")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="filled">
                      <InputLabel>Reseñas de prensa (opcional)</InputLabel>
                      <FilledInput
                        error={esInvalido("prensa.resenas")}
                        inputProps={{ maxLength: 9 }}
                        onChange={actualizarFormulario("resenas", "prensa")}
                        value={formulario.prensa.resenas}
                      />
                      <FormHelperText error>
                        {mostrarMsjInvalido("prensa.resenas")}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {formulario.redes.map((red, i) => {
                    return (
                      <Grid container item key={`RED-${i}`} spacing={3}>
                        <Grid item xs={4} md={5}>
                          <FormControl fullWidth variant="filled">
                            <InputLabel>Cuenta</InputLabel>
                            <FilledInput
                              error={esInvalido(`redes[${i}].cuenta`)}
                              onChange={actualizarFormulario(
                                "cuenta",
                                "redes",
                                i
                              )}
                              value={red.cuenta}
                            />
                            <FormHelperText error>
                              {mostrarMsjInvalido(`redes[${i}].cuenta`)}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4} md={5}>
                          <FormControl fullWidth variant="filled">
                            <InputLabel>Publicaciones</InputLabel>
                            <FilledInput
                              error={esInvalido(`redes[${i}].publicaciones`)}
                              inputProps={{ maxLength: 9 }}
                              onChange={actualizarFormulario(
                                "publicaciones",
                                "redes",
                                i
                              )}
                              value={red.publicaciones}
                            />
                            <FormHelperText error>
                              {mostrarMsjInvalido(`redes[${i}].publicaciones`)}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={4}
                          md={2}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <IconButton color="primary" onClick={agregarRedes}>
                            <AddRoundedIcon />
                          </IconButton>
                          <IconButton color="error" onClick={borrarRedes(i)}>
                            <RemoveRoundedIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    );
                  })}
                </>
              ) : (
                ""
              )}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Organos adscritos</InputLabel>
                  <FilledInput
                    error={esInvalido("organosAdscritos")}
                    inputProps={{ maxLength: 30 }}
                    onChange={actualizarFormulario("organosAdscritos")}
                    value={formulario.organosAdscritos}
                  />
                  <FormHelperText error>
                    {mostrarMsjInvalido("organosAdscritos")}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid container item xs={12} md={6} spacing={3}>
                <Grid item xs={id ? 6 : 12}>
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
                    {id ? "Actualizar" : "Registrar"}
                  </Button>
                </Grid>
                {id ? (
                  <Grid item xs={6}>
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

export default FormularioReporte;