import { createContext, useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Navbar from "react-bootstrap/Navbar";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faEye,
  faDoorOpen,
  faFileCirclePlus,
  faFileLines,
  faPencil,
  faPeopleGroup,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const ContextoAutenticado = createContext({
  miUsuario: null,
  borrarUsuario: () => {},
  buscarUsuario: () => {},
  guardarUsuario: () => {},
});

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

function Cabecera() {
  const { borrarUsuario } = useContext(ContextoAutenticado);
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
            <Link to="usuarios/nuevo" replace={true} className="noDeco">
              <Dropdown.Item as="button">Usuario</Dropdown.Item>
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
            <Link to="usuarios" replace={true} className="noDeco">
              <Dropdown.Item as="button">Usuarios</Dropdown.Item>
            </Link>
            <Link to="reportes" replace={true} className="noDeco">
              <Dropdown.Item as="button">Reportes</Dropdown.Item>
            </Link>
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="danger" onClick={borrarUsuario}>
          <FontAwesomeIcon icon={faDoorOpen} />
          {" Salir"}
        </Button>
      </Container>
    </Navbar>
  );
  /* jshint ignore:end */
}

function Envoltorio() {
  return (
    /* jshint ignore:start */
    <div>
      <Cabecera />
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

function Overlay({ children, id, url }) {
  /* jshint ignore:start */
  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      rootClose
      overlay={
        <Popover id="popover-positioned-bottom">
          <Stack direction="horizontal" className="p-3">
            <Link to={id} className="noDeco">
              <FontAwesomeIcon className="cursor iconBtn me-3" icon={faEye} />
            </Link>
            <Link to={`${id}/editar`} className="noDeco">
              <FontAwesomeIcon className="cursor iconBtn" icon={faPencil} />
            </Link>
          </Stack>
        </Popover>
      }
    >
      {children}
    </OverlayTrigger>
  );
  /* jshint ignore:end */
}

export {
  ContextoAutenticado,
  AlertaError,
  AlertaBorrar,
  Cabecera,
  Envoltorio,
  Error404,
  Overlay,
  Spinner,
};
