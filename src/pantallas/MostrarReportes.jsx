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
import AssignmentLateRoundedIcon from "@mui/icons-material/AssignmentLateRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import FmdBadRoundedIcon from "@mui/icons-material/FmdBadRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
//Otros
import { DateTime } from "luxon";

function MostrarReportes() {
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [parametros, setParametros] = useSearchParams();
  const [reportes, setReportes] = useState(null);

  useEffect(() => {
    async function realizarPeticion() {
      let url = "http://localhost:4000/reportes?";
      const peticion = {
        headers: new Headers({
          Authorization: `Bearer ${miUsuario.token}`,
        }),
        mode: "cors",
      };

      if (parametros.get("desde") && parametros.get("hasta")) {
        url += `desde=${parametros.get("desde")}&hasta=${parametros.get(
          "hasta"
        )}&`;
      }

      try {
        const respuesta = await fetch(url, peticion);
        if (respuesta.ok) {
          const recibido = await respuesta.json();
          setReportes(recibido);
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
  }, [parametros]);

  /* jshint ignore:start */
  return cargando ? (
    <Spinner />
  ) : error ? (
    <Error404 error={error} />
  ) : (
    <Grid container spacing={3}>
      {reportes &&
        reportes.map((reporte) => {
          return (
            <Grid item xs={12} md={4} xl={3} key={reporte._id}>
              <Card elevation={6}>
                <CardHeader
                  disableTypography
                  action={<BotonMenu id={reporte._id} />}
                  avatar={
                    reporte.tipo === "casoadmin" ? (
                      <Avatar sx={{ bgcolor: "#9c27b0" }}>
                        <AssignmentLateRoundedIcon />
                      </Avatar>
                    ) : reporte.tipo === "comunicaciones" ? (
                      <Avatar sx={{ bgcolor: "#03a9f4" }}>
                        <RssFeedRoundedIcon />
                      </Avatar>
                    ) : reporte.tipo === "fortalecimiento" ? (
                      <Avatar sx={{ bgcolor: "#01579b" }}>
                        <ConstructionRoundedIcon />
                      </Avatar>
                    ) : reporte.tipo === "formacion" ? (
                      <Avatar sx={{ bgcolor: "#2e7d32" }}>
                        <SchoolRoundedIcon />
                      </Avatar>
                    ) : reporte.tipo === "incidencias" ? (
                      <Avatar sx={{ bgcolor: "#d32f2f" }}>
                        <FmdBadRoundedIcon />
                      </Avatar>
                    ) : reporte.tipo === "participacion" ? (
                      <Avatar sx={{ bgcolor: "#ed6c02" }}>
                        <Diversity3RoundedIcon />
                      </Avatar>
                    ) : (
                      ""
                    )
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
                      {DateTime.fromISO(reporte.fecha, {
                        setZone: true,
                      }).toLocaleString(DateTime.DATE_MED)}
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
                        {reporte.cc.nombre}
                      </Typography>
                      <Typography
                        noWrap
                        sx={{ fontStyle: "italic" }}
                        textOverflow={"ellipsis"}
                        variant="body1"
                      >
                        {`${reporte.usuario.apellido} \
                    ${reporte.usuario.nombre}`}
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

export default MostrarReportes;
