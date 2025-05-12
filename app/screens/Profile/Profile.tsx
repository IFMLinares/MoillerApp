import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  SectionList,
  Linking,
  StyleSheet,
} from "react-native";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import FeatherIcon from "react-native-vector-icons/Feather";
import { IMAGES } from "../../constants/Images";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
//import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../../redux/reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setClienteId } from "../../redux/actions/drawerAction";
import { cerrarSesion } from "../../api/cerrarSesionApi"; // Importar la función cerrarSesion
import { getClientDetail } from "../../api/ClientDetailApi"; // Importa la nueva API

const getListwithiconData = (navigation: any, setShowModal: any) => [
  {
    title: "Configuracion de la cuenta",
    data: [
      {
        icon: IMAGES.user3,
        title: "Perfil de usuario",
        navigate: "EditProfile",
      },
      {
        icon: IMAGES.chat,
        title: "Preguntas y respuestas",
        navigate: "Questions",
      },
      {
        icon: IMAGES.logout,
        title: "Cerrar sesión",
        action: () => {
          setShowModal(true); // Muestra el modal al presionar "Cerrar sesión"
        },
      },
    ],
  },
  {
    title: "Soporte",
    data: [
      {
        icon: IMAGES.gmail,
        title: "ventas@mollierca.com",
        action: () => {
          Linking.openURL("mailto:ventas@mollierca.com"); // Abre la app de correo
        },
      },
      {
        icon: IMAGES.call,
        title: "+58 424-3789402",
        action: () => {
          Linking.openURL("tel:+584243789402"); // Realiza una llamada
        },
      },
      {
        icon: IMAGES.whatsapp,
        title: "WhatsApp",
        link: "https://api.whatsapp.com/send/?phone=584243789402&text&type=phone_number&app_absent=0", // URL para abrir WhatsApp
      },
      {
        icon: IMAGES.instagram,
        title: "Instagram",
        link: "https://www.instagram.com/mollier_3000/", // URL para abrir Instagram
      },
      {
        icon: IMAGES.ubicacion,
        title: "Ubicación",
        link: "https://maps.app.goo.gl/tM2K5Pj7MrgpryRBA", // URL para abrir mapas con una ubicación
      },
    ],
  },
];

type ProfileScreenProps = StackScreenProps<RootStackParamList, "Profile">;

