import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContextoAutenticado from "./componentes/ContextoAutenticado.jsx";
import Bloquear from "./componentes/Bloquear.jsx";
import Error from "./componentes/Error.jsx";
import Envoltorio from "./pantallas/Envoltorio.jsx";
import EstadisticasGenerales from "./pantallas/EstadisticasGenerales.jsx";
import FormularioCC from "./pantallas/FormularioCC.jsx";
import FormularioIngreso from "./pantallas/FormularioIngreso.jsx";
import FormularioOpcion from "./pantallas/FormularioOpcion.jsx";
import FormularioReporte from "./pantallas/FormularioReporte.jsx";
import FormularioUsuario from "./pantallas/FormularioUsuario.jsx";
import MiCuenta from "./pantallas/MiCuenta.jsx";
import MostrarCCS from "./pantallas/MostrarCCS.jsx";
import MostrarOpciones from "./pantallas/MostrarOpciones.jsx";
import MostrarReportes from "./pantallas/MostrarReportes.jsx";
import MostrarUsuarios from "./pantallas/MostrarUsuarios.jsx";
import VerCC from "./pantallas/VerCC.jsx";
import VerReporte from "./pantallas/VerReporte.jsx";
import VerUsuario from "./pantallas/VerUsuario.jsx";

function Base() {
  const borrarUsuario = function (evento) {
    evento.preventDefault();
    setMiUsuario(null);
    localStorage.removeItem("miUsuario");
  };

  const buscarUsuario = function () {
    const usuarioGuardado = localStorage.getItem("miUsuario");
    if (usuarioGuardado) {
      return JSON.parse(usuarioGuardado);
    } else {
      return null;
    }
  };

  const guardarUsuario = function (usr) {
    setMiUsuario(usr);
    localStorage.setItem("miUsuario", JSON.stringify(usr));
  };

  const [miUsuario, setMiUsuario] = useState(buscarUsuario());

  /* jshint ignore:start */
  /* prettier-ignore */
  return (
    <ContextoAutenticado.Provider
      value={{ miUsuario, borrarUsuario, guardarUsuario }}
    >
      <BrowserRouter>
          <Routes>
            <Route element={<Bloquear roles={["PROMOTOR"]} />}>
              <Route element={<Envoltorio />}>
                <Route path="ccs/nuevo" element={<FormularioCC />} />
                <Route path="ccs/:id/editar" element={<FormularioCC />} />
                <Route path="config" element={<MostrarOpciones />} />
                <Route path="config/:id/editar" element={<FormularioOpcion />} />
                <Route path="usuarios" element={<MostrarUsuarios />} />
                <Route path="usuarios/nuevo" element={<FormularioUsuario />}/>
                <Route path="usuarios/:id" element={<VerUsuario />} />
                <Route path="usuarios/:id/editar" element={<FormularioUsuario />}/>
              </Route>
            </Route>
            <Route element={<Bloquear roles={[""]} />}>
              <Route element={<Envoltorio />}>
                <Route path="/" element={<EstadisticasGenerales />} />
                <Route path="ccs" element={<MostrarCCS />} />
                <Route path="ccs/:id" element={<VerCC />} />
                <Route path="cuenta" element={<MiCuenta />} />
                <Route path="reportes" element={<MostrarReportes />} />
                <Route path="reportes/nuevo" element={<FormularioReporte />} />
                <Route path="reportes/:id" element={<VerReporte />} /> 
                <Route path="reportes/:id/editar" element={<FormularioReporte />} />
                <Route path="*" element={<Error />} />
              </Route>
            </Route>
            <Route>
              <Route path="/ingresar" element={<FormularioIngreso />} />
            </Route>
          </Routes>
      </BrowserRouter>
    </ContextoAutenticado.Provider>
  );
  /* jshint ignore:end */
}

export default Base;
