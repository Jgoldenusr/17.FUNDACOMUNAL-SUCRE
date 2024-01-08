import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import ContextoAutenticado from "./ContextoAutenticado";

function Bloquear({ roles }) {
  const { miUsuario } = useContext(ContextoAutenticado);

  /* jshint ignore:start */
  if (!miUsuario) {
    return <Navigate to="/ingresar" />;
  } else if (roles.includes(miUsuario.rol)) {
    return <Navigate to="/error" />;
  } else {
    return <Outlet />;
  }
  /* jshint ignore:end */
}

export default Bloquear;
