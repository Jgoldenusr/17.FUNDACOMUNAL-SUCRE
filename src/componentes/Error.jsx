//Componentes de react y react router
import { useNavigate } from "react-router-dom";
//Componentes MUI
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
//Iconos MUI
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";

function Error({ error }) {
  const navegarHasta = useNavigate();

  /* jshint ignore:start */
  return (
    <Grid container justifyContent="center">
      <Grid item xs={10} md={6}>
        <Card elevation={6}>
          <CardContent
            sx={{ bgcolor: "#1976d2", color: "white", textAlign: "center" }}
          >
            <ReportProblemIcon sx={{ fontSize: 72 }} />
            <Typography component="div" variant="h5">
              Ha ocurrido un error!
            </Typography>
          </CardContent>
          <CardContent>
            <Typography align="center" component="div" variant="subtitle1">
              {error
                ? error.message
                : "No se pudo acceder al recurso solicitado. \
               Es posible que el recurso no exista o que usted \
               no posea los permisos necesarios."}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              endIcon={<UndoRoundedIcon />}
              onClick={() => {
                navegarHasta("/", { replace: true });
              }}
              sx={{ m: 1 }}
              variant="contained"
            >
              Volver a inicio
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
  /* jshint ignore:end */
}

export default Error;
