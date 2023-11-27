import { Backdrop, CircularProgress } from "@mui/material";

function Spinner() {
  /* jshint ignore:start */
  return (
    <Backdrop
      open
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
  /* jshint ignore:end */
}

export default Spinner;
