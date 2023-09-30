import "./estilos/personalizados.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import FormularioCC from "./componentes/formularioCC";
import FormularioIngreso from "./componentes/formularioIngreso";
import FormularioPromotor from "./componentes/formularioPromotor";
import FormularioRegistro from "./componentes/formularioRegistro";
import FormularioReporte from "./componentes/formularioReporte";
import MostrarCCS from "./componentes/mostrarCCS";
import MostrarPromotores from "./componentes/mostrarPromotores";
import MostrarReportes from "./componentes/mostrarReportes";
import VerCC from "./componentes/verCC";
import VerPromotor from "./componentes/verPromotor";
import VerReporte from "./componentes/verReporte";
import { Envoltorio, Error404 } from "./componentes/modulos";

class Base extends Component {
  constructor() {
    super();
    this.state = {
      miToken: null,
    };

    this.borrarToken = this.borrarToken.bind(this);
    this.buscarToken = this.buscarToken.bind(this);
    this.guardarToken = this.guardarToken.bind(this);
  }
  componentDidMount() {
    this.buscarToken();
  }

  buscarToken() {
    // ESTA FUNCION HAY QUE ARREGLARLA
    const tokenGuardado = localStorage.getItem("miToken");
    if (tokenGuardado) {
      this.setState({ miToken: tokenGuardado });
    }
  }
  borrarToken() {
    this.setState({ miToken: null });
    localStorage.removeItem("miToken");
  }

  guardarToken(token) {
    this.setState({ miToken: token });
    localStorage.setItem("miToken", token);
  }

  render() {
    const { miToken } = this.state;

    /* jshint ignore:start */
    return (
      <BrowserRouter>
        <Stack direction="vertical" className="Lato gradient min-vh-100">
          <Routes>
            {miToken ? (
              <Route element={<Envoltorio borrarToken={this.borrarToken} />}>
                <Route path="/" element={<MostrarReportes token={miToken} />} />
                <Route path="ccs" element={<MostrarCCS token={miToken} />} />
                <Route
                  path="ccs/nuevo"
                  element={<FormularioCC token={miToken} />}
                />
                <Route path="ccs/:id" element={<VerCC token={miToken} />} />
                <Route
                  path="ccs/:id/editar"
                  element={<FormularioCC token={miToken} />}
                />
                <Route
                  path="promotores"
                  element={<MostrarPromotores token={miToken} />}
                />
                <Route
                  path="promotores/nuevo"
                  element={<FormularioPromotor token={miToken} />}
                />
                <Route
                  path="promotores/:id"
                  element={<VerPromotor token={miToken} />}
                />
                <Route
                  path="promotores/:id/editar"
                  element={<FormularioPromotor token={miToken} />}
                />
                <Route
                  path="reportes/nuevo"
                  element={<FormularioReporte token={miToken} />}
                />
                <Route path="/:id" element={<VerReporte token={miToken} />} />
                <Route
                  path="/:id/editar"
                  element={<FormularioReporte token={miToken} />}
                />
                <Route path="*" element={<Error404 />} />
              </Route>
            ) : (
              <Route path="*" element={<Error404 />} />
            )}
            <Route
              path="/"
              element={<FormularioIngreso guardarToken={this.guardarToken} />}
            />
            <Route path="registrarse" element={<FormularioRegistro />} />
          </Routes>
        </Stack>
      </BrowserRouter>
    );
    /* jshint ignore:end */
  }
}

export default Base;
