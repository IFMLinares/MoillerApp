import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS, FONTS } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { useTheme } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Input from "../../components/Input/Input";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setClienteId } from "../../redux/actions/drawerAction";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../../redux/store";
import {
  authLogin,
  refreshAccessToken, 
} from "../../api/authLogin"; // Importa las funciones necesarias

type SingInScreenProps = StackScreenProps<RootStackParamList, "SingIn">;

const SingIn = ({ navigation }: SingInScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [show, setshow] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true); // Estado de carga inicial

  // Verificar si el usuario ya está autenticado
const checkAuthentication = async () => {
  setLoading(true);
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.log("No se encontró el token de actualización. Redirigiendo a SingIn...");
      setLoading(false); // Detener la carga
      return; // Salir de la función
    }

    // Intentar refrescar el token si hay un refreshToken
    const accessToken = await refreshAccessToken();
    if (accessToken) {
      console.log("Token de acceso válido. Redirigiendo al Home...");
      navigation.reset({
        index: 0,
        routes: [{ name: "DrawerNavigation", params: { screen: "Home" } }],
      });
    }
  } catch (error) {
    console.error("Error al verificar autenticación:", error);
  } finally {
    setLoading(false); // Detener la carga
  }
};

  // Ejecutar la verificación al cargar la pantalla
  useEffect(() => {
    checkAuthentication();
  }, []);

  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();
  // Verificar si el usuario ya está autenticado
 


const handleLogin = async () => {
  setLoading(true);
  setErrorMessage('');
  try {
    const data = await authLogin(username, password);
    console.log('Respuesta de la API:', data);

    const { cliente_id, user_id } = data;

    if (!cliente_id) {
      console.warn('Advertencia: cliente_id no es válido:', cliente_id);
      setErrorMessage('Error: cliente_id no es válido.');
      return;
    }

    console.log('Guardando Cliente ID y User ID en Redux y AsyncStorage:', {
      cliente_id,
      user_id: user_id || 'No disponible',
    });

    // Guardar cliente_id en Redux
    dispatch(setClienteId(cliente_id));

    // Navegar al Home
    navigation.reset({
      index: 0,
      routes: [{ name: 'DrawerNavigation', params: { screen: 'Home' } }],
    });
  } catch (error: unknown) {
    setLoading(false);
    if (error instanceof Error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('Ocurrió un error inesperado.');
    }
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        colors={["#001A44", "#193561"]}
        style={{ height: undefined, width: "100%" }}>
        <View
          style={[
            GlobalStyleSheet.container,
            {
              paddingVertical: 20,
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            },
          ]}>
          <View
            style={[
              GlobalStyleSheet.row,
              { alignItems: "center", justifyContent: "space-between" },
            ]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                justifyContent: "center",
              }}>
              <Image
                source={require("../../assets/images/logo/logoblanco.png")}
                resizeMode="contain"
                style={{
                  width: "90%",
                }}
              />
            </View>
          </View>
          {/* usuario y contraseña*/}
          <View
            style={[
              GlobalStyleSheet.row,
              { alignItems: "center", justifyContent: "space-between" },
            ]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                justifyContent: "center",
              }}>
              <View style={[GlobalStyleSheet.container]}>
                <View
                  style={{
                    marginBottom: 10,
                    backgroundColor: "white",
                    borderRadius: 10,
                    width: "100%",
                  }}>
                  <Input
                    value={username}
                    autoCapitalize="none"
                    placeholder="Rif"
                    onChangeText={(value) => setUsername(value)}
                    style={{
                      fontFamily: "RalewayRegular",
                    }}
                  />
                </View>
                <View
                  style={{
                    marginBottom: 10,
                    backgroundColor: "white",
                    borderRadius: 10,
                    width: "100%",
                  }}>
                  <Input
                    value={password}
                    type={"password"}
                    autoCapitalize="none"
                    placeholder="Contraseña"
                    // autoCapitalize="none"
                    onChangeText={(value) => setPassword(value)}
                    style={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontFamily: "RalewayRegular",
                    }}
                  />
                </View>
                {errorMessage ? (
                  <Text style={{ color: "red", marginBottom: 10 }}>
                    {errorMessage}
                  </Text>
                ) : null}
                <View
                  style={{
                    marginBottom: 10,
                    marginLeft: 10,
                    borderRadius: 10,
                    width: "100%",
                  }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ForgetPassword")}>
                    <Text
                      style={[
                        FONTS.fontRegular,
                        {
                          fontSize: 16,
                          color: COLORS.card,
                          textDecorationLine: "none",
                          fontFamily: "RalewayBold",
                        },
                      ]}>
                      ¿Se le olvido su contraseña?
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          {/* usuario y contraseña */}
          {/* Boton de crear cuenta e iniciar sesion*/}
          <View>
            {/* iniciar sesion */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                justifyContent: "center",
              }}>
              <View
                style={[
                  GlobalStyleSheet.container,
                  {
                    width: "90%",
                  },
                ]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleLogin}
                  disabled={loading}>
                  <View
                    style={{
                      backgroundColor: "white",
                      paddingVertical: 10,
                      borderRadius: 40,
                      borderWidth: 4,
                      borderColor: "white",
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    {loading ? (
                      <ActivityIndicator size="small" color="#1A4881" />
                    ) : (
                      <Text
                        style={{
                          color: "#1A4881",
                          fontFamily: "RalewayExtraBold",
                          fontSize: 20,
                          textTransform: "uppercase",
                          lineHeight: 24,
                          textAlign: "center",
                        }}>
                        Iniciar sesión
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {/* iniciar sesion */}
          </View>
          {/* Boton de crear cuenta e iniciar sesion */}
          {/*iconos */}
          <View
            style={[
              GlobalStyleSheet.row,
              { alignItems: "center", justifyContent: "space-between" },
            ]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <View style={styles.iconRow}>
                <Text style={styles.contactUsText}>Contáctanos</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <View style={styles.iconRow}>
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() =>
                    Linking.openURL("https://www.instagram.com/mollier_3000/")
                  } // URL de Instagram
                >
                  <FontAwesome name="instagram" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() => Linking.openURL("mailto:ventas@mollierca.com")} // URL para enviar un correo
                >
                  <MaterialIcons name="email" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() =>
                    Linking.openURL(
                      "https://api.whatsapp.com/send/?phone=584243789402&text&type=phone_number&app_absent=0"
                    )
                  } // URL de WhatsApp
                >
                  <FontAwesome name="whatsapp" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconCircle}
                  onPress={() =>
                    Linking.openURL("https://maps.app.goo.gl/tM2K5Pj7MrgpryRBA")
                  } // URL de Mapas
                >
                  <Entypo name="location" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/*iconos  */}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SingIn;

const styles = StyleSheet.create({
  contactUsText: {
    color: "white",
    fontFamily: "RalewayExtraBold",
    fontSize: 20,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 10,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
