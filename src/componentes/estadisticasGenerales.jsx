import { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {
  ContextoAutenticado,
  Error404,
  GraficoDeBarras,
  GraficoDeCalor,
  GraficoDePastel,
  Spinner,
} from "./modulos";

function EstadisticasGenerales() {
  const [dataCCS, setDataCCS] = useState([]);
  const [dataReportes, setDataReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { miUsuario } = useContext(ContextoAutenticado);

  const dataCCSPorMunicipio = function () {
    return dataCCS.map((item) => {
      return {
        ["municipio"]: item.municipio,
        ["Vigentes"]: item.vigentes,
        ["No vigentes"]: item.noVigentes,
        ["Renovados"]: item.renovados,
        ["No renovados"]: item.noRenovados,
      };
    });
  };

  const renovadosTotales = function () {
    let totales = [
      { id: "Renovados", value: 0 },
      { id: "No renovados", value: 0 },
    ];

    dataCCS.forEach(function (item) {
      totales[0].value += item.renovados;
      totales[1].value += item.noRenovados;
    });

    return totales;
  };

  const vigentesTotales = function () {
    let totales = [
      { id: "Vigentes", value: 0 },
      { id: "No vigentes", value: 0 },
    ];

    dataCCS.forEach(function (item) {
      totales[0].value += item.vigentes;
      totales[1].value += item.noVigentes;
    });

    return totales;
  };

  const reportesDiarios = function () {
    return dataReportes.map((item) => {
      return {
        day: item.fecha,
        value: item.reportes,
      };
    });
  };

  useEffect(() => {
    async function realizarPeticion() {
      const url1 = "http://localhost:4000/ccs/estadisticas";
      const url2 = "http://localhost:4000/reportes/estadisticas";
      const peticion = {
        headers: new Headers({
          Authorization: `Bearer ${miUsuario.token}`,
        }),
        mode: "cors",
      };

      try {
        const [respuesta1, respuesta2] = await Promise.all([
          fetch(url1, peticion),
          fetch(url2, peticion),
        ]);
        if (respuesta1.ok && respuesta2.ok) {
          const [recibido1, recibido2] = await Promise.all([
            respuesta1.json(),
            respuesta2.json(),
          ]);
          setDataCCS(recibido1);
          setDataReportes(recibido2);
        } else {
          throw new Error("Fallo la peticion al servidor");
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
        <Col xs={3}>
          <Card className="text-center mb-3">
            <Card.Header>
              <strong>Renovados totales</strong>
            </Card.Header>
            <Card.Body style={{ height: "300px" }}>
              <GraficoDePastel data={renovadosTotales()} />
            </Card.Body>
          </Card>
        </Col>{" "}
        <Col xs={3}>
          <Card className="text-center mb-3">
            <Card.Header>
              <strong>Vigentes totales</strong>
            </Card.Header>
            <Card.Body style={{ height: "300px" }}>
              <GraficoDePastel data={vigentesTotales()} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={6}>
          <Card className="text-center mb-3">
            <Card.Header>
              <strong>Total por municipio</strong>
            </Card.Header>
            <Card.Body style={{ height: "400px" }}>
              <GraficoDeBarras data={dataCCSPorMunicipio()} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={6}>
          <Card className="text-center mb-3">
            <Card.Header>
              <strong>Actividad este trimestre</strong>
            </Card.Header>
            <Card.Body style={{ height: "400px" }}>
              <GraficoDeCalor data={reportesDiarios()} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  /* jshint ignore:end */
}

export default EstadisticasGenerales;
