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

function FormularioReporte() {
  const { id } = useParams();
  const formularioVacio = {
    fecha: "",
    cedula: "",
    situr: "",
    tipo: "PARTICIPACION",
    acompanamiento: "",
    organosAdscritos: "",
    familiasBeneficiadas: "",
  };
  const [cargando, setCargando] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [errorDeValidacion, setErrorDeValidacion] = useState(null);
  const [borrar, setBorrar] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [formulario, setFormulario] = useState({ ...formularioVacio });
  const { miToken } = useContext(ContextoAutenticado);
  const navegarHasta = useNavigate();

  useEffect(() => {
    async function buscarReporteParaEditar() {
      const url = "http://localhost:4000/reportes/" + id;
      const peticion = {
        headers: new Headers({
          Authorization: `Bearer ${miToken}`,
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
      buscarReporteParaEditar();
    } else {
      setFormulario({ ...formularioVacio });
    }
  }, [id]);

  const actualizarFormulario = function (evento) {
    setFormulario({ ...formulario, [evento.target.id]: evento.target.value });
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
      ? "http://localhost:4000/reportes/" + formulario._id
      : "http://localhost:4000/reportes";
    /* jshint ignore:end */
    const peticion = {
      body: JSON.stringify(formulario),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${miToken}`,
      }),
      mode: "cors",
      method: id ? "PUT" : "POST",
    };

    try {
      const respuesta = await fetch(url, peticion);
      if (respuesta.ok) {
        const recibido = await respuesta.json();
        navegarHasta(`/${recibido._id}`, { replace: true });
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
        Authorization: `Bearer ${miToken}`,
      }),
      mode: "cors",
      method: "DELETE",
    };

    try {
      const respuesta = await fetch(url, peticion);
      if (respuesta.ok) {
        navegarHasta("/", { replace: true });
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
                      <Form.Label>Fecha del reporte</Form.Label>
                      <Form.Control
                        size="sm"
                        type="date"
                        id="fecha"
                        value={formulario.fecha}
                        onChange={actualizarFormulario}
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
                        onChange={actualizarFormulario}
                      >
                        <option>Seleccione un tipo</option>
                        <option value="ASAMBLEAS INFORMATIVAS PARA LA CONFORMACION DEL CONSEJO COMUNAL">
                          ASAMBLEAS INFORMATIVAS PARA LA CONFORMACION DEL
                          CONSEJO COMUNAL
                        </option>
                        <option value="ASAMBLEAS PARA LA ESCOGENCIA DE LA COMISION ELECTORAL PERMANENTE">
                          ASAMBLEAS PARA LA ESCOGENCIA DE LA COMISION ELECTORAL
                          PERMANENTE
                        </option>
                        <option value="PROCESO DE POSTULACION DE LAS VOCERIAS DEL CONSEJO COMUNAL">
                          PROCESO DE POSTULACION DE LAS VOCERIAS DEL CONSEJO
                          COMUNAL
                        </option>
                        <option value="PROCESO DE ELECCIONES DE VOCERIAS">
                          PROCESO DE ELECCIONES DE VOCERIAS
                        </option>
                        <option value="ASAMBLEA INFORMATIVA DEL EQUIPO PROMOTOR PROVISIONAL">
                          ASAMBLEA INFORMATIVA DEL EQUIPO PROMOTOR PROVISIONAL
                        </option>
                        <option value="ELABORACION MAPA DE PROBLEMAS Y SOLUCIONES">
                          ELABORACION MAPA DE PROBLEMAS Y SOLUCIONES
                        </option>
                        <option value="ASAMBLEA DE RENDICION DE CUENTA">
                          ASAMBLEA DE RENDICION DE CUENTA
                        </option>
                        <option value="JURAMENTACION DE VOCERIAS ELECTAS">
                          JURAMENTACION DE VOCERIAS ELECTAS
                        </option>
                        <option value="ELABORACION DE PLAN DE DESARROLLO INTEGRAL COMUNITARIO O PLAN PATRIA COMUNAL">
                          ELABORACION DE PLAN DE DESARROLLO INTEGRAL COMUNITARIO
                          O PLAN PATRIA COMUNAL
                        </option>
                        <option value="ELECCIONES DE COMISIONES PROVISIONALES DE COMUNAS">
                          ELECCIONES DE COMISIONES PROVISIONALES DE COMUNAS
                        </option>
                        <option value="PROCESO DEL REFERENDUM DE CARTAS FUNDACIONALES">
                          PROCESO DEL REFERENDUM DE CARTAS FUNDACIONALES
                        </option>
                        <option value="MESA DE TRABAJO DE ALGUN COMITE">
                          MESA DE TRABAJO DE ALGUN COMITE
                        </option>
                        <option value="ELABORACION DE LA AGENDA CONCRETA DE ACCION">
                          ELABORACION DE LA AGENDA CONCRETA DE ACCION
                        </option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Cedula del promotor</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="cedula"
                        value={formulario.cedula}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Codigo situr del C.C</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="situr"
                        value={formulario.situr}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Organos adscritos</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="organosAdscritos"
                        value={formulario.organosAdscritos}
                        onChange={actualizarFormulario}
                      />
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
                        onChange={actualizarFormulario}
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

export default FormularioReporte;
