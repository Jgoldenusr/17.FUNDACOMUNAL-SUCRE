//Componentes de react y react router
import { useState } from "react";
//Componentes MUI
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  MobileStepper,
  Typography,
} from "@mui/material";
//Iconos MUI
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
//Componentes endogenos
import GraficoDeCalor from "./GraficoDeCalor";

function ReportesTrimestrales({ data, filtro, id }) {
  const [miTrimestre, setMiTrimestre] = useState(
    Math.floor((new Date().getMonth() + 3) / 3) - 1
  );

  const siguiente = function () {
    setMiTrimestre((miTrimestre) => miTrimestre + 1);
  };

  const anterior = function () {
    setMiTrimestre((miTrimestre) => miTrimestre - 1);
  };

  /* jshint ignore:start */
  return (
    <Card elevation={6}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#1976d2" }}>
            <CalendarMonthRoundedIcon />
          </Avatar>
        }
        disableTypography
        title={
          <Typography component="div" variant="subtitle1">
            ACTIVIDAD TRIMESTRAL DEL PERIODO
          </Typography>
        }
        sx={{ bgcolor: "#1976d2", color: "white", py: 1 }}
      />
      <CardContent sx={{ aspectRatio: 3 / 1.5, px: 5 }}>
        <GraficoDeCalor
          data={data}
          filtro={filtro}
          id={id}
          trimestre={miTrimestre + 1}
        />
        <MobileStepper
          steps={4}
          position="static"
          activeStep={miTrimestre}
          nextButton={
            <Button
              size="small"
              onClick={siguiente}
              disabled={miTrimestre === 3}
            >
              SIGUIENTE
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={anterior}
              disabled={miTrimestre === 0}
            >
              <KeyboardArrowLeft />
              ANTERIOR
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
  /* jshint ignore:end */
}

export default ReportesTrimestrales;
