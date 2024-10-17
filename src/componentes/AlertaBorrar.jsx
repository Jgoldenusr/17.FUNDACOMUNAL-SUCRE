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
} from "@mui/material";
//Iconos MUI
import ReportRoundedIcon from "@mui/icons-material/ReportRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

function AlertaBorrar({ realizarPeticion, setBorrar }) {
  const [visible, setVisible] = useState(true);

  const cerrar = function () {
    setVisible(false);
    setBorrar(false);
  };

  /* jshint ignore:start */
  return (
    <Dialog open={visible} onClose={cerrar}>
      <DialogTitle
        sx={{ bgcolor: "#d32f2f", color: "white", textAlign: "center" }}
      >
        <ReportRoundedIcon sx={{ fontSize: 72 }} />
        <Typography component="div" variant="h5">
          Confirme la eliminacion
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2, pb: 0 }}>
        <DialogContentText align="center">
          Esta accion no se puede deshacer
        </DialogContentText>
        <DialogContentText align="center">
          ¿Esta seguro de que desea realizar la eliminacion?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          endIcon={<DeleteForeverRoundedIcon />}
          onClick={realizarPeticion}
          sx={{ m: 1 }}
          variant="contained"
        >
          Si, deseo borrarlo
        </Button>
      </DialogActions>
    </Dialog>
  );
  /* jshint ignore:end */
}

export default AlertaBorrar;
