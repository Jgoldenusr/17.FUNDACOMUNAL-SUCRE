import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { ContextoAutenticado, AlertaError, Error404, Spinner } from "./modulos";

const formularioVacio = {
  usuario: { cedula: "" },
  comuna: "",
  estados: "SUCRE",
  localidad: "",
  municipios: "",
  nombre: "",
  parroquias: "",
  redi: "ORIENTAL",
  situr: "",
  tipo: "",
};

const Opciones = {
  tipo: ["INDIGENA", "MIXTO", "RURAL", "URBANO"],
  redi: [
    "ANDES",
    "CAPITAL",
    "CENTRAL",
    "GUAYANA",
    "INSULAR",
    "LLANOS",
    "OCCIDENTAL",
    "ORIENTAL",
  ],
  municipios: [
    "ANDRES ELOY BLANCO",
    "ANDRES MATA",
    "ARISMENDI",
    "BENITEZ",
    "BERMUDEZ",
    "BOLIVAR",
    "CAJIGAL",
    "CRUZ SALMERON ACOSTA",
    "LIBERTADOR",
    "MARIÑO",
    "MEJIA",
    "MONTES",
    "RIBERO",
    "SUCRE",
    "VALDEZ",
  ],
  parroquias: {
    ["ANDRES ELOY BLANCO"]: ["MARIÑO", "ROMULO GALLEGOS"],
    ["ANDRES MATA"]: ["SAN JOSE DE AEROCUAR", "TAVERA ACOSTA"],
    ["ARISMENDI"]: [
      "RIO CARIBE",
      "ANTONIO JOSE DE SUCRE",
      "EL MORRO DE PUERTO SANTO",
      "PUERTO SANTO",
      "SAN JUAN DE LAS GALDONAS",
    ],
    ["BENITEZ"]: [
      "EL PILAR",
      "EL RINCON",
      "GENERAL FRANCISCO ANTONIO VAZQUEZ",
      "GUARAUNOS",
      "TUNAPUICITO",
      "UNION",
    ],
    ["BERMUDEZ"]: [
      "SANTA CATALINA",
      "SANTA ROSA",
      "SANTA TERESA",
      "BOLIVAR",
      "MARACAPANA",
    ],
    ["BOLIVAR"]: ["MARIGUITAR"],
    ["CAJIGAL"]: ["LIBERTAD", "EL PAUJIL", "YAGUARAPARO"],
    ["CRUZ SALMERON ACOSTA"]: [
      "CRUZ SALMERON ACOSTA",
      "CHACOPATA",
      "MANICUARE",
    ],
    ["LIBERTADOR"]: ["TUNAPUY", "CAMPO ELIAS"],
    ["MARIÑO"]: [
      "IRAPA",
      "CAMPO CLARO",
      "MARAVAL",
      "SAN ANTONIO DE IRAPA",
      "SORO",
    ],
    ["MEJIA"]: ["MEJIA"],
    ["MONTES"]: [
      "CUMANACOA",
      "ARENAS",
      "ARICAGUA",
      "COCOLLAR",
      "SAN FERNANDO",
      "SAN LORENZO",
    ],
    ["RIBERO"]: [
      "VILLA FRONTADO (MUELLE DE CARIACO)",
      "CATUARO",
      "RENDON",
      "SAN CRUZ",
      "SANTA MARIA",
    ],
    ["SUCRE"]: [
      "ALTAGRACIA",
      "SANTA INES",
      "VALENTIN VALIENTE",
      "AYACUCHO",
      "SAN JUAN",
      "RAUL LEONI",
      "GRAN MARISCAL",
    ],
    ["VALDEZ"]: ["CRISTOBAL COLON", "BIDEAU", "PUNTA DE PIEDRAS", "GUIRIA"],
  },
};

function FormularioCC() {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [errorDeValidacion, setErrorDeValidacion] = useState(null);
  const [cargando, setCargando] = useState(id ? true : false);
  const [subiendo, setSubiendo] = useState(false);
  const [formulario, setFormulario] = useState({ ...formularioVacio });
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
      setFormulario({ ...formularioVacio });
    }
  }, [id]);
  const actualizarFormulario = function (propiedad) {
    return function (evento) {
      if (propiedad) {
        setFormulario({
          ...formulario,
          [propiedad]: { [evento.target.id]: evento.target.value },
        });
      } else {
        if (evento.target.id === "municipios") {
          setFormulario({
            ...formulario,
            parroquias: "",
            [evento.target.id]: evento.target.value,
          });
        } else {
          setFormulario({
            ...formulario,
            [evento.target.id]: evento.target.value,
          });
        }
      }
    };
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
                      <Form.Label>Estado donde se ubica el C.C</Form.Label>
                      <Form.Select
                        disabled
                        size="sm"
                        id="estados"
                        value={formulario.estados}
                        onChange={actualizarFormulario()}
                      >
                        <option value="SUCRE">SUCRE</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Tipo de consejo comunal</Form.Label>
                      <Form.Select
                        size="sm"
                        id="tipo"
                        value={formulario.tipo}
                        onChange={actualizarFormulario()}
                      >
                        <option value="">SELECCIONE UN TIPO</option>
                        {Opciones.tipo.map((opcion) => (
                          <option key={opcion} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Redi del consejo comunal</Form.Label>
                      <Form.Select
                        disabled
                        size="sm"
                        id="redi"
                        value={formulario.redi}
                        onChange={actualizarFormulario()}
                      >
                        <option value="">SELECCIONE UN REDI</option>
                        {Opciones.redi.map((opcion) => (
                          <option key={opcion} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Municipio donde se ubica el C.C</Form.Label>
                      <Form.Select
                        size="sm"
                        id="municipios"
                        value={formulario.municipios}
                        onChange={actualizarFormulario()}
                      >
                        <option value="">SELECCIONE UN MUNICIPIO</option>
                        {Opciones.municipios.map((opcion) => (
                          <option key={opcion} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Parroquia donde se ubica el C.C</Form.Label>
                      <Form.Select
                        size="sm"
                        id="parroquias"
                        value={formulario.parroquias}
                        onChange={actualizarFormulario()}
                      >
                        <option value="">SELECCIONE UNA PARROQUIA</option>
                        {formulario.municipios &&
                          Opciones.parroquias[`${formulario.municipios}`].map(
                            (opcion) => (
                              <option key={opcion} value={opcion}>
                                {opcion}
                              </option>
                            )
                          )}
                      </Form.Select>
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
                        onChange={actualizarFormulario()}
                      />
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
                        id="comuna"
                        value={formulario.comuna}
                        onChange={actualizarFormulario()}
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
                        onChange={actualizarFormulario()}
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
                        onChange={actualizarFormulario()}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col xs={12} md={10}>
                      <Form.Label>Cedula del usuario asociado</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        id="cedula"
                        value={formulario.usuario.cedula}
                        onChange={actualizarFormulario("usuario")}
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
