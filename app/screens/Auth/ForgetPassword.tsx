import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { COLORS, FONTS } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList"; 
import { sendResetCodeApi } from "../../api/ForgetPasswordApi";


type ForgetPasswordScreenProps = StackScreenProps<
  RootStackParamList,
  "ForgetPassword"
>;

const ForgetPassword = ({ navigation }: ForgetPasswordScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
 
  const [email, setEmail] = useState(""); // Estado para el correo electrónico
  const [isEmailValid, setIsEmailValid] = useState(false); // Estado para la validación del correo
  const [isLoading, setIsLoading] = useState(false); // Estado para el bloqueo de pantalla

  // Función para validar el correo electrónico
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsEmailValid(validateEmail(text));
  };

  const handleContinue = async () => {
    if (!isEmailValid) {
      Alert.alert("Error", "Por favor, ingresa un correo electrónico válido.");
      return;
    }
  
    // Mostrar el indicador de carga
    setIsLoading(true);
  
    try {
      // Llamar a la API para enviar el código de recuperación
      const response = await sendResetCodeApi(email);
      console.log("Respuesta de la API:", response);
  
      // Si la solicitud es exitosa, redirigir a la pantalla OTPAuthentication
      Alert.alert("Éxito", "El código de recuperación ha sido enviado.");
      navigation.navigate("OTPAuthentication", { email }); // Pasa el correo como parámetro
    } catch (error: any) {
      console.error("Error al enviar el código de recuperación:", error);
  
      // Mostrar el mensaje de error devuelto por la API
      Alert.alert(
        "Error",
        error.error || "Hubo un problema al enviar el código. Inténtalo nuevamente."
      );
    } finally {
      // Ocultar el indicador de carga
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <View style={[GlobalStyleSheet.container, { paddingVertical: 20 }]}>
        <View
          style={[
            GlobalStyleSheet.row,
            { alignItems: "center", justifyContent: "space-between" },
          ]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()} 
            >
              <Feather size={24} color={COLORS.card} name={"arrow-left"} />
            </TouchableOpacity>
            <Text
              style={[FONTS.fontMedium, { fontSize: 20, color: COLORS.card }]}>
              ¿Olvido su contraseña?
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: theme.dark ? colors.background : colors.card,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}>
        <View
          style={[GlobalStyleSheet.container, { flexGrow: 1, marginTop: 15 }]}>
          <ScrollView>
            <Text
              style={[FONTS.fontMedium, { fontSize: 18, color: colors.title }]}>
              Recupera tu cuenta
            </Text>
            <Text
              style={[FONTS.fontRegular, { fontSize: 14, color: colors.text }]}>
              Ingresa tu correo electrónico 
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",  
                marginTop: 10,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: COLORS.primary,
                borderRadius: 8,
                paddingHorizontal: 15,
                backgroundColor: theme.dark ? colors.background : COLORS.white,
              }}
            >
              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor={COLORS.primary}
                value={email}
                onChangeText={handleEmailChange}
                style={{
                  flex: 1,
                  height: 50,
                  fontSize: 16,
                  color: colors.text,
                }}
              />
              {isEmailValid ? (
                <Feather name="check-circle" size={20} color={COLORS.success} />
              ) : (
                <Feather name="x-circle" size={20} color={COLORS.danger} />
              )}
            </View>

            <Text
              style={[FONTS.fontRegular, { fontSize: 14, color: colors.text }]}>
              Podremos enviarte una notificacion por correo electrónico con
              fines de seguridad e inicio de sesión.
            </Text>
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 15,
              gap: 5,
            }}>
            <Text
              style={[
                FONTS.fontRegular,
                { fontSize: 15, color: colors.title },
              ]}>
              ¿Iniciar sesión?
            </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("SingIn")}>
              <Text
                style={[
                  FONTS.fontRegular,
                  {
                    fontSize: 16,
                    color: COLORS.primary,
                    textDecorationLine: "underline",
                    textDecorationColor: COLORS.primary,
                  },
                ]}>
                Ingresa
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                paddingVertical: 15,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
              onPress={handleContinue}>
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 16,
                  fontWeight: "bold",
                }}>
                CONTINUAR
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bloqueo de pantalla con indicador de carga */}
          {isLoading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <ActivityIndicator size="large" color={COLORS.white} />
              <Text style={{ color: COLORS.white, marginTop: 10 }}>
                Espere por favor...
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgetPassword;
