import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { ContextoAutenticado, Error404, Spinner } from "./modulos";
import { formularioVacioCC } from "../config/plantillas";
import { OpcionesCC } from "../config/opciones";

function FormularioCC() {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [erroresValidacion, setErroresValidacion] = useState(null);
  const [cargando, setCargando] = useState(id ? true : false);
  const [subiendo, setSubiendo] = useState(false);
  const [formulario, setFormulario] = useState({ ...formularioVacioCC });
  const { miUsuario } = useContext(ContextoAutenticado);
  const navegarHasta = useNavigate();

  useEffect(() => {
    async function buscarCCParaEditar() {
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
      setFormulario({ ...formularioVacioCC });
    }
  }, [id]);

  const actualizarFormulario = function (campo, propiedad) {
    return function (evento) {
      if (propiedad) {
        setFormulario({
          ...formulario,
          [propiedad]: { [campo]: evento.target.value },
        });
      } else {
        if (campo === "municipios") {
          setFormulario({
            ...formulario,
            parroquias: "",
            [campo]: evento.target.value,
          });
        } else {
          setFormulario({
            ...formulario,
            [campo]: evento.target.value,
          });
        }
      }
    };
  };

  const esInvalido = function (campo) {
    let resultado = false;
    if (erroresValidacion) {
      erroresValidacion.array.forEach((error) => {
        if (error.path === campo) {
          resultado = true;
        }
      });
    }
    return resultado;
  };

  const mostrarMsjInvalido = function (campo) {
    let msj = "";
    if (erroresValidacion) {
      erroresValidacion.array.forEach((error) => {
        if (error.path === campo) {
          msj = error.msg;
        }
      });
    }
    return msj;
  };

  const realizarPeticion = async function (evento) {
    evento.preventDefault();
    setSubiendo(true);
    setErroresValidacion(null);
    /* jshint ignore:start */
    const url = id
      ? "http://localhost:4000/ccs/" + formulario._id
      : "http://localhost:4000/ccs";
    /* jshint ignore:end */
    const peticion = {
      body: JSON.stringify(formulario),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${miUsuario.token}`,
      }),
      mode: "cors",
      method: id ? "PUT" : "POST",
    };

    try {
      const respuesta = await fetch(url, peticion);
      if (respuesta.ok) {
        const recibido = await respuesta.json();
        navegarHasta(`/ccs/${recibido.id}`, { replace: true });
      } else {
        const recibido = await respuesta.json();
        setErroresValidacion(recibido.error);
      }
    } catch (errorPeticion) {
      setErroresValidacion(errorPeticion);
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
                      <Form.Label>Estado donde se ubica el C.C</Form.Label>
                      <Form.Select
                        disabled
                        size="sm"
                        value={formulario.estados}
                        onChange={actualizarFormulario("estados")}
                        isInvalid={esInvalido("estados")}
                      >
                        <option value="SUCRE">SUCRE</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("estados")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Tipo de consejo comunal</Form.Label>
                      <Form.Select
                        size="sm"
                        value={formulario.tipo}
                        onChange={actualizarFormulario("tipo")}
                        isInvalid={esInvalido("tipo")}
                      >
                        <option value="">SELECCIONE UN TIPO</option>
                        {OpcionesCC.tipo.map((opcion) => (
                          <option key={opcion} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("tipo")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Redi del consejo comunal</Form.Label>
                      <Form.Select
                        disabled
                        size="sm"
                        value={formulario.redi}
                        onChange={actualizarFormulario("redi")}
                        isInvalid={esInvalido("redi")}
                      >
                        <option value="">SELECCIONE UN REDI</option>
                        {OpcionesCC.redi.map((opcion) => (
                          <option key={opcion} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("redi")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Municipio donde se ubica el C.C</Form.Label>
                      <Form.Select
                        size="sm"
                        value={formulario.municipios}
                        onChange={actualizarFormulario("municipios")}
                        isInvalid={esInvalido("municipios")}
                      >
                        <option value="">SELECCIONE UN MUNICIPIO</option>
                        {OpcionesCC.municipios.map((opcion) => (
                          <option key={opcion} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("municipios")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Parroquia donde se ubica el C.C</Form.Label>
                      <Form.Select
                        size="sm"
                        value={formulario.parroquias}
                        onChange={actualizarFormulario("parroquias")}
                        isInvalid={esInvalido("parroquias")}
                      >
                        <option value="">SELECCIONE UNA PARROQUIA</option>
                        {formulario.municipios &&
                          OpcionesCC.parroquias[`${formulario.municipios}`].map(
                            (opcion) => (
                              <option key={opcion} value={opcion}>
                                {opcion}
                              </option>
                            )
                          )}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("parroquias")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Localidad donde se ubica el C.C</Form.Label>
                      <Form.Control
                        maxLength={100}
                        size="sm"
                        type="text"
                        value={formulario.localidad}
                        onChange={actualizarFormulario("localidad")}
                        isInvalid={esInvalido("localidad")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("localidad")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>
                        Comuna donde se incluye el C.C (Opcional)
                      </Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        value={formulario.comuna}
                        onChange={actualizarFormulario("comuna")}
                        isInvalid={esInvalido("comuna")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("comuna")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Nombre del consejo comual</Form.Label>
                      <Form.Control
                        maxLength={100}
                        size="sm"
                        type="text"
                        value={formulario.nombre}
                        onChange={actualizarFormulario("nombre")}
                        isInvalid={esInvalido("nombre")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("nombre")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Codigo situr del consejo comunal</Form.Label>
                      <Form.Control
                        maxLength={17}
                        size="sm"
                        type="text"
                        value={formulario.situr}
                        onChange={actualizarFormulario("situr")}
                        isInvalid={esInvalido("situr")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("situr")}
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Cedula del usuario asociado</Form.Label>
                      <Form.Control
                        maxLength={9}
                        size="sm"
                        type="text"
                        value={formulario.usuario.cedula}
                        onChange={actualizarFormulario("cedula", "usuario")}
                        isInvalid={esInvalido("usuario.cedula")}
                      />
                      <Form.Control.Feedback type="invalid">
                        {mostrarMsjInvalido("usuario.cedula")}
                      </Form.Control.Feedback>
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
