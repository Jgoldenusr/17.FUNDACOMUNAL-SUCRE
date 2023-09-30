import { React, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faDoorOpen,
  faFileCirclePlus,
  faFileLines,
  faPeopleGroup,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

function AlertaBorrar({ realizarPeticion, setBorrar }) {
  const [visible, setVisible] = useState(true);

  const cerrar = function () {
    setVisible(false);
    setBorrar(false);
  };

  return (
    /* jshint ignore:start */

    <Modal show={visible} onHide={cerrar}>
      <Modal.Header closeButton>
        <Modal.Title className="fs-5 text-center">
          Confirme la eliminacion
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Card.Title>Esta accion no se puede deshacer</Card.Title>
        <Card.Text>¿Esta seguro de que desea borrar el reporte?</Card.Text>
        <Button variant="danger" className="mx-auto" onClick={realizarPeticion}>
          Si, deseo borrarlo
        </Button>
      </Modal.Body>
    </Modal>
    /* jshint ignore:end */
  );
}

function AlertaError({ error }) {
  const [visible, setVisible] = useState(error);

  const cerrar = function () {
    setVisible(null);
  };

  return (
    /* jshint ignore:start */
    <Modal show={visible} onHide={cerrar}>
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">
          Fallo la peticion al servidor
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error.array ? (
          <ul>
            {error.array.map((error, indice) => {
              return <li key={indice}>{error.msg}</li>;
            })}
          </ul>
        ) : (
          <p>{`${error.message}`}</p>
        )}
      </Modal.Body>
    </Modal>
    /* jshint ignore:end */
  );
}

function Cabecera({ borrarToken }) {
  /* jshint ignore:start */
  return (
    <Navbar expand="md" bg="light" className="Lato shadow p-3">
      <Container className="w-auto">
        <Link to="/" replace={true} className="noDeco">
          <Navbar.Brand className="fs-4">
            <FontAwesomeIcon icon={faPeopleGroup} />
            {" FUNDACOMUNAL-APP"}
          </Navbar.Brand>
        </Link>
      </Container>
      <Container className="float-end w-auto">
        <Dropdown as={ButtonGroup} className="me-3">
          <Button variant="primary">
            <FontAwesomeIcon icon={faFileCirclePlus} />
            {" Nuevo"}
          </Button>
          <Dropdown.Toggle split variant="primary" />
          <Dropdown.Menu>
            <Link to="ccs/nuevo" replace={true} className="noDeco">
              <Dropdown.Item as="button">Consejo Comunal</Dropdown.Item>
            </Link>
            <Link to="promotores/nuevo" replace={true} className="noDeco">
              <Dropdown.Item as="button">Promotor</Dropdown.Item>
            </Link>
            <Link to="reportes/nuevo" replace={true} className="noDeco">
              <Dropdown.Item as="button">Reporte</Dropdown.Item>
            </Link>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown as={ButtonGroup} className="me-3">
          <Button variant="secondary">
            <FontAwesomeIcon icon={faFileLines} />
            {" Mostrar"}
          </Button>
          <Dropdown.Toggle split variant="secondary" />
          <Dropdown.Menu>
            <Link to="ccs" replace={true} className="noDeco">
              <Dropdown.Item as="button">Consejo Comunales</Dropdown.Item>
            </Link>
            <Link to="promotores" replace={true} className="noDeco">
              <Dropdown.Item as="button">Promotores</Dropdown.Item>
            </Link>
            <Link to="/" replace={true} className="noDeco">
              <Dropdown.Item as="button">Reportes</Dropdown.Item>
            </Link>
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="danger" onClick={borrarToken}>
          <FontAwesomeIcon icon={faDoorOpen} />
          {" Salir"}
        </Button>
      </Container>
    </Navbar>
  );
  /* jshint ignore:end */
}

function Envoltorio({ borrarToken }) {
  return (
    /* jshint ignore:start */
    <div>
      <Cabecera borrarToken={borrarToken} />
      <Outlet />
    </div>
    /* jshint ignore:end */
  );
}

function Error404({ error }) {
  return (
    /* jshint ignore:start */
    <Container fluid>
      <Row className="justify-content-center p-5">
        <Col xs={10} md={5}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center fs-1">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </Card.Title>
              <Card.Title className="text-center fs-1">Error 404</Card.Title>
              <Card.Text className="text-center">
                {error
                  ? error.message
                  : "No se pudo acceder al recurso solicitado."}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    /* jshint ignore:end */
  );
}

function Spinner() {
  /* jshint ignore:start */
  return (
    <Container fluid className="fs-3 p-5 text-center">
      <FontAwesomeIcon icon={faSpinner} spin />
    </Container>
  );
  /* jshint ignore:end */
}
export { AlertaError, AlertaBorrar, Cabecera, Envoltorio, Spinner, Error404 };
