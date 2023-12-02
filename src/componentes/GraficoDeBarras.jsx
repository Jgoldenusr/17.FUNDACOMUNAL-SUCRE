import { ResponsiveBar } from "@nivo/bar";
import { useNavigate } from "react-router-dom";

function GraficoDeBarras({ data, colores }) {
  const navegarHasta = useNavigate();
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
    <div id="BC-GENERAL" style={{ height: "100%" }}>
      <ResponsiveBar
        colors={colores}
        data={data}
        keys={["Renovados", "No renovados", "Vigentes", "No vigentes"]}
        indexBy="municipio"
        groupMode="grouped"
        layout="horizontal"
        margin={{ top: 10, right: 80, bottom: 80, left: 100 }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        enableGridX={true}
        enableGridY={true}
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
          navegarHasta(url, {
            replace: true,
          });
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

export default GraficoDeBarras;
