import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { ContextoAutenticado, AlertaError } from "./modulos";

function FormularioIngreso() {
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState({
    usuario: "",
    clave: "",
  });
  const { guardarUsuario } = useContext(ContextoAutenticado);
  const navegarHasta = useNavigate();

  const actualizarFormulario = function (evento) {
    setFormulario({ ...formulario, [evento.target.id]: evento.target.value });
  };

  const realizarPeticion = async function (evento) {
    evento.preventDefault();
    setCargando(true);
    setError(null);

    const url = "http://localhost:4000/usuarios/ingresar";
    const peticion = {
      body: JSON.stringify(formulario),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      mode: "cors",
      method: "POST",
    };

    try {
      const respuesta = await fetch(url, peticion);
      if (respuesta.ok) {
        const recibido = await respuesta.json();
        guardarUsuario(recibido);
        navegarHasta("/", { replace: true });
      } else {
        const recibido = await respuesta.json();
        setError(recibido.error);
      }
    } catch (errorPeticion) {
      setError(errorPeticion);
    } finally {
      setCargando(false);
    }
  };

  return (
    /* jshint ignore:start */
    <Container fluid>
      <Row className="justify-content-center p-5">
        <Col xs={12} md={6}>
          <Card>
            <Card.Header className="text-center fs-5">
              Ingrese sus datos de acceso
            </Card.Header>
            <Card.Body>
              <Form onSubmit={realizarPeticion}>
                <Container fluid>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={6}>
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
                    <Col xs={12} md={6}>
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                        size="sm"
                        type="password"
                        id="clave"
                        value={formulario.clave}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={"auto"}>
                      <Button
                        variant="success"
                        type="submit"
                        disabled={cargando}
                      >
                        Ingresar
                      </Button>
                    </Col>
                  </Row>
                </Container>
                {error ? <AlertaError error={error} /> : ""}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    /* jshint ignore:end */
  );
}

export default FormularioIngreso;
