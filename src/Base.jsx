import "./estilos/personalizados.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import FormularioCC from "./componentes/formularioCC";
import FormularioIngreso from "./componentes/formularioIngreso";
import FormularioReporte from "./componentes/formularioReporte";
import FormularioUsuario from "./componentes/formularioUsuario";
import MostrarCCS from "./componentes/mostrarCCS";
import MostrarUsuarios from "./componentes/mostrarUsuarios";
import MostrarReportes from "./componentes/mostrarReportes";
import VerCC from "./componentes/verCC";
import VerUsuario from "./componentes/verUsuario";
import VerReporte from "./componentes/verReporte";
import {
  ContextoAutenticado,
  Envoltorio,
  Error404,
} from "./componentes/modulos";

function Base() {
  const [miUsuario, setMiUsuario] = useState(null);

  useEffect(() => {
    buscarUsuario();
  }, []);

  const borrarUsuario = function () {
    setMiUsuario(null);
    localStorage.removeItem("miUsuario");
  };

  const buscarUsuario = function () {
    const usuarioGuardado = localStorage.getItem("miUsuario");
    if (usuarioGuardado) {
      setMiUsuario(JSON.parse(usuarioGuardado));
    }
  };

  const guardarUsuario = function (usr) {
    setMiUsuario(usr);
    localStorage.setItem("miUsuario", JSON.stringify(usr));
  };

  /* jshint ignore:start */
  return (
    <ContextoAutenticado.Provider
      value={{ miUsuario, borrarUsuario, buscarUsuario, guardarUsuario }}
    >
      <BrowserRouter>
        <Stack direction="vertical" className="Lato gradient min-vh-100">
          <Routes>
            {miUsuario ? (
              /* prettier-ignore */
              <Route element={<Envoltorio />}>
                <Route path="ccs" element={<MostrarCCS />} />
                <Route path="ccs/nuevo" element={<FormularioCC />} />
                <Route path="ccs/:id" element={<VerCC />} />
                <Route path="ccs/:id/editar" element={<FormularioCC />} />
                <Route path="usuarios" element={<MostrarUsuarios />} />
                <Route path="usuarios/nuevo" element={<FormularioUsuario />}/>
                <Route path="usuarios/:id" element={<VerUsuario />} />
                <Route path="usuarios/:id/editar" element={<FormularioUsuario />}/>
                <Route path="/reportes" element={<MostrarReportes />} />
                <Route path="reportes/nuevo" element={<FormularioReporte />} />
                <Route path="reportes/:id" element={<VerReporte />} /> 
                <Route path="reportes/:id/editar" element={<FormularioReporte />} />
                <Route path="*" element={<Error404 />} />
              </Route>
            ) : (
              <Route>
                <Route path="*" element={<FormularioIngreso />} />
              </Route>
            )}
          </Routes>
        </Stack>
      </BrowserRouter>
    </ContextoAutenticado.Provider>
  );
  /* jshint ignore:end */
}

export default Base;
