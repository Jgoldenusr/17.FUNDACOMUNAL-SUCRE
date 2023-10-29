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
  faFingerprint,
  faEnvelope,
  faGlobe,
  faLocation,
  faPhone,
  faTag,
  faTreeCity,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";

function VerUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { miUsuario } = useContext(ContextoAutenticado);
  const { id } = useParams();

  useEffect(() => {
    async function realizarPeticion() {
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
          setUsuario(recibido);
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
            <Card.Header className="text-center">
              {`${usuario.apellido} ${usuario.nombre}`}
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <FontAwesomeIcon icon={faUserLock} className="me-2" />
                {`ROL: ${usuario.rol}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faTag} className="me-2" />
                {`USUARIO: @${usuario.usuario}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faPhone} className="me-2" />
                {`TELEFONO: ${usuario.tlf}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                {`E-MAIL: ${usuario.email}`}
              </ListGroup.Item>
              <Accordion flush>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>UBICACIONES ASOCIADAS:</Accordion.Header>
                  <Accordion.Body className="px-3 pt-3 pb-0 bg-light">
                    {usuario.cc.map((cc) => {
                      return (
                        <Link
                          to={`/ccs/${cc._id}`}
                          replace={true}
                          className="noDeco"
                          key={cc._id}
                        >
                          <ListGroup className="pb-3">
                            <ListGroup.Item>
                              <FontAwesomeIcon
                                icon={faGlobe}
                                className="me-2"
                              />
                              {cc.nombre}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <FontAwesomeIcon
                                icon={faLocation}
                                className="me-2"
                              />
                              {cc.localidad}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <FontAwesomeIcon
                                icon={faTreeCity}
                                className="me-2"
                              />
                              {cc.tipo}
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <FontAwesomeIcon
                                icon={faFingerprint}
                                className="me-2"
                              />
                              {cc.situr}
                            </ListGroup.Item>
                          </ListGroup>
                        </Link>
                      );
                    })}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </ListGroup>
            <Card.Footer className="text-center text-muted">
              {"V-" + usuario.cedula}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  /* jshint ignore:end */
}

export default VerUsuario;
