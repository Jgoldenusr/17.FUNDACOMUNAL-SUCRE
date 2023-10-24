import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { ContextoAutenticado, Error404, Spinner } from "./modulos";

function MostrarCCS() {
  const [ccs, setCCS] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { miToken } = useContext(ContextoAutenticado);

  useEffect(() => {
    async function realizarPeticion() {
      const url = "http://localhost:4000/ccs";
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
          setCCS(recibido);
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
        {ccs &&
          ccs.map((cc) => {
            return (
              <Col key={cc._id}>
                <Link to={`${cc._id}`} className="noDeco">
                  <Card className="text-center mb-3">
                    <Card.Header>{cc.nombre}</Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="text-truncate">
                        {cc.tipo}
                      </ListGroup.Item>
                      <ListGroup.Item className="text-truncate">
                        {cc.municipios}
                      </ListGroup.Item>
                    </ListGroup>
                    <Card.Footer className="text-muted">{cc.situr}</Card.Footer>
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

export default MostrarCCS;
