import { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { ContextoAutenticado, Error404, Overlay, Spinner } from "./modulos";
import { DateTime } from "luxon";

function MostrarReportes() {
  const [reportes, setReportes] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { miUsuario } = useContext(ContextoAutenticado);

  useEffect(() => {
    async function realizarPeticion() {
      const url = "http://localhost:4000/reportes";
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
          setReportes(recibido);
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
        {reportes &&
          reportes.map((reporte) => {
            return (
              <Col key={reporte._id}>
                <Overlay id={reporte._id}>
                  <Card className="cursor text-center mb-3">
                    <Card.Header>{reporte.tipo.toUpperCase()}</Card.Header>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="text-truncate">
                        {`${reporte.usuario.apellido} \
                        ${reporte.usuario.nombre}`}
                      </ListGroup.Item>
                      <ListGroup.Item className="text-truncate">
                        {reporte.cc.nombre}
                      </ListGroup.Item>
                    </ListGroup>
                    <Card.Footer className="text-muted">
                      {DateTime.fromISO(reporte.fecha).toLocaleString(
                        DateTime.DATE_MED
                      )}
                    </Card.Footer>
                  </Card>
                </Overlay>
              </Col>
            );
          })}
      </Row>
    </Container>
  );
  /* jshint ignore:end */
}

export default MostrarReportes;
