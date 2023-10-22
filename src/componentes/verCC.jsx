import { React, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { Error404, Spinner } from "./modulos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faLocation,
  faMagnifyingGlassLocation,
  faMap,
  faMapLocationDot,
  faTreeCity,
} from "@fortawesome/free-solid-svg-icons";

function VerCC({ token }) {
  const [cc, setCC] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function realizarPeticion() {
      const url = "http://localhost:4000/ccs/" + id;
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
          setCC(recibido);
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
              <Card.Header className="text-center">{cc.nombre}</Card.Header>
            </Link>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <FontAwesomeIcon icon={faTreeCity} />
                {` TIPO: ${cc.tipo}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faCompass} />
                {` REDI: ${cc.redi}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faMap} />
                {` ESTADOS: ${cc.estados}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faMapLocationDot} />
                {` MUNICIPIOS: ${cc.municipios}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
                {` PARROQUIAS: ${cc.parroquias}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faLocation} />
                {` LOCALIDAD: ${cc.localidad}`}
              </ListGroup.Item>
            </ListGroup>
            <Card.Footer className="text-center text-muted">
              {cc.situr}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  /* jshint ignore:end */
}

export default VerCC;
