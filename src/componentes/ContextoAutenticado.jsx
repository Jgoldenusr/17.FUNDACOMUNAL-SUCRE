import { createContext } from "react";

const ContextoAutenticado = createContext({
  miUsuario: null,
  borrarUsuario: () => {},
  buscarUsuario: () => {},
  guardarUsuario: () => {},
});

export default ContextoAutenticado;
