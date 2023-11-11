import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { ContextoAutenticado, Error404, Spinner } from "./modulos";
import { formularioVacioUsuario } from "../config/plantillas";

function FormularioUsuario() {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState(null);
  const [cargando, setCargando] = useState(id ? true : false);
  const [subiendo, setSubiendo] = useState(false);
  const [formulario, setFormulario] = useState({ ...formularioVacioUsuario });
  const { miUsuario } = useContext(ContextoAutenticado);
  const navegarHasta = useNavigate();

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

  const esInvalido = function (campo) {
    let resultado = false;
    if (erroresValidacion) {
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
    if (erroresValidacion) {
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
    <Container fluid>
      <Row className="justify-content-center p-5">
        <Col xs={12} md={6}>
          <Card>
            <Card.Header className="text-center fs-5">
              {id ? "Actualizar usuario" : "Registrar nuevo usuario"}
            </Card.Header>
            <Card.Body>
              <Form noValidate onSubmit={realizarPeticion}>
                <Container fluid>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Nombre de usuario</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        value={formulario.usuario}
                        onChange={actualizarFormulario("usuario")}
                        isInvalid={esInvalido("usuario")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("usuario")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={6} md={5}>
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        size="sm"
                        type="password"
                        value={formulario.clave}
                        onChange={actualizarFormulario("clave")}
                        isInvalid={esInvalido("clave")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("clave")}
                      </Form.Control.Feedback>
                    </Col>
                    <Col xs={6} md={5}>
                      <Form.Label>Confirme su contraseña</Form.Label>
                      <Form.Control
                        size="sm"
                        type="password"
                        value={formulario.clave2}
                        onChange={actualizarFormulario("clave2")}
                        isInvalid={esInvalido("clave2")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("clave2")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={6} md={5}>
                      <Form.Label>Cedula</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        value={formulario.cedula}
                        onChange={actualizarFormulario("cedula")}
                        isInvalid={esInvalido("cedula")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("cedula")}
                      </Form.Control.Feedback>
                    </Col>
                    <Col xs={6} md={5}>
                      <Form.Label>Rol</Form.Label>
                      <Form.Select
                        size="sm"
                        value={formulario.rol}
                        onChange={actualizarFormulario("rol")}
                        isInvalid={esInvalido("rol")}
                      >
                        <option value="PROMOTOR">PROMOTOR</option>
                        <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("rol")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={6} md={5}>
                      <Form.Label>Primer nombre</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        value={formulario.nombre}
                        onChange={actualizarFormulario("nombre")}
                        isInvalid={esInvalido("nombre")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("nombre")}
                      </Form.Control.Feedback>
                    </Col>
                    <Col xs={6} md={5}>
                      <Form.Label>Primer apellido</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        value={formulario.apellido}
                        onChange={actualizarFormulario("apellido")}
                        isInvalid={esInvalido("apellido")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("apellido")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={6} md={5}>
                      <Form.Label>Numero telefonico</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        value={formulario.tlf}
                        onChange={actualizarFormulario("tlf")}
                        isInvalid={esInvalido("tlf")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("tlf")}
                      </Form.Control.Feedback>
                    </Col>
                    <Col xs={6} md={5}>
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        value={formulario.email}
                        onChange={actualizarFormulario("email")}
                        isInvalid={esInvalido("email")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("email")}
                      </Form.Control.Feedback>
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
                    </Col>
                  </Row>
                </Container>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  /* jshint ignore:end */
}

export default FormularioUsuario;
