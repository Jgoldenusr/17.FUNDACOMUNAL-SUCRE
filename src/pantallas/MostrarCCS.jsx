//Componentes de react y react router
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
//Componentes MUI
import { Avatar, Card, CardHeader, Grid, Typography } from "@mui/material";
//Componentes endogenos
import BotonMenu from "../componentes/BotonMenu";
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Error404 from "../componentes/Error404";
import Spinner from "../componentes/Spinner";
//Iconos MUI
import CabinRoundedIcon from "@mui/icons-material/CabinRounded";
import ForestRoundedIcon from "@mui/icons-material/ForestRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";

function MostrarCCS() {
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [ccs, setCCS] = useState(null);
  const [error, setError] = useState(null);
  const [parametros, setParametros] = useSearchParams();

  useEffect(() => {
    async function realizarPeticion() {
      let url = "http://localhost:4000/ccs?";
      const peticion = {
        headers: new Headers({
          Authorization: `Bearer ${miUsuario.token}`,
        }),
        mode: "cors",
      };
      if (parametros.get("municipios")) {
        url += `municipios=${parametros.get("municipios")}&`;
      }
      if (parametros.get("renovados")) {
        url += "renovados=true&";
      }
      if (parametros.get("norenovados")) {
        url += "norenovados=true&";
      }
      if (parametros.get("vigentes")) {
        url += "vigentes=true&";
      }
      if (parametros.get("novigentes")) {
        url += "novigentes=true&";
      }

      try {
        const respuesta = await fetch(url, peticion);
        if (respuesta.ok) {
          const recibido = await respuesta.json();
          setCCS(recibido);
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
    realizarPeticion();
  }, []);

  /* jshint ignore:start */
  return cargando ? (
    <Spinner />
  ) : error ? (
    <Error404 error={error} />
  ) : (
    <Grid container spacing={3}>
      {ccs &&
        ccs.map((cc) => {
          return (
            <Grid item xs={12} md={6} xl={4} key={cc._id}>
              <Card elevation={6}>
                <CardHeader
                  disableTypography
                  action={<BotonMenu id={cc._id} />}
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor:
                          cc.estaRenovado && cc.estaVigente
                            ? "#2e7d32"
                            : !cc.estaRenovado && !cc.estaVigente
                            ? "#d32f2f"
                            : "#ff9800",
                      }}
                    >
                      {cc.tipo === "URBANO" ? (
                        <HomeWorkRoundedIcon />
                      ) : cc.tipo === "RURAL" ? (
                        <CabinRoundedIcon />
                      ) : (
                        <ForestRoundedIcon />
                      )}
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
                      {cc.situr}
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
                        {cc.nombre}
                      </Typography>
                      <Typography
                        noWrap
                        sx={{ fontStyle: "italic" }}
                        textOverflow={"ellipsis"}
                        variant="body1"
                      >
                        {`${cc.municipios}, ${cc.parroquias}`}
                      </Typography>
                    </>
                  }
                />
              </Card>
            </Grid>
          );
        })}
    </Grid>
  );
  /* jshint ignore:end */
}

export default MostrarCCS;
