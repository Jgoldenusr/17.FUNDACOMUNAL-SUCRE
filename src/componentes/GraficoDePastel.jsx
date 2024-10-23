import { ResponsivePie } from "@nivo/pie";
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
import DataUsageRoundedIcon from "@mui/icons-material/DataUsageRounded";

function GraficoDePastel({ data, colores, nombre, titulo }) {
  const navegarHasta = useNavigate();

  const esDispositivoMovil = window.innerWidth < 767;
  /* jshint ignore:start */
  return (
    <Card elevation={3}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#1976d2" }}>
            <DataUsageRoundedIcon />
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
      <CardContent sx={{ height: "45vh" }}>
        <div id={`PC-${nombre}`} style={{ height: "100%" }}>
          <ResponsivePie
            data={data}
            colors={colores}
            margin={{ top: 40, right: 40, bottom: 80, left: 40 }}
            innerRadius={0.5}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            activeOuterRadiusOffset={10}
            enableArcLinkLabels={esDispositivoMovil < 767 ? false : true}
            onMouseEnter={(e) => {
              document.querySelector(`#PC-${nombre}`).style.cursor = "pointer";
            }}
            onMouseLeave={(e) => {
              document.querySelector(`#PC-${nombre}`).style.cursor = "default";
            }}
            onClick={(n, e) => {
              let url = `/ccs?`;
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
                anchor: "bottom",
                direction: "row",
                translateX: 0,
                translateY: 55,
                itemsSpacing: 0,
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

export default GraficoDePastel;
