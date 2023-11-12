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
import { ResponsiveTimeRange } from "@nivo/calendar";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { BasicTooltip } from "@nivo/tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime, Interval } from "luxon";
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
              return <li key={`MOD-${indice}`}>{error.msg}</li>;
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

function GraficoDeBarras({ data }) {
  const truncarTexto = ({ textAnchor, textBaseline, value, x, y }) => {
    const MAX_LINE_LENGTH = 16;
    const MAX_LINES = 3;
    const LENGTH_OF_ELLIPSIS = 4;
    const TRIM_LENGTH = MAX_LINE_LENGTH * MAX_LINES - LENGTH_OF_ELLIPSIS;
    const trimWordsOverLength = new RegExp(`^(.{${TRIM_LENGTH}}[^\\w]*).*`);
    const groupWordsByLength = new RegExp(
      `([^\\s].{0,${MAX_LINE_LENGTH}}(?=[\\s\\W]|$))`,
      "gm"
    );
    /* jshint ignore:start */
    const splitValues = value
      .replace(trimWordsOverLength, "$1...")
      .match(groupWordsByLength)
      .slice(0, 2)
      .map((val, i) => (
        <tspan
          key={val}
          dy={12 * i}
          x={-10}
          style={{ fontFamily: "sans-serif", fontSize: "11px" }}
        >
          {val}
        </tspan>
      ));
    return (
      <g transform={`translate(${x},${y})`}>
        <text alignmentBaseline={textBaseline} textAnchor={textAnchor}>
          {splitValues}
        </text>
      </g>
    );
    /* jshint ignore:end */
  };
  /* jshint ignore:start */
  return (
    <ResponsiveBar
      data={data}
      keys={["Vigentes", "No vigentes", "Renovados", "No renovados"]}
      indexBy="municipio"
      groupMode="grouped"
      layout="horizontal"
      margin={{ top: 0, right: 0, bottom: 80, left: 100 }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      enableGridX={true}
      enableGridY={true}
      axisLeft={{
        renderTick: truncarTexto,
      }}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          translateX: 0,
          translateY: 55,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 10,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 20,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
  /* jshint ignore:end */
}

function GraficoDeCalor({ data }) {
  let ahora = DateTime.now();
  const diasDelTrimestre = function () {
    const inicio = ahora.startOf("quarter");
    const fin = ahora.endOf("quarter").plus({ days: 1 });
    const intervaloFechas = Interval.fromDateTimes(inicio, fin);
    const dias = Array.from(intervaloFechas.splitBy({ days: 1 }), (dt) =>
      dt.start.toISODate()
    );
    return dias;
  };

  const fechas = diasDelTrimestre().map((dia) => {
    const fechaEncontrada = data.find((otraFecha) => dia === otraFecha.day);
    if (fechaEncontrada) {
      return {
        day: fechaEncontrada.day,
        value: fechaEncontrada.value,
      };
    } else {
      return {
        day: dia,
        value: 0,
      };
    }
  });

  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  /* jshint ignore:start */
  return (
    <ResponsiveTimeRange
      data={fechas}
      margin={{ top: 35, right: 0, bottom: 0, left: 0 }}
      monthLegend={(a, m, f) => `${meses[f.getMonth()]}`}
      weekdayLegendOffset={0}
      weekdayTicks={[]}
      dayRadius={5}
      daySpacing={5}
      tooltip={({ day, value, color }) => (
        <BasicTooltip
          id={`${value} reportes el ${DateTime.fromISO(day).toLocaleString(
            DateTime.DATE_MED
          )}`}
          color={color}
          enableChip
        />
      )}
    />
  );
  /* jshint ignore:end */
}

function GraficoDePastel({ data }) {
  /* jshint ignore:start */
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      activeOuterRadiusOffset={10}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          translateX: 0,
          translateY: 55,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 10,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 20,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
  /* jshint ignore:end */
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
      placement="top"
      rootClose
      overlay={
        <Popover id="popover-positioned-top">
          <Stack direction="horizontal" className="p-2">
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
  GraficoDeBarras,
  GraficoDeCalor,
  GraficoDePastel,
  Overlay,
  Spinner,
};
