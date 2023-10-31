import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { ContextoAutenticado, Error404, Spinner } from "./modulos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faCompass,
  faIdCard,
  faListCheck,
  faLocation,
  faMagnifyingGlassLocation,
  faMap,
  faMapLocationDot,
  faPeopleRoof,
  faTreeCity,
  faUser,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";

function VerCC() {
  const [cc, setCC] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { miUsuario } = useContext(ContextoAutenticado);
  const { id } = useParams();

  useEffect(() => {
    async function realizarPeticion() {
      const url = "http://localhost:4000/ccs/" + id;
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
            <Card.Header className="text-center">{cc.nombre}</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <FontAwesomeIcon icon={faPeopleRoof} className="me-2" />
                {`COMUNA: ${cc.comuna || "SIN COMUNA"} `}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faTreeCity} className="me-2" />
                {`TIPO: ${cc.tipo}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faCompass} className="me-2" />
                {`REDI: ${cc.redi}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faMap} className="me-2" />
                {`ESTADOS: ${cc.estados}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faMapLocationDot} className="me-2" />
                {`MUNICIPIOS: ${cc.municipios}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon
                  icon={faMagnifyingGlassLocation}
                  className="me-2"
                />
                {`PARROQUIAS: ${cc.parroquias}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faLocation} className="me-2" />
                {`LOCALIDAD: ${cc.localidad}`}
              </ListGroup.Item>
              <ListGroup.Item variant={cc.estaRenovado ? "success" : "danger"}>
                <FontAwesomeIcon icon={faListCheck} className="me-2" />
                {`RENOVADO: ${cc.estaRenovado ? "SI" : "NO"}`}
              </ListGroup.Item>
              <ListGroup.Item variant={cc.estaVigente ? "success" : "danger"}>
                <FontAwesomeIcon icon={faCalendarCheck} className="me-2" />
                {`VIGENTE: ${cc.estaVigente ? "SI" : "NO"}`}
              </ListGroup.Item>
              <Accordion flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>USUARIO ASOCIADO:</Accordion.Header>
                  <Accordion.Body className="p-0">
                    <Link
                      to={`/usuarios/${cc.usuario._id}`}
                      replace={true}
                      className="noDeco"
                    >
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <FontAwesomeIcon icon={faUser} className="me-2" />
                          {`${cc.usuario.apellido} ${cc.usuario.nombre}`}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <FontAwesomeIcon icon={faUserLock} className="me-2" />
                          {cc.usuario.rol}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <FontAwesomeIcon icon={faIdCard} className="me-2" />
                          {`V-${cc.usuario.cedula}`}
                        </ListGroup.Item>
                      </ListGroup>
                    </Link>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
