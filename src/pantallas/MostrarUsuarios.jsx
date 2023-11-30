//Componentes de react y react router
import { useContext, useEffect, useState } from "react";
//Componentes MUI
import {
  Avatar,
  Badge,
  Card,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
//Componentes endogenos
import BotonMenu from "../componentes/BotonMenu";
import ContextoAutenticado from "../componentes/ContextoAutenticado";
import Error from "../componentes/Error";
import Spinner from "../componentes/Spinner";
//Iconos MUI
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

function MostrarUsuarios() {
  const { miUsuario } = useContext(ContextoAutenticado);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [usuarios, setUsuarios] = useState(null);

  useEffect(() => {
    async function realizarPeticion() {
      const url = "http://localhost:4000/usuarios";
      const peticion = {
        headers: new Headers({
          Authorization: `Bearer ${miUsuario.token}`,
        }),
        mode: "cors",
      };

      try {
        const respuesta = await fetch(url, peticion);
        if (respuesta.ok) {
          const recibido = await respuesta.json();
          setUsuarios(recibido);
        } else {
          const recibido = await respuesta.json();
          setError(recibido.error);
        }
      } catch (errorPeticion) {
        setError(errorPeticion);
      } finally {
        setCargando(false);
      }
    }
    realizarPeticion();
  }, []);

  /* jshint ignore:start */
  return cargando ? (
    <Spinner />
  ) : error ? (
    <Error error={error} />
  ) : (
    <Grid container spacing={3}>
      {usuarios &&
        usuarios.map((usuario) => {
          return (
            <Grid item xs={12} md={4} xl={3} key={usuario._id}>
              <Card elevation={6}>
                <CardHeader
                  disableTypography
                  action={<BotonMenu id={usuario._id} />}
                  avatar={
                    <Badge
                      badgeContent={usuario.cc.length}
                      color="error"
                      max={999}
                      overlap="circular"
                    >
                      {usuario.rol === "ADMINISTRADOR" ? (
                        <Avatar sx={{ bgcolor: "#1565c0" }}>
                          <AdminPanelSettingsIcon />
                        </Avatar>
                      ) : (
                        <Avatar sx={{ bgcolor: "#42a5f5" }}>
                          <PersonRoundedIcon />
                        </Avatar>
                      )}
                    </Badge>
                  }
                  sx={{
                    "& .MuiCardHeader-content": {
                      display: "block",
                      overflow: "hidden",
                    },
                  }}
                  subheader={
                    <Typography
                      noWrap
                      color="text.secondary"
                      textOverflow={"ellipsis"}
                      variant="body2"
                    >
                      {`V-${usuario.cedula}`}
                    </Typography>
                  }
                  title={
                    <Typography
                      noWrap
                      textOverflow={"ellipsis"}
                      variant="body1"
                    >
                      {`${usuario.apellido} ${usuario.nombre}`}
                    </Typography>
                  }
                />
              </Card>
            </Grid>
          );
        })}
    </Grid>
  );
  /* jshint ignore:end */
}

export default MostrarUsuarios;
