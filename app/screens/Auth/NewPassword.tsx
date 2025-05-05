import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { COLORS, FONTS } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { useTheme } from "@react-navigation/native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { validateResetCodeApi } from "../../api/OtpCodeApi"; // Importa la API

type NewPasswordScreenProps = StackScreenProps<
  RootStackParamList,
  "NewPassword"
>;

const NewPassword = ({ navigation, route }: NewPasswordScreenProps) => {
  const { email, otpCode } = route.params; // Recibe email y otpCode
  console.log("Email recibido:", email);
  console.log("Código OTP recibido:", otpCode);

  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para el modal de validación
  const [isLoading, setIsLoading] = useState(false); // Estado para el bloqueo de pantalla

  // Validaciones de la contraseña
  const requirements = [
    {
      text: "Las contraseñas deben coincidir.",
      isValid: password === confirmPassword && password.length > 0,
    },
    {
      text: "Las contraseñas no deben contener espacios en blanco.",
      isValid: !/\s/.test(password),
    },
    {
      text: "La contraseña debe contener un carácter especial.",
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    {
      text: "La contraseña debe tener al menos 6 caracteres.",
      isValid: password.length >= 6,
    },
    {
      text: "Debe tener al menos una letra mayúscula.",
      isValid: /[A-Z]/.test(password),
    },
    {
      text: "Debe tener al menos un número.",
      isValid: /[0-9]/.test(password),
    },
  ];

  const handleContinue = async () => {
    if (!requirements.every((req) => req.isValid)) {
      Alert.alert("Error", "Por favor, cumple con todos los requisitos.");
      return;
    }
  
    console.log("Datos antes de enviar a la API:", { email, otpCode, password });
  
    setIsLoading(true);
  
    try {
      const response = await validateResetCodeApi(email, otpCode, password);
      console.log("Respuesta de la API:", response);
  
      Alert.alert("Éxito", "Contraseña creada exitosamente.");
      navigation.navigate("SingIn"); // Redirigir al inicio de sesión
    } catch (error: any) {
      console.error("Error al crear la nueva contraseña:", error);
      Alert.alert(
        "Error",
        error.error || "Hubo un problema al crear la contraseña. Inténtalo nuevamente."
      );
    } finally {
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
              //style={[styles.actionBtn,{}]}
            >
              <Feather size={24} color={COLORS.card} name={"arrow-left"} />
            </TouchableOpacity>
            <Text
              style={[FONTS.fontMedium, { fontSize: 20, color: COLORS.card }]}>
              Nueva contraseña
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
              Ingresa su nueva contraseña.
            </Text>

            {/* Input para la nueva contraseña */}
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: COLORS.primary,
                borderRadius: 8,
                backgroundColor: theme.dark ? colors.background : COLORS.white,
              }}>
              <TextInput
                placeholder="Ingrese su nueva contraseña"
                placeholderTextColor={COLORS.primary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={{
                  flex: 1,
                  height: 50,
                  paddingHorizontal: 15,
                  fontSize: 16,
                  color: colors.text,
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ paddingHorizontal: 10 }}>
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Input para confirmar la contraseña */}
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: COLORS.primary,
                borderRadius: 8,
                backgroundColor: theme.dark ? colors.background : COLORS.white,
              }}>
              <TextInput
                placeholder="Confirmar nueva contraseña"
                placeholderTextColor={COLORS.primary}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={{
                  flex: 1,
                  height: 50,
                  paddingHorizontal: 15,
                  fontSize: 16,
                  color: colors.text,
                }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ paddingHorizontal: 10 }}>
                <Feather
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Validaciones de la contraseña */}
            <View style={{ marginTop: 20, width: "100%" }}>
              <Text
                style={[
                  FONTS.fontMedium,
                  {
                    fontSize: 15,
                    color: colors.title,
                    flex: 1,
                    flexWrap: "wrap",
                    marginBottom: 10,
                  },
                ]}>
                La contraseña debe cumplir los siguientes requisitos:
              </Text>
              {requirements.map((req, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 10,
                  }}>
                  <Feather
                    name={req.isValid ? "check-circle" : "x-circle"}
                    size={20}
                    color={req.isValid ? COLORS.success : COLORS.danger}
                    style={{ marginRight: 10, marginTop: 3 }}
                  />
                  <Text
                    style={[
                      FONTS.fontMedium,
                      {
                        fontSize: 15,
                        color: req.isValid ? COLORS.success : COLORS.danger, // Cambia el color del texto
                        flex: 1,
                        flexWrap: "wrap",
                      },
                    ]}>
                    {req.text}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Botón para continuar */}
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

          {/* Modal de validación */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsModalVisible(false)}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
              activeOpacity={1}
              onPressOut={() => setIsModalVisible(false)}>
              <View
                style={{
                  width: "80%",
                  backgroundColor: COLORS.white,
                  borderRadius: 10,
                  padding: 20,
                  alignItems: "center",
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.danger,
                    marginBottom: 15,
                    textAlign: "center",
                  }}>
                  Por favor, cumple con todos los requerimientos.
                </Text>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  style={{
                    backgroundColor: COLORS.primary,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 5,
                  }}>
                  <Text style={{ color: COLORS.white, fontSize: 16 }}>
                    Cerrar
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

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

export default NewPassword;
