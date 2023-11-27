import "./estilos/css/personalizados.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline } from "@mui/material";
import Base from "./Base.jsx";

//Se ajusta el punto de acceso de react, usando el elemento con la id="root" del archivo index.html
const raiz = createRoot(document.getElementById("root"));
//Se llama al metodo render y se le pasa el componente Base, que contendra todos los demas componentes
raiz.render(
  /* jshint ignore:start */
  <React.StrictMode>
    <CssBaseline />
    <Base />
  </React.StrictMode>
  /* jshint ignore:end */
);
