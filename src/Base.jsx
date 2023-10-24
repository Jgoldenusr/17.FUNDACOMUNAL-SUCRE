import "./estilos/personalizados.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import FormCC from "./componentes/formularioCC";
import FormIngreso from "./componentes/formularioIngreso";
import FormPromotor from "./componentes/formularioPromotor";
import FormRegistro from "./componentes/formularioRegistro";
import FormReporte from "./componentes/formularioReporte";
import MostrarCCS from "./componentes/mostrarCCS";
import MostrarPromotores from "./componentes/mostrarPromotores";
import MostrarReportes from "./componentes/mostrarReportes";
import VerCC from "./componentes/verCC";
import VerPromotor from "./componentes/verPromotor";
import VerReporte from "./componentes/verReporte";
import {
  ContextoAutenticado,
  Envoltorio,
  Error404,
} from "./componentes/modulos";

function Base() {
  const [miToken, setMiToken] = useState(null);

  useEffect(() => {
    buscarToken();
  }, []);

  const borrarToken = function () {
    setMiToken(null);
    localStorage.removeItem("miToken");
  };

  const buscarToken = function () {
    const tokenGuardado = localStorage.getItem("miToken");
    if (tokenGuardado) {
      setMiToken(tokenGuardado);
    }
  };

  const guardarToken = function (token) {
    setMiToken(token);
    localStorage.setItem("miToken", token);
  };

  /* jshint ignore:start */
  return (
    <ContextoAutenticado.Provider
      value={{ miToken, borrarToken, buscarToken, guardarToken }}
    >
      <BrowserRouter>
        <Stack direction="vertical" className="Lato gradient min-vh-100">
          <Routes>
            {miToken ? (
              <Route element={<Envoltorio />}>
                <Route path="/" element={<MostrarReportes />} />
                <Route path="ccs" element={<MostrarCCS />} />
                <Route path="ccs/nuevo" element={<FormCC />} />
                <Route path="ccs/:id" element={<VerCC />} />
                <Route path="ccs/:id/editar" element={<FormCC />} />
                <Route path="promotores" element={<MostrarPromotores />} />
                <Route path="promotores/nuevo" element={<FormPromotor />} />
                <Route path="promotores/:id" element={<VerPromotor />} />
                <Route
                  path="promotores/:id/editar"
                  element={<FormPromotor />}
                />
                <Route path="reportes/nuevo" element={<FormReporte />} />
                <Route path="/:id" element={<VerReporte />} />
                <Route path="/:id/editar" element={<FormReporte />} />
                <Route path="*" element={<Error404 />} />
              </Route>
            ) : (
              <Route path="*" element={<Error404 />} />
            )}
            <Route path="/" element={<FormIngreso />} />
            <Route path="registrarse" element={<FormRegistro />} />
          </Routes>
        </Stack>
      </BrowserRouter>
    </ContextoAutenticado.Provider>
  );
  /* jshint ignore:end */
}

export default Base;
