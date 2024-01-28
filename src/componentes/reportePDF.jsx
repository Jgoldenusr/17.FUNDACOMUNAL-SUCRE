import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import IBMPlexSansCondensedBold from "../fuentes/IBMPlexSansCondensed-Bold.ttf";
import IBMPlexSansCondensedItalic from "../fuentes/IBMPlexSansCondensed-Italic.ttf";
import IBMPlexSansCondensedRegular from "../fuentes/IBMPlexSansCondensed-Regular.ttf";

const styles = StyleSheet.create({
  contenedor: {
    display: "flex",
    flexDirection: "column",
    fontFamily: "IBM Plex Sans Condensed",
    fontSize: "12px",
    margin: "0px 2.5cm 0px 2.5cm",
  },
  contFooter: {
    color: "gray",
    fontFamily: "IBM Plex Sans Condensed",
    fontSize: "8px",
    fontStyle: "italic",
    margin: "20px 2.5cm 0px 2.5cm",
    textAlign: "center",
  },
  contLogo: {
    width: "30vw",
    height: "15vh",
    margin: "20px auto -20px auto",
  },
  contMembrete: {
    width: "100%",
    maxHeight: "10%",
    backgroundColor: "#1976d2",
  },
  italic: { fontSize: "12px", fontStyle: "italic" },
  item: {
    borderBottom: "1px solid lightgrey",
    borderLeft: "1px solid lightgrey",
    borderRight: "1px solid lightgrey",
    padding: "3px",
  },
  itemGris: {
    backgroundColor: "#f1f1f1",
    borderBottom: "1px solid lightgrey",
    borderLeft: "1px solid lightgrey",
    borderRight: "1px solid lightgrey",
    padding: "3px",
  },
  negrita: { fontSize: "12px", fontWeight: "bold" },
  normal: { fontSize: "12px", fontWeight: "normal" },
  primerItem: {
    backgroundColor: "#1976d2",
    borderTopLeftRadius: "5px",
    borderTopRightRadius: "5px",
    color: "white",
    padding: "3px",
  },
  titulo: {
    fontSize: "12px",
    fontWeight: "bold",
    textAlign: "center",
  },
  ultimoItem: {
    borderBottom: "1px solid lightgrey",
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
    borderLeft: "1px solid lightgrey",
    borderRight: "1px solid lightgrey",
    padding: "3px",
  },
});

