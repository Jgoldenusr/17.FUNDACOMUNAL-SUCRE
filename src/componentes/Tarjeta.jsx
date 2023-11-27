//Componentes de react y react router
import { Link } from "react-router-dom";
//Componentes MUI
import { Card, CardContent, Typography } from "@mui/material";

function Tarjeta({ color, children, Icono, titulo, url }) {
  /* jshint ignore:start */
  return (
    <Link replace className="no-deco" to={url}>
      <Card elevation={6} sx={{ display: "flex" }}>
        <CardContent sx={{ flex: "1 0 auto", textAlign: "center" }}>
          <Typography component="div" variant="h5">
            {children}
          </Typography>
          <Typography
            color="text.secondary"
            component="div"
            variant="subtitle1"
          >
            {titulo}
          </Typography>
        </CardContent>
        <CardContent
          sx={{
            bgcolor: color,
            color: "white",
            textAlign: "center",
          }}
        >
          <Icono sx={{ fontSize: 48 }} />
        </CardContent>
      </Card>
    </Link>
  );
  /* jshint ignore:end */
}

export default Tarjeta;
