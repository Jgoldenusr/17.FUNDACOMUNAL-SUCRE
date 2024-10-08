//Componentes de react router
import { Link } from "react-router-dom";
//Componentes MUI
import {
  Avatar,
  Badge,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
//Iconos Mui
import AssignmentLateRoundedIcon from "@mui/icons-material/AssignmentLateRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import FmdBadRoundedIcon from "@mui/icons-material/FmdBadRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import SatelliteAltRoundedIcon from "@mui/icons-material/SatelliteAltRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
//Componentes endogenos
import BotonMenu from "../componentes/BotonMenu";

function ReportesTotales({ cb, data, filtro, id, periodo }) {
  /* jshint ignore:start */
  return (
    <Card elevation={6}>
      <CardHeader
        action={
          <BotonMenu
            cb={cb}
            opciones={{
              periodos: [],
            }}
          />
        }
        avatar={
          <Avatar sx={{ bgcolor: "#1976d2" }}>
            <SatelliteAltRoundedIcon />
          </Avatar>
        }
        disableTypography
        title={
          <Typography component="div" variant="subtitle1">
            {`REPORTES TOTALES (${periodo})`}
          </Typography>
        }
        sx={{ bgcolor: "#1976d2", color: "white", py: 1 }}
      />
      <CardContent>
        <Stack
          direction="row"
          justifyContent="center"
          spacing={3}
          useFlexGap
          sx={{ flexWrap: "wrap" }}
        >
          <Badge
            badgeContent={data.reduce((acc, item) => acc + item.casoadmin, 0)}
            color="error"
            max={999}
            overlap="circular"
          >
            <Link
              to={`../reportes?${filtro}=${id}&periodo=${periodo}&tipo=casoadmin`}
            >
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <AssignmentLateRoundedIcon />
              </Avatar>
            </Link>
          </Badge>
          <Badge
            badgeContent={data.reduce(
              (acc, item) => acc + item.comunicaciones,
              0
            )}
            color="error"
            max={999}
            overlap="circular"
          >
            <Link
              to={`../reportes?${filtro}=${id}&periodo=${periodo}&tipo=comunicaciones`}
            >
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <RssFeedRoundedIcon />
              </Avatar>
            </Link>
          </Badge>
          <Badge
            badgeContent={data.reduce(
              (acc, item) => acc + item.fortalecimiento,
              0
            )}
            color="error"
            max={999}
            overlap="circular"
          >
            <Link
              to={`../reportes?${filtro}=${id}&periodo=${periodo}&tipo=fortalecimiento`}
            >
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <ConstructionRoundedIcon />
              </Avatar>
            </Link>
          </Badge>
          <Badge
            badgeContent={data.reduce((acc, item) => acc + item.formacion, 0)}
            color="error"
            max={999}
            overlap="circular"
          >
            <Link
              to={`../reportes?${filtro}=${id}&periodo=${periodo}&tipo=formacion`}
            >
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <SchoolRoundedIcon />
              </Avatar>
            </Link>
          </Badge>
          <Badge
            badgeContent={data.reduce((acc, item) => acc + item.incidencias, 0)}
            color="error"
            max={999}
            overlap="circular"
          >
            <Link
              to={`../reportes?${filtro}=${id}&periodo=${periodo}&tipo=incidencias`}
            >
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <FmdBadRoundedIcon />
              </Avatar>
            </Link>
          </Badge>
          <Badge
            badgeContent={data.reduce(
              (acc, item) => acc + item.participacion,
              0
            )}
            color="error"
            max={999}
            overlap="circular"
          >
            <Link
              to={`../reportes?${filtro}=${id}&periodo=${periodo}&tipo=participacion`}
            >
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <Diversity3RoundedIcon />
              </Avatar>
            </Link>
          </Badge>
          <Badge
            badgeContent={data.reduce((acc, item) => acc + item.interno, 0)}
            color="error"
            max={999}
            overlap="circular"
          >
            <Link
              to={`../reportes?${filtro}=${id}&periodo=${periodo}&tipo=interno`}
            >
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <VerifiedRoundedIcon />
              </Avatar>
            </Link>
          </Badge>
        </Stack>
      </CardContent>
    </Card>
  );
  /* jshint ignore:end */
}

export default ReportesTotales;
