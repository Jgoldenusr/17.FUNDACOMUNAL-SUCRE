import { ResponsivePie } from "@nivo/pie";
import { useNavigate } from "react-router-dom";

function GraficoDePastel({ data, colores, nombre }) {
  const navegarHasta = useNavigate();
  /* jshint ignore:start */
  return (
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
        enableArcLinkLabels={window.innerWidth < 767 ? false : true}
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
  );
  /* jshint ignore:end */
}

export default GraficoDePastel;
