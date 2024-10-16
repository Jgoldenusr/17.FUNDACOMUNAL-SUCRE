//Componentes de react
import { useState } from "react";
//Componentes MUI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  SvgIcon,
} from "@mui/material";
//Iconos MUI
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";

function AlertaError({ error, icono, titulo }) {
  const [visible, setVisible] = useState(error);

  const cerrar = function () {
    setVisible(null);
  };

  /* jshint ignore:start */
  return (
    <Dialog fullWidth maxWidth="xs" open={!!visible} onClose={cerrar}>
      <DialogTitle
        sx={{ bgcolor: "#1976d2", color: "white", textAlign: "center" }}
      >
        <SvgIcon component={icono || ReportProblemIcon} sx={{ fontSize: 72 }} />
        <Typography component="div" variant="h5">
          {titulo || "Ocurrio un error procesando su peticion"}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2, pb: 0 }}>
        <DialogContentText align="center">{`${error.message}`}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ m: 1 }}
          endIcon={<ThumbUpAltRoundedIcon />}
          onClick={cerrar}
          variant="contained"
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
  /* jshint ignore:end */
}

export default AlertaError;
