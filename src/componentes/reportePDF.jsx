import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  contenedor: {
    border: "1px solid gray",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
    fontSize: "14px",
    margin: "0px 2.5cm 0px 2.5cm",
  },
  item: {
    borderBottom: "1px solid lightgrey",
    padding: "3px",
  },
  itemGris: {
    backgroundColor: "lightgrey",
    borderBottom: "1px solid lightgrey",
    padding: "3px",
  },
  contLogo: {
    width: "30vw",
    height: "15vh",
    margin: "2vh auto -2.5vh auto",
  },
  contMembrete: {
    width: "100%",
    maxHeight: "10%",
    backgroundColor: "#1976d2",
  },
  ultimoItem: { padding: "3px" },
  titulo: {
    fontSize: "20px",
    textAlign: "center",
  },
  clear: {
    clear: "both",
  },
});

//Componentes de react y react router
function ReportePDF({ reporte }) {
  /* jshint ignore:start */
  return (
    <Document>
      <Page size="LETTER">
        <View style={[styles.contMembrete]}>
          <Image src="/cintillo.png" />
        </View>
        <View style={[styles.contLogo]}>
          <Image src="/logo.png" />
        </View>
        <View style={[styles.contenedor]}>
          <View style={[styles.item]}>
            <Text
              style={[styles.titulo]}
            >{`REPORTE ${reporte.tipo.toUpperCase()}`}</Text>
          </View>
          <View style={[styles.item]}>
            <Text>{`AUTOR: ${reporte.usuario.apellido} ${reporte.usuario.nombre}`}</Text>
          </View>
          <View style={[styles.item]}>
            <Text>{`UBICACION: ${reporte.cc.nombre}`}</Text>
          </View>
          <View style={[styles.item]}>
            <Text>{`FECHA: ${reporte.fechaConFormato}`}</Text>
          </View>
          {reporte.tipo === "participacion" ? (
            <>
              <View style={[styles.item]}>
                <Text>{`ORGANOS ADSCRITOS: ${reporte.organosAdscritos}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`ACOMPAÑAMIENTO: ${reporte.acompanamiento}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`FAMILIAS BENEFICIADAS: ${reporte.familiasBeneficiadas}`}</Text>
              </View>
            </>
          ) : reporte.tipo === "formacion" ? (
            <>
              <View style={[styles.item]}>
                <Text>{`ORGANOS ADSCRITOS: ${reporte.organosAdscritos}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`ESTRATEGIA: ${reporte.estrategia}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`MODALIDAD: ${reporte.modalidad}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`TEMATICA: ${reporte.tematica}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`VERIFICACION: ${reporte.verificacion}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`BENEFICIADOS (HOMBRES): ${reporte.beneficiados.hombres}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`BENEFICIADOS (MUJERES): ${reporte.beneficiados.mujeres}`}</Text>
              </View>
            </>
          ) : reporte.tipo === "fortalecimiento" ? (
            <>
              <View style={[styles.item]}>
                <Text>{`ORGANOS ADSCRITOS: ${reporte.organosAdscritos}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`ACOMPAÑAMIENTO: ${reporte.acompanamiento}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`ORGANIZACION SOCIOPRODUCTIVA: ${reporte.nombreOSP}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`TIPO DE ACTIVIDAD: ${reporte.tipoActividad}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`TIPO DE ORGANIZACION SOCIOPRODUCTIVA: ${reporte.tipoOSP}`}</Text>
              </View>
              {reporte.proyectoCFG?.tipo && reporte.proyectoCFG?.etapa && (
                <>
                  <View style={[styles.item]}>
                    <Text>{`ESTADO: ${reporte.proyectoCFG.etapa}`}</Text>
                  </View>
                  <View style={[styles.item]}>
                    <Text>{`TIPO: ${reporte.proyectoCFG.tipo}`}</Text>
                  </View>
                </>
              )}
            </>
          ) : reporte.tipo === "incidencias" ? (
            <>
              <View style={[styles.item]}>
                <Text>{`ORGANOS ADSCRITOS: ${reporte.organosAdscritos}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`TIPO: ${reporte.tipoIncidencia}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`AREA SUSTANTIVA: ${reporte.areaSustantiva}`}</Text>
              </View>
            </>
          ) : reporte.tipo === "casoadmin" ? (
            <>
              <View style={[styles.item]}>
                <Text>{`ORGANOS ADSCRITOS: ${reporte.organosAdscritos}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`CASO: ${reporte.caso}`}</Text>
              </View>
              <View style={[styles.item]}>
                <Text>{`TIPO: ${reporte.tipoCaso}`}</Text>
              </View>
            </>
          ) : reporte.tipo === "comunicaciones" ? (
            <>
              <View style={[styles.item]}>
                <Text>{`ORGANOS ADSCRITOS: ${reporte.organosAdscritos}`}</Text>
              </View>
              {reporte.prensa?.notas && reporte.prensa?.resenas && (
                <>
                  <View style={[styles.item]}>
                    <Text>{`NOTAS: ${reporte.prensa.notas}`}</Text>
                  </View>
                  <View style={[styles.item]}>
                    <Text>{`RESEÑAS: ${reporte.prensa.resenas}`}</Text>
                  </View>
                </>
              )}
              {reporte.redes?.map((info, i) => {
                let par = i % 2 === 0;
                if (info.cuenta && info.publicaciones) {
                  return (
                    <View key={`RED-${i}`}>
                      <View style={par ? [styles.itemGris] : [styles.item]}>
                        <Text>{`CUENTA: ${info.cuenta}`}</Text>
                      </View>
                      <View style={par ? [styles.itemGris] : [styles.item]}>
                        <Text>{`PUBLICACIONES: ${info.publicaciones}`}</Text>
                      </View>
                    </View>
                  );
                }
              })}
            </>
          ) : (
            <>
              <View style={[styles.item]}>
                <Text>{`FECHA DE REGISTRO: ${reporte.fechaRegistroConFormato}`}</Text>
              </View>
            </>
          )}

          <View style={[styles.ultimoItem]}>
            <Text>{`IDENTIFICACION: ${reporte._id}`}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
  /* jshint ignore:end */
}

export default ReportePDF;
