import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { ContextoAutenticado, AlertaError, Error404, Spinner } from "./modulos";

const formularioVacio = {
  apellido: "",
  cedula: "",
  clave: "",
  clave2: "",
  email: "",
  nombre: "",
  rol: "PROMOTOR",
  tlf: "",
  usuario: "",
};

function FormularioUsuario() {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [errorDeValidacion, setErrorDeValidacion] = useState(null);
  const [cargando, setCargando] = useState(id ? true : false);
  const [subiendo, setSubiendo] = useState(false);
  const [formulario, setFormulario] = useState({ ...formularioVacio });
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
      setFormulario({ ...formularioVacio });
    }
  }, [id]);

  const actualizarFormulario = function (evento) {
    setFormulario({ ...formulario, [evento.target.id]: evento.target.value });
  };

  const realizarPeticion = async function (evento) {
    evento.preventDefault();
    setSubiendo(true);
    setErrorDeValidacion(null);
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
              {id ? "Actualizar usuario" : "Registrar nuevo usuario"}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={realizarPeticion}>
                <Container fluid>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Nombre de usuario</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="usuario"
                        value={formulario.usuario}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={6} md={5}>
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        size="sm"
                        type="password"
                        id="clave"
                        value={formulario.clave}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                    <Col xs={6} md={5}>
                      <Form.Label>Confirme su contraseña</Form.Label>
                      <Form.Control
                        size="sm"
                        type="password"
                        id="clave2"
                        value={formulario.clave2}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={6} md={5}>
                      <Form.Label>Cedula</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="cedula"
                        value={formulario.cedula}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                    <Col xs={6} md={5}>
                      <Form.Label>Rol</Form.Label>
                      <Form.Select
                        size="sm"
                        id="rol"
                        value={formulario.rol}
                        onChange={actualizarFormulario}
                      >
                        <option value="PROMOTOR">PROMOTOR</option>
                        <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={6} md={5}>
                      <Form.Label>Primer nombre</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="nombre"
                        value={formulario.nombre}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                    <Col xs={6} md={5}>
                      <Form.Label>Primer apellido</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="apellido"
                        value={formulario.apellido}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={6} md={5}>
                      <Form.Label>Numero telefonico</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="tlf"
                        value={formulario.tlf}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                    <Col xs={6} md={5}>
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="email"
                        value={formulario.email}
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
                    </Col>
                  </Row>
                </Container>
                {errorDeValidacion ? (
                  <AlertaError error={errorDeValidacion} />
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

export default FormularioUsuario;
