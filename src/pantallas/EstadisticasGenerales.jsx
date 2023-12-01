//Componentes de react y react router
import { useContext, useEffect, useState } from "react";
//Componentes MUI
import { Card, CardContent, Grid } from "@mui/material";
//Iconos MUI
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import LocationOnIcon from "@mui/icons-material/LocationOn";
//Componentes endogenos
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Error from "../componentes/Error";
import GraficoDeBarras from "../componentes/GraficoDeBarras";
import GraficoDePastel from "../componentes/GraficoDePastel";
import Spinner from "../componentes/Spinner";
import Tarjeta from "../componentes/Tarjeta";

function EstadisticasGenerales() {
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [dataCCS, setDataCCS] = useState([]);
  const [error, setError] = useState(null);

  const dataCCSPorMunicipio = function () {
    return dataCCS.map((item) => {
      return {
        ["municipio"]: item.municipio,
        ["Renovados"]: item.renovados,
        ["No renovados"]: item.noRenovados,
        ["Vigentes"]: item.vigentes,
        ["No vigentes"]: item.noVigentes,
      };
    });
  };

  const renovadosTotales = function () {
    let totales = [
      { id: "Renovados", value: 0 },
      { id: "No renovados", value: 0 },
    ];

    dataCCS.forEach(function (item) {
      totales[0].value += item.renovados;
      totales[1].value += item.noRenovados;
    });

    return totales;
  };

  const vigentesTotales = function () {
    let totales = [
      { id: "Vigentes", value: 0 },
      { id: "No vigentes", value: 0 },
    ];

    dataCCS.forEach(function (item) {
      totales[0].value += item.vigentes;
      totales[1].value += item.noVigentes;
    });

    return totales;
  };

  useEffect(() => {
    async function realizarPeticion() {
      const url = "http://localhost:4000/ccs/estadisticas";
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
          setDataCCS(recibido);
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
    <Error error={error} />
  ) : (
    <Grid container rowSpacing={3} spacing={2}>
      <Grid item xs={12} md={3}>
        <Tarjeta
          color="#ed6c02"
          Icono={LocationOnIcon}
          titulo="Ubicaciones"
          url="/ccs"
        >
          {dataCCS.reduce((acc, item) => acc + item.ccs, 0)}
        </Tarjeta>
      </Grid>
      <Grid item xs={12} md={3}>
        <Tarjeta
          color="#03a9f4"
          Icono={AssignmentTurnedInRoundedIcon}
          titulo="Renovadas"
          url="/ccs?renovados=true"
        >
          {Math.round(
            (dataCCS.reduce((acc, item) => acc + item.renovados, 0) /
              dataCCS.reduce((acc, item) => acc + item.ccs, 0)) *
              100
          )}
          {"%"}
        </Tarjeta>
      </Grid>
      <Grid item xs={12} md={3}>
        <Tarjeta
          color="#4caf50"
          Icono={EventAvailableRoundedIcon}
          titulo="Vigentes"
          url="/ccs?vigentes=true"
        >
          {Math.round(
            (dataCCS.reduce((acc, item) => acc + item.vigentes, 0) /
              dataCCS.reduce((acc, item) => acc + item.ccs, 0)) *
              100
          )}
          {"%"}
        </Tarjeta>
      </Grid>
      <Grid item xs={12} md={3}>
        <Tarjeta
          color="#ef5350"
          Icono={FlagRoundedIcon}
          titulo="Comunas"
          url="/ccs"
        >
          {dataCCS.reduce((acc, item) => acc + item.comunas, 0)}
        </Tarjeta>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card elevation={3}>
          <CardContent sx={{ aspectRatio: 4 / 2.5 }}>
            <GraficoDePastel
              colores={["#54aeff", "#ffc501"]}
              data={renovadosTotales()}
              nombre="renovados"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card elevation={3}>
          <CardContent sx={{ aspectRatio: 4 / 2.5 }}>
            <GraficoDePastel
              colores={["#40c463", "#ff9800"]}
              data={vigentesTotales()}
              nombre="vigentes"
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent sx={{ aspectRatio: 1 / 2 }}>
            <GraficoDeBarras
              colores={["#54aeff", "#ffc501", "#40c463", "#ff9800"]}
              data={dataCCSPorMunicipio()}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
  /* jshint ignore:end */
}

export default EstadisticasGenerales;
