import { ResponsiveTimeRange } from "@nivo/calendar";
import { BasicTooltip } from "@nivo/tooltip";
import { DateTime, Interval } from "luxon";
import { useNavigate } from "react-router-dom";

function GraficoDeCalor({ data, trimestre }) {
  const navegarHasta = useNavigate();

  const diasDelTrimestre = function () {
    const inicio = DateTime.fromFormat(trimestre.toString(), "q");
    const fin = inicio.endOf("quarter").plus({ days: 1 });
    const intervaloFechas = Interval.fromDateTimes(inicio, fin);
    const dias = Array.from(intervaloFechas.splitBy({ days: 1 }), (dt) =>
      dt.start.toISODate()
    );
    return dias;
  };

  const fechas = diasDelTrimestre().map((dia) => {
    const fechaEncontrada = data.find((otraFecha) => dia === otraFecha.day);
    if (fechaEncontrada) {
      return {
        day: fechaEncontrada.day,
        value: fechaEncontrada.value,
      };
    } else {
      return {
        day: dia,
        value: 0,
      };
    }
  });

  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  /* jshint ignore:start */
  return (
    <div id={`RTG-${trimestre}`} style={{ height: "100%" }}>
      <ResponsiveTimeRange
        data={fechas}
        margin={{ top: 20, right: 40, bottom: 10, left: 40 }}
        colors={["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]}
        monthLegend={(a, m, f) => `${meses[f.getMonth()]}`}
        weekdayLegendOffset={0}
        weekdayTicks={[]}
        dayRadius={5}
        daySpacing={5}
        onMouseEnter={(e) => {
          document.querySelector(`#RTG-${trimestre}`).style.cursor = "pointer";
        }}
        onMouseLeave={(e) => {
          document.querySelector(`#RTG-${trimestre}`).style.cursor = "default";
        }}
        onClick={(d, e) => {
          navegarHasta(
            `/reportes?desde=${d.day}&hasta=${DateTime.fromISO(d.day)
              .plus({ days: 1 })
              .toISODate()}`,
            {
              replace: true,
            }
          );
        }}
        tooltip={({ day, value, color }) => (
          <BasicTooltip
            id={`${value} reporte(s) el ${DateTime.fromISO(day, {
              setZone: true,
            }).toLocaleString(DateTime.DATE_MED)}`}
            color={color}
            enableChip
          />
        )}
      />
    </div>
  );
  /* jshint ignore:end */
}

export default GraficoDeCalor;