//Componentes de react y react router
function ReportePDF({ reporte }) {
  Font.register({
    family: "IBM Plex Sans Condensed",
    fonts: [
      {
        src: IBMPlexSansCondensedRegular,
        fontStyle: "normal",
        fontWeight: "normal",
      },
      {
        src: IBMPlexSansCondensedItalic,
        fontStyle: "italic",
        fontWeight: "normal",
      },
      {
        src: IBMPlexSansCondensedBold,
        fontStyle: "normal",
        fontWeight: "bold",
      },
    ],
  });
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
          <View style={[styles.primerItem]}>
            <Text
              style={[styles.titulo]}
            >{`REPORTE ${reporte.tipo.toUpperCase()}`}</Text>
          </View>
          <View style={[styles.item]}>
            <Text style={[styles.negrita]}>
              {`AUTOR: `}
              <Text style={[styles.italic]}>
                {`${reporte.usuario.apellido} ${reporte.usuario.nombre} (${reporte.usuario.cedula})`}
              </Text>
            </Text>
          </View>
          <View style={[styles.item]}>
            <Text style={[styles.negrita]}>
              {`UBICACION: `}
              <Text
                style={[styles.italic]}
              >{`${reporte.cc.nombre} (${reporte.cc.situr})`}</Text>
            </Text>
          </View>
          <View style={[styles.item]}>
            <Text style={[styles.negrita]}>
              {`FECHA: `}
              <Text
                style={[styles.italic]}
              >{`${reporte.fechaConFormato}`}</Text>
            </Text>
          </View>
          {reporte.tipo === "participacion" ? (
            <>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`ORGANOS ADSCRITOS: `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.organosAdscritos}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`ACOMPAÑAMIENTO: `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.acompanamiento}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`FAMILIAS BENEFICIADAS: `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.familiasBeneficiadas}`}</Text>
                </Text>
              </View>
            </>
          ) : reporte.tipo === "formacion" ? (
            <>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`ORGANOS ADSCRITOS: `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.organosAdscritos}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`ESTRATEGIA: `}
                  <Text style={[styles.normal]}>{`${reporte.estrategia}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`MODALIDAD: `}
                  <Text style={[styles.normal]}>{`${reporte.modalidad}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`TEMATICA: `}
                  <Text style={[styles.normal]}>{`${reporte.tematica}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`VERIFICACION: `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.verificacion}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`BENEFICIADOS (HOMBRES): `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.beneficiados.hombres}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`BENEFICIADOS (MUJERES): `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.beneficiados.mujeres}`}</Text>
                </Text>
              </View>
            </>
          ) : reporte.tipo === "fortalecimiento" ? (
            <>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`ORGANOS ADSCRITOS: `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.organosAdscritos}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`ACOMPAÑAMIENTO: `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.acompanamiento}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`ORGANIZACION SOCIOPRODUCTIVA: `}
                  <Text style={[styles.normal]}>{`${reporte.nombreOSP}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`TIPO DE ACTIVIDAD: `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.tipoActividad}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`TIPO DE ORGANIZACION SOCIOPRODUCTIVA: `}
                  <Text style={[styles.normal]}>{`${reporte.tipoOSP}`}</Text>
                </Text>
              </View>
              {reporte.proyectoCFG?.tipo && reporte.proyectoCFG?.etapa && (
                <>
                  <View style={[styles.item]}>
                    <Text style={[styles.negrita]}>
                      {`ESTADO: `}
                      <Text
                        style={[styles.normal]}
                      >{`${reporte.proyectoCFG.etapa}`}</Text>
                    </Text>
                  </View>
                  <View style={[styles.item]}>
                    <Text style={[styles.negrita]}>
                      {`TIPO: `}
                      <Text
                        style={[styles.normal]}
                      >{`${reporte.proyectoCFG.tipo}`}</Text>
                    </Text>
                  </View>
                </>
              )}
            </>
          ) : reporte.tipo === "incidencias" ? (
            <>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`ORGANOS ADSCRITOS: `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.organosAdscritos}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`TIPO: `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.tipoIncidencia}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`AREA SUSTANTIVA: `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.areaSustantiva}`}</Text>
                </Text>
              </View>
            </>
          ) : reporte.tipo === "casoadmin" ? (
            <>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`ORGANOS ADSCRITOS: `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.organosAdscritos}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`CASO: `}
                  <Text style={[styles.normal]}>{`${reporte.caso}`}</Text>
                </Text>
              </View>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`TIPO: `}
                  <Text style={[styles.normal]}>{`${reporte.tipoCaso}`}</Text>
                </Text>
              </View>
            </>
          ) : reporte.tipo === "comunicaciones" ? (
            <>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`ORGANOS ADSCRITOS: `}
                  <Text
                    style={[styles.normal]}
                  >{`${reporte.organosAdscritos}`}</Text>
                </Text>
              </View>
              {reporte.prensa?.notas && reporte.prensa?.resenas && (
                <>
                  <View style={[styles.item]}>
                    <Text style={[styles.negrita]}>
                      {`NOTAS: `}
                      <Text
                        style={[styles.normal]}
                      >{`${reporte.prensa.notas}`}</Text>
                    </Text>
                  </View>
                  <View style={[styles.item]}>
                    <Text style={[styles.negrita]}>
                      {`RESEÑAS: `}
                      <Text
                        style={[styles.normal]}
                      >{`${reporte.prensa.resenas}`}</Text>
                    </Text>
                  </View>
                </>
              )}
              {reporte.redes?.map((info, i) => {
                let par = i % 2 === 0;
                if (info.cuenta && info.publicaciones) {
                  return (
                    <View key={`RED-${i}`}>
                      <View style={par ? [styles.itemGris] : [styles.item]}>
                        <Text style={[styles.negrita]}>
                          {`CUENTA: `}
                          <Text
                            style={[styles.normal]}
                          >{`${info.cuenta}`}</Text>
                        </Text>
                      </View>
                      <View style={par ? [styles.itemGris] : [styles.item]}>
                        <Text style={[styles.negrita]}>
                          {`PUBLICACIONES: `}
                          <Text
                            style={[styles.normal]}
                          >{`${info.publicaciones}`}</Text>
                        </Text>
                      </View>
                    </View>
                  );
                }
              })}
            </>
          ) : (
            <>
              <View style={[styles.item]}>
                <Text style={[styles.negrita]}>
                  {`FECHA DE REGISTRO: `}
                  <Text
                    style={[styles.italic]}
                  >{`${reporte.fechaRegistroConFormato}`}</Text>
                </Text>
              </View>
            </>
          )}
          <View style={[styles.ultimoItem]}>
            <Text style={[styles.negrita]}>
              {`IDENTIFICACION: `}
              <Text style={[styles.italic]}>{`${reporte._id}`}</Text>
            </Text>
          </View>
        </View>
        <View style={[styles.contFooter]}>
          <Text>
            Final de la Avenida Humbold, cruce con calle Araya, Cumana - Estado
            Sucre © FUNDACOMUNAL. Todos los derechos reservados.
          </Text>
          <Text>CONTACTO AL: cyefundasucre@gmail.com</Text>
        </View>
      </Page>
    </Document>
  );
  /* jshint ignore:end */
}

export default ReportePDF;
