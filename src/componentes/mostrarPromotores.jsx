import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { Error404, Spinner } from "./modulos";

function MostrarPromotores({ token }) {
  const [promotores, setPromotores] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function realizarPeticion() {
      const url = "http://localhost:4000/promotores";
      const peticion = {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
        mode: "cors",
      };

      try {
        const respuesta = await fetch(url, peticion);
        if (respuesta.ok) {
          const recibido = await respuesta.json();
          setPromotores(recibido);
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
    realizarPeticion();
  }, []);

  /* jshint ignore:start */
  return cargando ? (
    <Spinner />
  ) : error ? (
    <Error404 error={error} />
  ) : (
    <Container fluid className="p-5">
      <Row xs={1} md={3} xxl={5}>
        {promotores &&
          promotores.map((promotor) => {
            return (
              <Col key={promotor._id}>
                <Link to={`${promotor._id}`} className="noDeco">
                  <Card className="text-center mb-3">
                    <Card.Header>
                      {`${promotor.apellido} \
                        ${promotor.nombre}`}
                    </Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="text-truncate">
                        {promotor.tlf}
                      </ListGroup.Item>
                      <ListGroup.Item className="text-truncate">
                        {promotor.email}
                      </ListGroup.Item>
                    </ListGroup>
                    <Card.Footer className="text-muted">
                      V-{promotor.cedula}
                    </Card.Footer>
                  </Card>
                </Link>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
  /* jshint ignore:end */
}

export default MostrarPromotores;
