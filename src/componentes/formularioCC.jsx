import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { AlertaError, Error404, Spinner } from "./modulos";

function FormularioCC({ token }) {
  const { id } = useParams();
  const formularioVacio = {
    tipo: "",
    redi: "",
    estados: "",
    municipios: "",
    parroquias: "",
    localidad: "",
    nombre: "",
    situr: "",
  };
  const [error, setError] = useState(null);
  const [errorDeValidacion, setErrorDeValidacion] = useState(null);
  const [cargando, setCargando] = useState(id ? true : false);
  const [subiendo, setSubiendo] = useState(false);
  const [formulario, setFormulario] = useState({ ...formularioVacio });
  const navegarHasta = useNavigate();

  useEffect(() => {
    async function buscarCCParaEditar() {
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
          setFormulario(recibido);
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
    if (id) {
      buscarCCParaEditar();
    } else {
      setFormulario({ ...formularioVacio });
    }
  }, [id]);

  const actualizarFormulario = function (evento) {
    setFormulario({ ...formulario, [evento.target.id]: evento.target.value });
  };

  const realizarPeticion = async function (evento) {
    evento.preventDefault();
    setSubiendo(true);
    setErrorDeValidacion(null);
    /* jshint ignore:start */
    const url = id
      ? "http://localhost:4000/ccs/" + formulario._id
      : "http://localhost:4000/ccs";
    /* jshint ignore:end */
    const peticion = {
      body: JSON.stringify(formulario),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
      mode: "cors",
      method: id ? "PUT" : "POST",
    };

    try {
      const respuesta = await fetch(url, peticion);
      if (respuesta.ok) {
        const recibido = await respuesta.json();
        navegarHasta(`/ccs/${recibido._id}`, { replace: true });
      } else {
        const recibido = await respuesta.json();
        setErrorDeValidacion(recibido.error);
      }
    } catch (errorPeticion) {
      setErrorDeValidacion(errorPeticion);
    } finally {
      setSubiendo(false);
    }
  };

  /* jshint ignore:start */
  return cargando ? (
    <Spinner />
  ) : error ? (
    <Error404 error={error} />
  ) : (
    <Container fluid>
      <Row className="justify-content-center p-5">
        <Col xs={12} md={6}>
          <Card>
            <Card.Header className="text-center fs-5">
              {id
                ? "Actualizar consejo comunal"
                : "Registrar nuevo consejo comunal"}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={realizarPeticion}>
                <Container fluid>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Tipo de consejo comunal</Form.Label>
                      <Form.Select
                        size="sm"
                        id="tipo"
                        value={formulario.tipo}
                        onChange={actualizarFormulario}
                      >
                        <option>Seleccione un tipo</option>
                        <option value="INDIGENA">INDIGENA</option>
                        <option value="MIXTO">MIXTO</option>
                        <option value="RURAL">RURAL</option>
                        <option value="URBANO">URBANO</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Redi del consejo comunal</Form.Label>
                      <Form.Select
                        size="sm"
                        id="redi"
                        value={formulario.redi}
                        onChange={actualizarFormulario}
                      >
                        <option>Seleccione un redi</option>
                        <option value="ANDES">ANDES</option>
                        <option value="CAPITAL">CAPITAL</option>
                        <option value="CENTRAL">CENTRAL</option>
                        <option value="GUAYANA">GUAYANA</option>
                        <option value="INSULAR">INSULAR</option>
                        <option value="LLANOS">LLANOS</option>
                        <option value="OCCIDENTAL">OCCIDENTAL</option>
                        <option value="ORIENTAL">ORIENTAL</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Estado donde se ubica el C.C</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="estados"
                        value={formulario.estados}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Municipio donde se ubica el C.C</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="municipios"
                        value={formulario.municipios}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Parroquia donde se ubica el C.C</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="parroquias"
                        value={formulario.parroquias}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Localidad donde se ubica el C.C</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="localidad"
                        value={formulario.localidad}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Nombre del consejo comual</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="nombre"
                        value={formulario.nombre}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Codigo situr del consejo comunal</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="situr"
                        value={formulario.situr}
                        onChange={actualizarFormulario}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={"auto"}>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={subiendo}
                      >
                        {id ? "Actualizar" : "Registrar"}
                      </Button>
                    </Col>
                  </Row>
                </Container>
                {errorDeValidacion ? (
                  <AlertaError error={errorDeValidacion} />
                ) : (
                  ""
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
  /* jshint ignore:end */
}

export default FormularioCC;
