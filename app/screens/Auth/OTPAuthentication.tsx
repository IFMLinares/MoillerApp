import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { useTheme } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
//import FeatherIcon from 'react-native-vector-icons/Feather';
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Input from "../../components/Input/Input";
import { IMAGES } from "../../constants/Images";
import Button from "../../components/Button/Button";
import OTPInput from "../../components/Input/OTPInput";
import { validateResetCodeApi } from "../../api/OtpCodeApi"; // Asegúrate de que esta función esté definida en tu API
import { sendResetCodeApi } from "../../api/ForgetPasswordApi";

type OTPAuthenticationScreenProps = StackScreenProps<
  RootStackParamList,
  "OTPAuthentication"
>;

const OTPAuthentication = ({
  navigation,
  route,
}: OTPAuthenticationScreenProps) => {
  const { email } = route.params; // Recibe el correo desde ForgetPassword
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [otpCode, setOTPCode] = useState("");
  const [isPinReady, setIsPinReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado para el bloqueo de pantalla
  const maximumCodeLength = 6;

  const handleContinue = async () => {
    if (!isPinReady) {
      Alert.alert("Error", "Por favor, ingresa el código completo.");
      return;
    }
  
    console.log("Navegando a NewPassword con:", { email, otpCode });
  
    navigation.navigate("NewPassword", { email, otpCode }); // Pasa email y otpCode
  };

  const handleResendCode = async () => {
    try {
      const response = await sendResetCodeApi(email);
      Alert.alert("Éxito", "El código de recuperación ha sido reenviado.");
    } catch (error: any) {
      console.error("Error al reenviar el código:", error);
      Alert.alert(
        "Error",
        error.message || "Hubo un problema al reenviar el código. Inténtalo nuevamente."
      );
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather size={24} color={COLORS.card} name={"arrow-left"} />
            </TouchableOpacity>
            <Text
              style={[FONTS.fontMedium, { fontSize: 20, color: COLORS.card }]}>
              Autenticación
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
              Verifique el código enviado a su correo electrónico
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 15,
              }}>
              <TouchableOpacity onPress={handleResendCode}>
                <Text style={{ color: COLORS.primary, textAlign: "right" }}>
                  ¡Volver a enviar el código?
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <View style={{ marginBottom: 20 }}>
                <OTPInput
                  code={otpCode}
                  setCode={setOTPCode}
                  maximumLength={maximumCodeLength}
                  setIsPinReady={setIsPinReady}
                />
              </View>
            </View> 
          </ScrollView>
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

export default OTPAuthentication;
