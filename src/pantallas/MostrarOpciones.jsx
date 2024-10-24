//Componentes de react y react router
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
//Componentes MUI
import {
  Avatar,
  Card,
  CardHeader,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
//Componentes endogenos
import AlertaError from "../componentes/AlertaError";
import BotonMenu from "../componentes/BotonMenu";
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Spinner from "../componentes/Spinner";
//Iconos MUI
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

function MostrarOpciones() {
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [parametros, setParametros] = useSearchParams();
  const [opciones, setOpciones] = useState(null);
  const [saltarConsulta, setSaltarConsulta] = useState(false);

  const agregarParametrosURL = function (url) {
    let nuevaURL = url;

    if (parametros.get("campo")) {
      nuevaURL += `campo=${parametros.get("campo")}&`;
    }

    return nuevaURL;
  };

  const actualizarParametros = function (campo) {
    return function (evento) {
      evento.preventDefault();
      let valorCampo = evento.target.value;
      let miConsulta = {};
      for (let [clave, valor] of parametros) {
        if (clave && valor) miConsulta[clave] = valor;
      }
      parametros.set(campo, valorCampo);
      setParametros(miConsulta);
    };
  };

  useEffect(() => {
    async function realizarPeticion() {
      setCargando(true);
      setError(null);

      const url = agregarParametrosURL("http://localhost:4000/config?");
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
          setOpciones(recibido);
        } else {
          const recibido = await respuesta.json();
          setError(recibido.error);
          setOpciones(null);
        }
      } catch (errorPeticion) {
        setError(errorPeticion);
        setOpciones(null);
      } finally {
        setCargando(false);
      }
    }
    realizarPeticion();
  }, [parametros]);

  /* jshint ignore:start */
  return (
    <Grid container spacing={3}>
      {cargando ? (
        <Spinner />
      ) : error ? (
        <AlertaError error={error} />
      ) : (
        opciones?.map((opcion) => {
          return (
            <Grid size={{ xs: 12 }} key={opcion._id}>
              <Card elevation={6}>
                <CardHeader
                  disableTypography
                  action={
                    <BotonMenu
                      id={opcion._id}
                      opciones={{
                        editar: ["PROMOTOR", "ESPECIAL"],
                      }}
                    />
                  }
                  avatar={
                    <Avatar sx={{ bgcolor: "#1976d2" }}>
                      <SettingsOutlinedIcon />
                    </Avatar>
                  }
                  sx={{
                    "& .MuiCardHeader-content": {
                      display: "block",
                      overflow: "hidden",
                    },
                  }}
                  subheader={
                    <Typography
                      noWrap
                      color="text.secondary"
                      textOverflow={"ellipsis"}
                      variant="body2"
                    >
                      {`${opcion.array.length} configuracion(es)`}
                    </Typography>
                  }
                  title={
                    <>
                      <Typography
                        noWrap
                        sx={{ fontWeight: "bold", lineHeight: 1.5 }}
                        textOverflow={"ellipsis"}
                        variant="subtitle1"
                      >
                        {`Coleccion > ${opcion.coleccion}`}
                      </Typography>
                      <Typography
                        noWrap
                        sx={{ fontStyle: "italic" }}
                        textOverflow={"ellipsis"}
                        variant="body1"
                      >
                        {opcion.campo}
                      </Typography>
                    </>
                  }
                />
              </Card>
            </Grid>
          );
        })
      )}
    </Grid>
  );
  /* jshint ignore:end */
}

export default MostrarOpciones;