const Profile = ({ navigation }: ProfileScreenProps) => {
  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null); // Estado para almacenar la información del usuario
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch(); // Usa la versión tipada de dispatch
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const clienteId = useSelector((state: RootState) => state.user.clienteId); // Especifica el tipo del estado
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId

  useEffect(() => {
    const fetchClientDetail = async () => {
      try {
        setLoading(true);

        const clienteId = await AsyncStorage.getItem("clienteId");
        console.log("Cliente ID obtenido de AsyncStorage:", clienteId);

        if (!clienteId) {
          throw new Error("Cliente ID no encontrado.");
        }

        const data = await getClientDetail(Number(clienteId)); // Asegúrate de convertir a número
        console.log("Detalles del cliente obtenidos de la API:", data);
        setUserInfo(data);
      } catch (error: any) {
        console.error(
          "Error al obtener los detalles del cliente:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetail();
  }, []);

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    getUsername();
  }, []);

  // redux
  useEffect(() => {
    const restoreClienteId = async () => {
      try {
        const storedClienteId = await AsyncStorage.getItem("clienteId");
        if (storedClienteId) {
          console.log(
            "Cliente ID restaurado desde AsyncStorage:",
            storedClienteId
          );
          dispatch(setClienteId(parseInt(storedClienteId, 10))); // Restaura el clienteId en Redux
        }
      } catch (error) {
        console.error("Error al restaurar el clienteId:", error);
      }
    };

    restoreClienteId();
  }, []); // Asegúrate de que no dependa de estados que cambian durante el cierre de sesión

  const cerrarSesionApi = async () => {
    try {
      console.log("Cerrando sesión...");

      // Llamar a la API de cierre de sesión
      await cerrarSesion(); // Renombrar para evitar conflicto con la función local
      console.log("API de cierre de sesión llamada exitosamente.");

      // Limpiar AsyncStorage
      await AsyncStorage.clear();
      console.log("AsyncStorage limpiado.");

      // Limpiar el estado de Redux
      dispatch(setClienteId(null));
      console.log("Estado de Redux actualizado.");

      // Cerrar el modal antes de navegar
      setShowModal(false);

      // Navegar a la pantalla de inicio de sesión
      navigation.reset({
        index: 0,
        routes: [{ name: "SingIn" }],
      });
      console.log("Navegación a SingIn realizada.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  // Pasa `setShowModal` como argumento a `getListwithiconData`
  const listWithIconData = getListwithiconData(navigation, setShowModal);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <View style={{ height: 70, backgroundColor: COLORS.primary }}>
        <View style={[GlobalStyleSheet.container, { paddingHorizontal: 20 }]}>
          <View
            style={[
              GlobalStyleSheet.row,
              { alignItems: "center", justifyContent: "space-between" },
            ]}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Image
                style={{ resizeMode: "contain", width: 150, height: 50 }} // Ajusta el tamaño aquí
                source={IMAGES.appname}
              />
            </View>
          </View>
        </View>
      </View>
      <View
        style={[
          GlobalStyleSheet.container,
          {
            paddingTop: 20,
            backgroundColor: theme.dark ? "rgba(255,255,255,.1)" : colors.card,
          },
        ]}>
        {loading ? (
          <Text style={{ color: colors.title, textAlign: "center" }}>
            Cargando información del usuario...
          </Text>
        ) : (
          userInfo && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingBottom: 20,
              }}>
              <Image
                style={{
                  height: 90,
                  width: 90,
                  borderRadius: 50,
                  resizeMode: "contain",
                }}
                source={
                  userInfo.image
                    ? { uri: userInfo.image } // Usa la imagen de la API
                    : IMAGES.write1 // Imagen predeterminada
                }
              />
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 20,
                  color: colors.title,
                }}>
                {userInfo.first_name} {userInfo.last_name}{" "}
                {/* Muestra el nombre y apellido */}
              </Text>
            </View>
          )
        )}
        <View style={GlobalStyleSheet.row}>
          {/* Botón para Tus pedidos */}
          <View
            style={[
              GlobalStyleSheet.col50,
              { marginBottom: 10, paddingHorizontal: 5 },
            ]}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Myorder")} // Navega a la pantalla "Myorder"
              style={{
                height: 46,
                width: "100%",
                backgroundColor: COLORS.primary,
                borderWidth: 1,
                borderColor: COLORS.primaryLight,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text
                style={[
                  FONTS.fontMedium,
                  { fontSize: 16, color: colors.card },
                ]}>
                Tus pedidos
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={[GlobalStyleSheet.container, { flex: 1, paddingTop: 0 }]}>
        <View style={{ marginHorizontal: -15, marginTop: 0, flex: 1 }}>
          <SectionList
            sections={listWithIconData} // Usa el resultado de la función
            keyExtractor={(item: any, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (item.action) {
                    item.action(); // Ejecuta la acción personalizada si existe
                  } else if (item.navigate) {
                    navigation.navigate(item.navigate); // Navega si tiene una ruta definida
                  } else if (item.link) {
                    Linking.openURL(item.link); // Abre el enlace si existe
                  }
                }}
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 15,
                  height: 55,
                  alignItems: "center",
                  paddingVertical: 15,
                  backgroundColor: theme.dark
                    ? "rgba(255,255,255,.1)"
                    : colors.card,
                }}>
                <View
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 6,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}>
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      tintColor: COLORS.primary,
                      resizeMode: "contain",
                    }}
                    source={item.icon}
                  />
                </View>
                <Text
                  style={{
                    ...FONTS.fontRegular,
                    fontSize: 16,
                    color: colors.title,
                    flex: 1,
                  }}>
                  {item.title}
                </Text>
                <FeatherIcon
                  size={22}
                  color={colors.title}
                  name={"chevron-right"}
                />
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text
                style={{
                  ...FONTS.fontMedium,
                  fontSize: 20,
                  color: colors.title,
                  paddingLeft: 20,
                  paddingVertical: 10,
                  backgroundColor: theme.dark
                    ? "rgba(255,255,255,.1)"
                    : COLORS.white,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.primaryLight,
                  marginTop: 10,
                }}>
                {title}
              </Text>
            )}
          />
        </View>
      </View>
      {/* Modal de confirmación */}
      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              ¿Seguro que desea Cerrar Sesión?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  { backgroundColor: COLORS.primary },
                ]}
                onPress={async () => {
                  setShowModal(false); // Cierra el modal
                  await cerrarSesionApi(); // Llama a la función cerrarSesion
                }}>
                <Text style={styles.modalButtonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: COLORS.red }]}
                onPress={() => setShowModal(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
