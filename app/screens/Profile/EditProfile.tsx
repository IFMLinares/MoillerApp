import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Alert  } from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import Input from "../../components/Input/Input";
//import { Feather } from '@expo/vector-icons';
import Button from "../../components/Button/Button";
import { COLORS, FONTS } from "../../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserInfo } from "../../api/editPerfilApi";
import * as Animatable from "react-native-animatable"; // Importar Animatable
const EditProfile = () => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const navigation = useNavigation<any>();

  const [isFocused, setisFocused] = useState(false);
  const [isFocused1, setisFocused1] = useState(false);
  const [isFocused2, setisFocused2] = useState(false);
  const [isFocused3, setisFocused3] = useState(false);

  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        console.log("Información del usuario:", data); // Verificar los datos
        setUserInfo(data);
      } catch (error: any) {
        console.error(error.message);
  
        // Redirigir al inicio de sesión si la sesión ha expirado
        if (error.message === 'Sesión expirada. Por favor, inicie sesión nuevamente.') {
          navigation.navigate("SingIn");
        } else {
          Alert.alert(
            "Error",
            error.message,
            [
              {
                text: "Iniciar sesión",
                onPress: () => navigation.navigate("SingIn"),
              },
            ],
            { cancelable: false }
          );
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserInfo();
  }, []);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header title="Editar Perfil" leftIcon="back" titleRight />
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        {userInfo ? (
          <Animatable.View
            animation="fadeInUp" // Animación de entrada
            duration={800}
            style={[
              GlobalStyleSheet.container,
              {
                backgroundColor: theme.dark
                  ? "rgba(255,255,255,.1)"
                  : colors.card,
                borderRadius: 10,
                padding: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 5,
              },
            ]}>
            {/* Imagen del usuario */}
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: COLORS.primary,
                  height: 90,
                  width: 90,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Animatable.Image
                  animation="bounceIn" // Animación para la imagen
                  duration={1000}
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: COLORS.primary,
                  }}
                  source={
                    userInfo?.image ? { uri: userInfo.image } : IMAGES.write1 // Imagen predeterminada
                  }
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  height: 42,
                  width: 42,
                  borderRadius: 40,
                  //   backgroundColor: colors.background,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  bottom: -10,
                  right: 130,
                }}>
                <View
                  style={{
                    height: 36,
                    width: 36,
                    borderRadius: 36,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: COLORS.primary,
                  }}>
                  <Animatable.Image
                    animation="bounceIn" // Animación para la imagen
                    duration={1000}
                    style={{
                      height: 16,
                      width: 16,
                      resizeMode: "contain",
                      tintColor: COLORS.card,
                    }}
                    source={IMAGES.write}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Información del usuario */}
            <Animatable.View animation="fadeIn" delay={200}>
              <Text
                style={[
                  FONTS.fontMedium,
                  { fontSize: 24, color: colors.title, textAlign: "center" },
                ]}>
                {userInfo?.first_name} {userInfo?.last_name}
              </Text>
              <Text
                style={[
                  FONTS.fontMedium,
                  { fontSize: 14, color: COLORS.primary, textAlign: "center" },
                ]}>
                Última visita:{" "}
                {userInfo?.last_login
                  ? new Date(userInfo.last_login).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "No disponible"}
              </Text>
            </Animatable.View>

            {/* Detalles adicionales */}
            <View style={{ marginTop: 20 }}>
              <Animatable.Text
                animation="fadeInLeft"
                delay={300}
                style={{ color: colors.title, marginBottom: 10 }}>
                Correo Electrónico: {userInfo.email}
              </Animatable.Text>
              <Animatable.Text
                animation="fadeInLeft"
                delay={400}
                style={{ color: colors.title, marginBottom: 10 }}>
                Fecha de Registro:{" "}
                {new Date(userInfo.date_joined).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </Animatable.Text>
              <Animatable.Text
                animation="fadeInLeft"
                delay={500}
                style={{ color: colors.title, marginBottom: 10 }}>
                Rol: {userInfo.role}
              </Animatable.Text>
              <Animatable.Text
                animation="fadeInLeft"
                delay={600}
                style={{ color: colors.title, marginBottom: 10 }}>
                Activo: {userInfo.is_active ? "Sí" : "No"}
              </Animatable.Text>
              <Animatable.Text
                animation="fadeInLeft"
                delay={700}
                style={{ color: colors.title, marginBottom: 10 }}>
                Administrador: {userInfo.is_superuser ? "Sí" : "No"}
              </Animatable.Text>
            </View>
          </Animatable.View>
        ) : (
          <Animatable.Text
            animation="fadeIn"
            style={{ color: colors.title, textAlign: "center", marginTop: 50 }}>
            Cargando información del usuario...
          </Animatable.Text>
        )}
      </ScrollView>
      {/* <View
        style={[
          GlobalStyleSheet.container,
          { paddingHorizontal: 0, paddingBottom: 0 },
        ]}>
        <View
          style={{
            height: 88,
            width: "100%",
            backgroundColor: theme.dark ? "rgba(255,255,255,.1)" : colors.card,
            justifyContent: "center",
            paddingHorizontal: 15,
          }}>
          <Button
            title="Actualizar perfil"
            color={COLORS.secondary}
            text={COLORS.title}
            onPress={() => navigation.navigate("Profile")}
          />
        </View>
      </View> */}
    </View>
  );
};

export default EditProfile;
