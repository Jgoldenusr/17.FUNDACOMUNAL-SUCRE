import { ResponsiveBar } from "@nivo/bar";
import { useNavigate } from "react-router-dom";
//Componentes MUI
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
//Iconos MUI
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";

function GraficoDeBarras({ data, colores, titulo }) {
  const navegarHasta = useNavigate();

  const esDispositivoMovil = window.innerWidth < 767;
  const truncarTexto = ({ textAnchor, textBaseline, value, x, y }) => {
    const MAX_LINE_LENGTH = 16;
    const MAX_LINES = 3;
    const LENGTH_OF_ELLIPSIS = 4;
    const TRIM_LENGTH = MAX_LINE_LENGTH * MAX_LINES - LENGTH_OF_ELLIPSIS;
    const trimWordsOverLength = new RegExp(`^(.{${TRIM_LENGTH}}[^\\w]*).*`);
    const groupWordsByLength = new RegExp(
      `([^\\s].{0,${MAX_LINE_LENGTH}}(?=[\\s\\W]|$))`,
      "gm"
    );
    /* jshint ignore:start */
    const splitValues = value
      .replace(trimWordsOverLength, "$1...")
      .match(groupWordsByLength)
      .slice(0, 2)
      .map((val, i) => (
        <tspan
          key={val}
          dy={12 * i}
          x={-10}
          style={{ fontFamily: "sans-serif", fontSize: "11px" }}
        >
          {val}
        </tspan>
      ));
    return (
      <g transform={`translate(${x},${y})`}>
        <text alignmentBaseline={textBaseline} textAnchor={textAnchor}>
          {splitValues}
        </text>
      </g>
    );
    /* jshint ignore:end */
  };
  /* jshint ignore:start */
  return (
    <Card elevation={3}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#1976d2" }}>
            <AnalyticsRoundedIcon />
          </Avatar>
        }
        disableTypography
        title={
          <Typography component="div" variant="subtitle1">
            {titulo}
          </Typography>
        }
        sx={{ bgcolor: "#1976d2", color: "white", py: 1 }}
      />
      <CardContent sx={{ height: { xs: "100vh", md: "150vh" } }}>
        <div id="BC-GENERAL" style={{ height: "100%" }}>
          <ResponsiveBar
            colors={colores}
            data={data}
            keys={["Renovados", "No renovados", "Vigentes", "No vigentes"]}
            indexBy="municipio"
            groupMode="stacked"
            layout="horizontal"
            margin={{
              top: 10,
              right: esDispositivoMovil ? 10 : 80,
              bottom: esDispositivoMovil ? 110 : 80,
              left: 100,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            enableGridX={true}
            enableGridY={true}
            axisBottom={esDispositivoMovil ? null : {}}
            axisLeft={{
              renderTick: truncarTexto,
            }}
            onMouseEnter={(e) => {
              document.querySelector("#BC-GENERAL").style.cursor = "pointer";
            }}
            onMouseLeave={(e) => {
              document.querySelector("#BC-GENERAL").style.cursor = "default";
            }}
            onClick={(n, e) => {
              let url = `/ccs?municipios=${n.indexValue}&`;
              switch (n.id) {
                case "No renovados": {
                  url += "estatus=norenovado";
                  break;
                }
                case "No vigentes": {
                  url += "estatus=novigente";
                  break;
                }
                case "Renovados": {
                  url += "estatus=renovado";
                  break;
                }
                case "Vigentes": {
                  url += "estatus=vigente";
                  break;
                }
              }
              navegarHasta(url);
            }}
            legends={[
              {
                anchor: esDispositivoMovil ? "bottom-left" : "bottom",
                direction: esDispositivoMovil ? "column" : "row",
                translateX: 0,
                translateY: esDispositivoMovil ? 100 : 55,
                itemsSpacing: 15,
                itemWidth: 100,
                itemHeight: 10,
                itemTextColor: "#999",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 20,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000",
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
  /* jshint ignore:end */
}

export default GraficoDeBarras;
