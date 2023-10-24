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
  faCalendarDay,
  faPeopleRoof,
  faIdCard,
  faLandmark,
  faLocation,
  faMagnifyingGlassLocation,
} from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";

function VerReporte() {
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { miToken } = useContext(ContextoAutenticado);
  const { id } = useParams();

  useEffect(() => {
    async function realizarPeticion() {
      const url = "http://localhost:4000/reportes/" + id;
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
            <Link to={"editar"} className="noDeco">
              <Card.Header className="text-center">
                {`REPORTE DE ${reporte.tipo}`}
              </Card.Header>
            </Link>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <FontAwesomeIcon icon={faCalendarDay} />
                {` FECHA: ${DateTime.fromISO(reporte.fecha).toLocaleString(
                  DateTime.DATE_MED
                )}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faIdCard} />
                PROMOTOR:{" "}
                <Link
                  to={`/promotores/${reporte.promotor._id}`}
                  replace={true}
                >{`${reporte.promotor.apellido} \
                ${reporte.promotor.nombre}`}</Link>
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faLocation} />
                LOCALIDAD:{" "}
                <Link to={`/ccs/${reporte.cc._id}`} replace={true}>
                  {`${reporte.cc.nombre}`}
                </Link>
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
                {` ACOMPAÑAMIENTO: ${reporte.acompanamiento}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faLandmark} />
                {` ORGANOS ADSCRITOS: ${reporte.organosAdscritos}`}
              </ListGroup.Item>
              <ListGroup.Item>
                <FontAwesomeIcon icon={faPeopleRoof} />
                {` FAMILIAS BENEFICIADAS: ${reporte.familiasBeneficiadas}`}
              </ListGroup.Item>
            </ListGroup>
            <Card.Footer className="text-center text-muted">
              {reporte._id}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  /* jshint ignore:end */
}

export default VerReporte;
