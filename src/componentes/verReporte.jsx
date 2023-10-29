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
  faBook,
  faBriefcase,
  faCircleExclamation,
  faComment,
  faEye,
  faHammer,
  faFlag,
  faIdCard,
  faIndustry,
  faLandmark,
  faListCheck,
  faLocation,
  faMagnifyingGlass,
  faMars,
  faNewspaper,
  faPeopleGroup,
  faPeopleRoof,
  faPersonDigging,
  faPuzzlePiece,
  faQuoteLeft,
  faRss,
  faVenus,
} from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";

function VerReporte() {
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { miUsuario } = useContext(ContextoAutenticado);
  const { id } = useParams();

  useEffect(() => {
    async function realizarPeticion() {
      const url = `http://localhost:4000/reportes/${id}?poblar=true`;
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
          setReporte(recibido);
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
              {`REPORTE DE ${reporte.tipo.toUpperCase()}`}
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <FontAwesomeIcon icon={faIdCard} className="me-2" />
                USUARIO:{" "}
                <Link
                  to={`/usuarios/${reporte.usuario._id}`}
                  replace={true}
                  className="noDeco"
                >{`${reporte.usuario.apellido} \
                ${reporte.usuario.nombre}`}</Link>
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faLocation} className="me-2" />
                LOCALIDAD:{" "}
                <Link
                  to={`/ccs/${reporte.cc._id}`}
                  replace={true}
                  className="noDeco"
                >
                  {`${reporte.cc.nombre}`}
                </Link>
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faLandmark} className="me-2" />
                {`ORGANOS ADSCRITOS: ${reporte.organosAdscritos}`}
              </ListGroup.Item>
            </ListGroup>
            {reporte.tipo === "participacion" ? (
              <ListGroup variant="flush" className="border-top-0">
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="me-2" />
                  {`ACOMPAÑAMIENTO: ${reporte.acompanamiento}`}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faPeopleRoof} className="me-2" />
                  {`FAMILIAS BENEFICIADAS: ${reporte.familiasBeneficiadas}`}
                </ListGroup.Item>
              </ListGroup>
            ) : reporte.tipo === "formacion" ? (
              <ListGroup variant="flush" className="border-top-0">
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faPuzzlePiece} className="me-2" />
                  {`ESTRATEGIA: ${reporte.estrategia}`}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faEye} className="me-2" />
                  {`MODALIDAD: ${reporte.modalidad}`}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faBook} className="me-2" />
                  {`TEMATICA: ${reporte.tematica}`}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faListCheck} className="me-2" />
                  {`VERIFICACION: ${reporte.verificacion}`}
                </ListGroup.Item>
                <Accordion flush>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>BENEFICIADOS:</Accordion.Header>
                    <Accordion.Body className="p-0">
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <FontAwesomeIcon icon={faMars} className="me-2" />
                          {`HOMBRES: ${reporte.beneficiados.hombres}`}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <FontAwesomeIcon icon={faVenus} className="me-2" />
                          {`MUJERES: ${reporte.beneficiados.mujeres}`}
                        </ListGroup.Item>
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </ListGroup>
            ) : reporte.tipo === "fortalecimiento" ? (
              <ListGroup variant="flush" className="border-top-0">
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="me-2" />
                  {`ACOMPAÑAMIENTO: ${reporte.acompanamiento}`}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faPeopleGroup} className="me-2" />
                  {`ORGANIZACION SOCIOPRODUCTIVA: ${reporte.nombreOSP}`}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faHammer} className="me-2" />
                  {`TIPO DE ACTIVIDAD: ${reporte.tipoActividad}`}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faPersonDigging} className="me-2" />
                  {`TIPO DE O.S.P: ${reporte.tipoOSP}`}
                </ListGroup.Item>
                <Accordion flush>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>
                      PROYECTO CONSEJO FEDERAL DE GOBIERNO:
                    </Accordion.Header>
                    <Accordion.Body className="p-0">
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <FontAwesomeIcon icon={faFlag} className="me-2" />
                          {`ETAPA: ${reporte.proyectoCFG.etapa}`}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <FontAwesomeIcon icon={faIndustry} className="me-2" />
                          {`TIPO: ${reporte.proyectoCFG.tipo}`}
                        </ListGroup.Item>
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </ListGroup>
            ) : reporte.tipo === "incidencias" ? (
              <ListGroup variant="flush" className="border-top-0">
                <ListGroup.Item>
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className="me-2"
                  />
                  {`TIPO: ${reporte.tipoIncidencia}`}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="me-2" />
                  {`AREA SUSTANTIVA: ${reporte.areaSustantiva}`}
                </ListGroup.Item>
              </ListGroup>
            ) : reporte.tipo === "casoadmin" ? (
              <ListGroup variant="flush" className="border-top-0">
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faBriefcase} className="me-2" />
                  {`CASO: ${reporte.caso}`}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faComment} className="me-2" />
                  {`TIPO: ${reporte.tipoCaso}`}
                </ListGroup.Item>
              </ListGroup>
            ) : reporte.tipo === "comunicaciones" ? (
              <Accordion flush>
                {reporte.prensa ? (
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>PRENSA:</Accordion.Header>
                    <Accordion.Body className="p-0">
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <FontAwesomeIcon
                            icon={faNewspaper}
                            className="me-2"
                          />
                          {`NOTAS: ${reporte.prensa.notas}`}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <FontAwesomeIcon
                            icon={faQuoteLeft}
                            className="me-2"
                          />
                          {`RESEÑAS: ${reporte.prensa.resenas}`}
                        </ListGroup.Item>
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                ) : (
                  ""
                )}
                {reporte.redes ? (
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>REDES:</Accordion.Header>
                    <Accordion.Body className="p-0">
                      <ListGroup className="px-3 pt-3 pb-0 bg-light">
                        {reporte.redes.map((info, i) => {
                          return (
                            <ListGroup className="pb-3" key={i}>
                              <ListGroup.Item>
                                <FontAwesomeIcon
                                  icon={faRss}
                                  className="me-2"
                                />
                                {`CUENTA: ${info.cuenta}`}
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <FontAwesomeIcon
                                  icon={faComment}
                                  className="me-2"
                                />
                                {`PUBLICACIONES: ${info.publicaciones}`}
                              </ListGroup.Item>
                            </ListGroup>
                          );
                        })}
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                ) : (
                  ""
                )}
              </Accordion>
            ) : (
              ""
            )}
            <Card.Footer className="text-center text-muted">
              {DateTime.fromISO(reporte.fecha).toLocaleString(
                DateTime.DATE_MED
              )}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  /* jshint ignore:end */
}

//create a react bootstrap card with a list group
export default VerReporte;

/* 
              
*/
