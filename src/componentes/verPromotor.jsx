import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { ContextoAutenticado, Error404, Spinner } from "./modulos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faIdCard,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

function VerPromotor() {
  const [promotor, setPromotor] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { miToken } = useContext(ContextoAutenticado);
  const { id } = useParams();

  useEffect(() => {
    async function realizarPeticion() {
      const url = "http://localhost:4000/promotores/" + id;
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
          setPromotor(recibido);
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
      <Row className="justify-content-center">
        <Col xs={"auto"}>
          <Card>
            <Link to={"editar"} className="noDeco">
              <Card.Header className="text-center">
                {`${promotor.apellido} \
                ${promotor.nombre}`}
              </Card.Header>
            </Link>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <FontAwesomeIcon icon={faIdCard} />
                {` CEDULA: V-${promotor.cedula}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faPhone} />
                {` TELEFONO: ${promotor.tlf}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faEnvelope} />
                {` E-MAIL: ${promotor.email}`}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  /* jshint ignore:end */
}

export default VerPromotor;
