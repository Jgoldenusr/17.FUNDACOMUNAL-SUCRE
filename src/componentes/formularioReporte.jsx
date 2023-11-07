import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import {
  ContextoAutenticado,
  AlertaBorrar,
  AlertaError,
  Error404,
  Spinner,
} from "./modulos";

const formularioBase = {
  cc: "",
  fecha: "",
  organosAdscritos: "",
  usuario: "",
};
const formularioCasoAdmin = {
  ...formularioBase,
  caso: "",
  tipoCaso: "",
};
const formularioComunicaciones = {
  ...formularioBase,
  prensa: {
    notas: "",
    resenas: "",
  },
  redes: [
    {
      cuenta: "",
      publicaciones: "",
    },
  ],
};
const formularioFormacion = {
  ...formularioBase,
  beneficiados: {
    hombres: "",
    mujeres: "",
  },
  estrategia: "",
  modalidad: "",
  tematica: "",
  verificacion: "",
};
const formularioFortalecimiento = {
  ...formularioBase,
  acompanamiento: "",
  nombreOSP: "",
  tipoActividad: "",
  tipoOSP: "",
  proyectoCFG: {
    etapa: "",
    tipo: "",
  },
};
const formularioIncidencias = {
  ...formularioBase,
  areaSustantiva: "",
  tipoIncidencia: "",
};
const formularioParticipacion = {
  ...formularioBase,
  acompanamiento: "",
  familiasBeneficiadas: "",
};
const Opciones = {
  participacion: {
    acompanamiento: [
      "ASAMBLEAS INFORMATIVAS PARA LA CONFORMACION DEL CONSEJO COMUNAL",
      "ASAMBLEAS PARA LA ESCOGENCIA DE LA COMISION ELECTORAL PERMANENTE",
      "PROCESO DE POSTULACION DE LAS VOCERIAS DEL CONSEJO COMUNAL",
      "PROCESO DE ELECCIONES DE VOCERIAS",
      "ASAMBLEA INFORMATIVA DEL EQUIPO PROMOTOR PROVISIONAL",
      "ELABORACION MAPA DE PROBLEMAS Y SOLUCIONES",
      "ASAMBLEA DE RENDICION DE CUENTA",
      "JURAMENTACION DE VOCERIAS ELECTAS",
      "ELABORACION DE PLAN DE DESARROLLO INTEGRAL COMUNITARIO O PLAN PATRIA COMUNAL",
      "ELECCIONES DE COMISIONES PROVISIONALES DE COMUNAS",
      "PROCESO DEL REFERENDUM DE CARTAS FUNDACIONALES",
      "MESA DE TRABAJO DE ALGUN COMITE",
      "ELABORACION DE LA AGENDA CONCRETA DE ACCION (ACA)",
      "PROCESO FORMATIVO MUNICIPAL A.C.A",
      "PROCESO FORMATIVO MUNICIPAL PARA EL REGISTRO DE LOS CONSEJOS COMUNALES",
      "PROCESOS FORMATIVOS MUNICIPAL ELECTORALES",
      "LEVANTAMIENTO CARTOGRAFICO",
      "PROCESAMIENTO CARTOGRAFICO (DIGITALIZACION DE MAPA)",
      "ELABORACION DE LA CARTOGRAFIA COMUNALES",
    ],
  },
  formacion: {
    estrategia: [
      "TALLER",
      "CHARLA",
      "CONVERSATORIO",
      "CAPACITACION",
      "MESA DE TRABAJO",
      "FORO",
      "SEMINARIO",
      "INDUCCION",
      "VIDEO CONFERENCIA",
    ],
    modalidad: ["PRESENCIAL", "VIRTUAL", "MIXTA"],
    tematica: [
      "3R.NETS",
      "COLECTIVO DE COORDINACION COMUNITARIA",
      "PLAN PATRIA COMUNAL O PLAN DE DESARROLLO COMUNITARIO",
      "SISTEMA ECONOMICO COMUNAL",
      "REGISTRO DE CONSEJOS COMUNALES",
      "CARTOGRAFIA COMUNAL",
      "COMISION ELECTORAL PERMANENTE",
      "COMISION ELECTORAL PROVISIONAL",
      "FUNCIONES DE VOCERIAS, COMITES Y MESAS TECNICAS",
      "LEYES DE ORGANIZACION COMUNAL",
      "PROCESO FORMATIVO MUNICIPAL A.C.A",
      "PROCESO FORMATIVO MUNICIPAL PARA EL REGISTROS DE LOS CONSEJOS COMUNALES",
      "PROCESOS FORMATIVOS MUNICIPAL ELECTORALES",
    ],
    verificacion: ["LISTA DE ASISTENCIA", "FOTOGRAFIA", "AMBOS", "NINGUNO"],
  },
  fortalecimiento: {
    acompanamiento: [
      "COMITE DE ECONOMIA COMUNAL PARA LA ACTIVACION DE (OSP)",
      "MESAS DEL CONSEJO DE ECONOMIA",
      "ELABORACION DE PLANES PRODUCTIVOS",
      "FUNCIONAMIENTO O REIMPULSO DE (UPF)",
      "FUNCIONAMIENTO O REIMPULSO DE (EPS)",
      "PROYECTOS DEL CONSEJO FEDERAL DE GOBIERNO (CFG)",
      "FUNCIONAMIENTO O REIMPULSO DE EMPRENDEDORES",
      "FUNCIONAMIENTO O REIMPULSO DE COOPERATIVAS",
      "GRUPO DE INTERCAMBIO SOLIDARIO",
      "PROCESO DE ASAMBLEA PARA APROBACION DE PROYECTO",
      "PLAN SIEMBRA",
      "PROYECTOS DE VIVEROS",
      "PLAN TESTIL",
      "PLAN CONUCO Y CEREALES",
      "CONSTRUCCION DEL CIRCUITO ECONOMICO ESTADAL",
      "IDENTIFICACION DE LAS EXPERIENCIAS PRODUCTIVAS",
    ],
    tipoActividad: [
      "AGROPECUARIA",
      "SERVICIO DE ADMINISTRACION PUBLICA",
      "INDUSTRIA MANU FACTURERA",
      "ESTABLECIMIENTO FINANCIERO",
      "CONSTRUCCION",
      "ELECTRICIDAD, GAS Y AGUA",
      "MINERALES METALICOS Y NO METALICOS",
      "PETROLEO CRUDO Y GAS NATURAL",
      "COMERCIO",
      "OTROS SERVICIOS",
      "COMUNICACIONES",
      "TRANSPORTE Y ALMACENAMIENTO",
    ],
    tipoOSP: [
      "CONSEJO COMUNAL",
      "UNIDAD DE PRODUCCION FAMILIAR",
      "EMPRESA DE PRODUCCION SOCIAL DIRECTA",
      "EMPRESA DE PRODUCCION SOCIAL INDIRECTA",
      "EMPRESA DE PRODUCCION SOCIAL MIXTA",
      "EMPRENDEDORES",
      "GRUPO DE INTERCAMBIO SOLIDARIO",
      "COOPERATIVAS",
    ],
    proyectoCFG: {
      etapa: ["ETAPA 1", "ETAPA 2", "ETAPA 3", "CULMINADO"],
      tipo: [
        "AMBIENTAL",
        "CULTURAL",
        "DEPORTIVO",
        "EDUCACION",
        "ELECTRICIDAD",
        "INFRAESTRUCTURA MARITIMA, FLUVIAL Y LA ACUICULTURA",
        "MANEJO INTEGRAL DEL AGUA",
        "MUROS",
        "PROCESOS INDUSTRIALES",
        "SALUD",
        "SERVICIOS PRODUCTIVOS",
        "SISTEMA DE PRODUCCION AGRICOLA",
        "SISTEMAS AGROPECUARIOS",
        "VIALIDAD",
        "VIVIENDA",
      ],
    },
  },
  incidencias: {
    areaSustantiva: [
      "PARTICIPACION",
      "FORMACION",
      "FORTALECIMIENTO",
      "CARTOGRAFIA",
    ],
  },
  casoadmin: {
    tipoCaso: ["CASO", "DENUNCIA", "ADMINISTRATIVO", "ASESORIA"],
  },
};

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

  const actualizarFormulario = function (propiedad) {
    return function (evento) {
      if (propiedad) {
        setFormulario({
          ...formulario,
          [propiedad]: {
            ...formulario[propiedad],
            [evento.target.id]: evento.target.value,
          },
        });
      } else {
        setFormulario({
          ...formulario,
          [evento.target.id]: evento.target.value,
        });
      }
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
                        <option value="formacion">FORMACION</option>
                        <option value="incidencias">INCIDENCIAS</option>
                        <option value="fortalecimiento">FORTALECIMIENTO</option>
                        <option value="participacion">PARTICIPACION</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Consejo comunal</Form.Label>
                      <Form.Select
                        size="sm"
                        id="cc"
                        value={formulario.cc}
                        onChange={actualizarFormulario()}
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
                        id="fecha"
                        value={formulario.fecha.substring(0, 10)}
                        onChange={actualizarFormulario()}
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
                            id="acompanamiento"
                            value={formulario.acompanamiento}
                            onChange={actualizarFormulario()}
                          >
                            <option>SELECCIONE UN ACOMPAÑAMIENTO</option>
                            {Opciones.participacion.acompanamiento.map(
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
                            id="familiasBeneficiadas"
                            value={formulario.familiasBeneficiadas}
                            onChange={actualizarFormulario()}
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
                            id="estrategia"
                            value={formulario.estrategia}
                            onChange={actualizarFormulario()}
                          >
                            <option>SELECCIONE UNA ESTRATEGIA</option>
                            {Opciones.formacion.estrategia.map((opcion) => (
                              <option key={opcion} value={opcion}>
                                {opcion}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Modalidad</Form.Label>
                          <Form.Select
                            size="sm"
                            id="modalidad"
                            value={formulario.modalidad}
                            onChange={actualizarFormulario()}
                          >
                            <option>SELECCIONE UNA MODALIDAD</option>
                            {Opciones.formacion.modalidad.map((opcion) => (
                              <option key={opcion} value={opcion}>
                                {opcion}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Tematica</Form.Label>
                          <Form.Select
                            size="sm"
                            id="tematica"
                            value={formulario.tematica}
                            onChange={actualizarFormulario()}
                          >
                            <option>SELECCIONE UNA TEMATICA</option>
                            {Opciones.formacion.tematica.map((opcion) => (
                              <option key={opcion} value={opcion}>
                                {opcion}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Verificacion</Form.Label>
                          <Form.Select
                            size="sm"
                            id="verificacion"
                            value={formulario.verificacion}
                            onChange={actualizarFormulario()}
                          >
                            <option>SELECCIONE UN TIPO DE VERIFICACION</option>
                            {Opciones.formacion.verificacion.map((opcion) => (
                              <option key={opcion} value={opcion}>
                                {opcion}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={6} md={5}>
                          <Form.Label>Beneficiados (hombres)</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            id="hombres"
                            value={formulario.beneficiados.hombres}
                            onChange={actualizarFormulario("beneficiados")}
                          />
                        </Col>
                        <Col xs={6} md={5}>
                          <Form.Label>Beneficiados (mujeres)</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            id="mujeres"
                            value={formulario.beneficiados.mujeres}
                            onChange={actualizarFormulario("beneficiados")}
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
                            id="nombreOSP"
                            value={formulario.nombreOSP}
                            onChange={actualizarFormulario()}
                          />
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Acompañamiento</Form.Label>
                          <Form.Select
                            size="sm"
                            id="acompanamiento"
                            value={formulario.acompanamiento}
                            onChange={actualizarFormulario()}
                          >
                            <option>SELECCIONE UN ACOMPAÑAMIENTO</option>
                            {Opciones.fortalecimiento.acompanamiento.map(
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
                            id="tipoActividad"
                            value={formulario.tipoActividad}
                            onChange={actualizarFormulario()}
                          >
                            <option>
                              SELECCIONE UN TIPO DE ACTIVIDAD ECONOMICA
                            </option>
                            {Opciones.fortalecimiento.tipoActividad.map(
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
                            id="tipoOSP"
                            value={formulario.tipoOSP}
                            onChange={actualizarFormulario()}
                          >
                            <option>SELECCIONE UN TIPO DE ORGANIZACION</option>
                            {Opciones.fortalecimiento.tipoOSP.map((opcion) => (
                              <option key={opcion} value={opcion}>
                                {opcion}
                              </option>
                            ))}
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
                            id="tipo"
                            value={formulario.proyectoCFG.tipo}
                            onChange={actualizarFormulario("proyectoCFG")}
                          >
                            <option value="">
                              SELECCIONE EL TIPO (SI APLICA)
                            </option>
                            {Opciones.fortalecimiento.proyectoCFG.tipo.map(
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
                            id="etapa"
                            value={formulario.proyectoCFG.etapa}
                            onChange={actualizarFormulario("proyectoCFG")}
                          >
                            <option value="">
                              SELECCIONE LA ETAPA (SI APLICA)
                            </option>
                            {Opciones.fortalecimiento.proyectoCFG.etapa.map(
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
                            id="areaSustantiva"
                            value={formulario.areaSustantiva}
                            onChange={actualizarFormulario()}
                          >
                            <option>SELECCIONE UN AREA SUSTANTIVA</option>
                            {Opciones.incidencias.areaSustantiva.map(
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
                            id="tipoIncidencia"
                            value={formulario.tipoIncidencia}
                            onChange={actualizarFormulario()}
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
                            id="tipoCaso"
                            value={formulario.tipoCaso}
                            onChange={actualizarFormulario()}
                          >
                            <option>SELECCIONE UN TIPO</option>
                            {Opciones.casoadmin.tipoCaso.map((opcion) => (
                              <option key={opcion} value={opcion}>
                                {opcion}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Row className="justify-content-center mb-3">
                        <Col xs={12} md={10}>
                          <Form.Label>Caso administrativo</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            id="caso"
                            value={formulario.caso}
                            onChange={actualizarFormulario()}
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
                            id="notas"
                            value={formulario.prensa.notas}
                            onChange={actualizarFormulario("prensa")}
                          />
                        </Col>
                        <Col xs={6} md={5}>
                          <Form.Label>Reseñas de prensa (opcional)</Form.Label>
                          <Form.Control
                            size="sm"
                            type="text"
                            id="resenas"
                            value={formulario.prensa.resenas}
                            onChange={actualizarFormulario("prensa")}
                          />
                        </Col>
                      </Row>
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
                        id="organosAdscritos"
                        value={formulario.organosAdscritos}
                        onChange={actualizarFormulario()}
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
