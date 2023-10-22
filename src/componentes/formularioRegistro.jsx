import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { AlertaError } from "./modulos";

function FormularioRegistro() {
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [formulario, setFormulario] = useState({
    usuario: "",
    clave: "",
    clave2: "",
  });

  const navegarHasta = useNavigate();

  const actualizarFormulario = function (evento) {
    setFormulario({ ...formulario, [evento.target.id]: evento.target.value });
  };

  const realizarPeticion = async function (evento) {
    evento.preventDefault();
    setCargando(true);
    setError(null);

    const url = "http://localhost:4000/usuarios/registrar";
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
              Ingrese los datos de su nueva cuenta
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
                    <Col xs={12} md={6}>
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
                    <Col xs={"auto"}>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={cargando}
                      >
                        Registrarse
                      </Button>
                    </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col xs={"auto"}>
                      <p>
                        ¿Ya tiene cuenta? <Link to="/">Ingrese</Link>
                      </p>
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

export default FormularioRegistro;
