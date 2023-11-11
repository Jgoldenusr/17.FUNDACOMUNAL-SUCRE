import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { OpcionesReporte } from "../config/opciones";
import {
  formularioCasoAdmin,
  formularioComunicaciones,
  formularioFormacion,
  formularioFortalecimiento,
  formularioIncidencias,
  formularioParticipacion,
} from "../config/plantillas";
import {
  ContextoAutenticado,
  AlertaBorrar,
  AlertaError,
  Error404,
  Spinner,
} from "./modulos";

function FormularioReporte() {
  const { id } = useParams();
  const [cargando, setCargando] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [errorDeValidacion, setErrorDeValidacion] = useState(null);
  const [borrar, setBorrar] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [tipo, setTipo] = useState("participacion");
  const [formulario, setFormulario] = useState(formularioParticipacion);
  const { miUsuario } = useContext(ContextoAutenticado);
  const navegarHasta = useNavigate();

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
    setTipo(evento.target.value);
  };

  const mostrarAlertaBorrar = function () {
    setErrorDeValidacion(null);
    setBorrar(true);
  };

  const realizarPeticion = async function (evento) {
    evento.preventDefault();
    setSubiendo(true);
    setErrorDeValidacion(null);
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
        setErrorDeValidacion(recibido.error);
      }
    } catch (errorPeticion) {
      setErrorDeValidacion(errorPeticion);
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
        setErrorDeValidacion(recibido.error);
      }
    } catch (errorPeticion) {
      setErrorDeValidacion(errorPeticion);
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
    <Container fluid>
      <Row className="justify-content-center p-5">
        <Col xs={12} md={6}>
          <Card>
            <Card.Header className="text-center fs-5">
              {id ? "Actualizar reporte" : "Nuevo reporte"}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={realizarPeticion}>
                <Container fluid>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Tipo de reporte</Form.Label>
                      <Form.Select
                        disabled={id ? true : false}
                        size="sm"
                        value={tipo}
                        onChange={cambiarTipoFormulario}
                      >
                        <option value="casoadmin">CASO ADMINISTRATIVO</option>
                        <option value="comunicaciones">COMUNICACIONES</option>
                        <option value="fortalecimiento">FORTALECIMIENTO</option>
                        <option value="formacion">FORMACION</option>
                        <option value="incidencias">INCIDENCIAS</option>
                        <option value="participacion">PARTICIPACION</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Consejo comunal</Form.Label>
                      <Form.Select
                        size="sm"
                        value={formulario.cc}
                        onChange={actualizarFormulario("cc")}
                      >
                        <option>SELECCIONE UN CONSEJO COMUNAL</option>
                        {miUsuario.cc.map((elemento) => (
                          <option key={elemento._id} value={elemento._id}>
                            {elemento.nombre}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Fecha del reporte</Form.Label>
                      <Form.Control
                        size="sm"
                        type="date"
                        value={formulario.fecha.substring(0, 10)}
                        onChange={actualizarFormulario("fecha")}
                      />
                    </Col>
                  </Row>
                  {tipo === "participacion" ? (
                    <>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Acompañamiento</Form.Label>
                          <Form.Select
                            size="sm"
                            value={formulario.acompanamiento}
                            onChange={actualizarFormulario("acompanamiento")}
                          >
                            <option>SELECCIONE UN ACOMPAÑAMIENTO</option>
                            {OpcionesReporte.participacion.acompanamiento.map(
                              (opcion) => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Familias beneficiadas</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            value={formulario.familiasBeneficiadas}
                            onChange={actualizarFormulario(
                              "familiasBeneficiadas"
                            )}
                          />
                        </Col>
                      </Row>
                    </>
                  ) : tipo === "formacion" ? (
                    <>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Estrategia</Form.Label>
                          <Form.Select
                            size="sm"
                            value={formulario.estrategia}
                            onChange={actualizarFormulario("estrategia")}
                          >
                            <option>SELECCIONE UNA ESTRATEGIA</option>
                            {OpcionesReporte.formacion.estrategia.map(
                              (opcion) => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Modalidad</Form.Label>
                          <Form.Select
                            size="sm"
                            value={formulario.modalidad}
                            onChange={actualizarFormulario("modalidad")}
                          >
                            <option>SELECCIONE UNA MODALIDAD</option>
                            {OpcionesReporte.formacion.modalidad.map(
                              (opcion) => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Tematica</Form.Label>
                          <Form.Select
                            size="sm"
                            value={formulario.tematica}
                            onChange={actualizarFormulario("tematica")}
                          >
                            <option>SELECCIONE UNA TEMATICA</option>
                            {OpcionesReporte.formacion.tematica.map(
                              (opcion) => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Verificacion</Form.Label>
                          <Form.Select
                            size="sm"
                            value={formulario.verificacion}
                            onChange={actualizarFormulario("verificacion")}
                          >
                            <option>SELECCIONE UN TIPO DE VERIFICACION</option>
                            {OpcionesReporte.formacion.verificacion.map(
                              (opcion) => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={6} md={5}>
                          <Form.Label>Beneficiados (hombres)</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            value={formulario.beneficiados.hombres}
                            onChange={actualizarFormulario(
                              "hombres",
                              "beneficiados"
                            )}
                          />
                        </Col>
                        <Col xs={6} md={5}>
                          <Form.Label>Beneficiados (mujeres)</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            value={formulario.beneficiados.mujeres}
                            onChange={actualizarFormulario(
                              "mujeres",
                              "beneficiados"
                            )}
                          />
                        </Col>
                      </Row>
                    </>
                  ) : tipo === "fortalecimiento" ? (
                    <>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>
                            Nombre de la organizacion socioproductiva
                          </Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            value={formulario.nombreOSP}
                            onChange={actualizarFormulario("nombreOSP")}
                          />
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Acompañamiento</Form.Label>
                          <Form.Select
                            size="sm"
                            value={formulario.acompanamiento}
                            onChange={actualizarFormulario("acompanamiento")}
                          >
                            <option>SELECCIONE UN ACOMPAÑAMIENTO</option>
                            {OpcionesReporte.fortalecimiento.acompanamiento.map(
                              (opcion) => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Tipo de actividad economica</Form.Label>
                          <Form.Select
                            size="sm"
                            value={formulario.tipoActividad}
                            onChange={actualizarFormulario("tipoActividad")}
                          >
                            <option>
                              SELECCIONE UN TIPO DE ACTIVIDAD ECONOMICA
                            </option>
                            {OpcionesReporte.fortalecimiento.tipoActividad.map(
                              (opcion) => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>
                            Tipo de organizacion socioproductiva
                          </Form.Label>
                          <Form.Select
                            size="sm"
                            value={formulario.tipoOSP}
                            onChange={actualizarFormulario("tipoOSP")}
                          >
                            <option>SELECCIONE UN TIPO DE ORGANIZACION</option>
                            {OpcionesReporte.fortalecimiento.tipoOSP.map(
                              (opcion) => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>
                            Tipo de proyecto C.F.G (Opcional)
                          </Form.Label>
                          <Form.Select
                            size="sm"
                            value={formulario.proyectoCFG.tipo}
                            onChange={actualizarFormulario(
                              "tipo",
                              "proyectoCFG"
                            )}
                          >
                            <option value="">
                              SELECCIONE EL TIPO (SI APLICA)
                            </option>
                            {OpcionesReporte.fortalecimiento.proyectoCFG.tipo.map(
                              (opcion) => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>
                            Etapa del proyecto C.F.G (Opcional)
                          </Form.Label>
                          <Form.Select
                            size="sm"
                            value={formulario.proyectoCFG.etapa}
                            onChange={actualizarFormulario(
                              "etapa",
                              "proyectoCFG"
                            )}
                          >
                            <option value="">
                              SELECCIONE LA ETAPA (SI APLICA)
                            </option>
                            {OpcionesReporte.fortalecimiento.proyectoCFG.etapa.map(
                              (opcion) => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                    </>
                  ) : tipo === "incidencias" ? (
                    <>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Area sustantiva</Form.Label>
                          <Form.Select
                            size="sm"
                            value={formulario.areaSustantiva}
                            onChange={actualizarFormulario("areaSustantiva")}
                          >
                            <option>SELECCIONE UN AREA SUSTANTIVA</option>
                            {OpcionesReporte.incidencias.areaSustantiva.map(
                              (opcion) => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Tipo de incidencia</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            value={formulario.tipoIncidencia}
                            onChange={actualizarFormulario("tipoIncidencia")}
                          />
                        </Col>
                      </Row>
                    </>
                  ) : tipo === "casoadmin" ? (
                    <>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Tipo</Form.Label>
                          <Form.Select
                            size="sm"
                            value={formulario.tipoCaso}
                            onChange={actualizarFormulario("tipoCaso")}
                          >
                            <option>SELECCIONE UN TIPO</option>
                            {OpcionesReporte.casoadmin.tipoCaso.map(
                              (opcion) => (
                                <option key={opcion} value={opcion}>
                                  {opcion}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Caso administrativo</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            value={formulario.caso}
                            onChange={actualizarFormulario("caso")}
                          />
                        </Col>
                      </Row>
                    </>
                  ) : tipo === "comunicaciones" ? (
                    <>
                      <Row className="justify-content-center mb-3">
                        <Col xs={6} md={5}>
                          <Form.Label>Notas de prensa (opcional)</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            value={formulario.prensa.notas}
                            onChange={actualizarFormulario("notas", "prensa")}
                          />
                        </Col>
                        <Col xs={6} md={5}>
                          <Form.Label>Reseñas de prensa (opcional)</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            value={formulario.prensa.resenas}
                            onChange={actualizarFormulario("resenas", "prensa")}
                          />
                        </Col>
                      </Row>
                      {formulario.redes.map((red, i) => {
                        return (
                          <Row
                            key={`REDES-${i}`}
                            className="justify-content-center mb-3"
                          >
                            <Col xs={5} md={4}>
                              <Form.Label>Cuenta</Form.Label>
                              <Form.Control
                                size="sm"
                                type="text"
                                value={red.cuenta}
                                onChange={actualizarFormulario(
                                  "cuenta",
                                  "redes",
                                  i
                                )}
                              />
                            </Col>
                            <Col xs={5} md={4}>
                              <Form.Label>Publicaciones</Form.Label>
                              <Form.Control
                                size="sm"
                                type="text"
                                value={red.publicaciones}
                                onChange={actualizarFormulario(
                                  "publicaciones",
                                  "redes",
                                  i
                                )}
                              />
                            </Col>
                            <Col
                              xs={2}
                              className="d-flex justify-content-between align-self-end"
                            >
                              <Button size="sm" onClick={agregarRedes}>
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                              <Button size="sm" onClick={borrarRedes(i)}>
                                <FontAwesomeIcon icon={faMinus} />
                              </Button>
                            </Col>
                          </Row>
                        );
                      })}
                    </>
                  ) : (
                    ""
                  )}
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Organos adscritos</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        value={formulario.organosAdscritos}
                        onChange={actualizarFormulario("organosAdscritos")}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={"auto"}>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={subiendo}
                      >
                        {id ? "Actualizar" : "Registrar"}
                      </Button>
                      {id ? (
                        <Button
                          variant="danger"
                          disabled={subiendo}
                          onClick={mostrarAlertaBorrar}
                          className="ms-3"
                        >
                          Borrar
                        </Button>
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>
                </Container>
                {errorDeValidacion ? (
                  <AlertaError error={errorDeValidacion} />
                ) : borrar ? (
                  <AlertaBorrar
                    realizarPeticion={realizarPeticionBorrar}
                    setBorrar={setBorrar}
                  />
                ) : (
                  ""
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  /* jshint ignore:end */
}

/*

*/
export default FormularioReporte;
