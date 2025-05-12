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

import { getClientDetail } from "../../api/ClientDetailApi"; // Importa la nueva API

import * as Animatable from "react-native-animatable"; // Importar Animatable
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";

const EditProfile = () => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const clienteId = useSelector((state: RootState) => state.user.clienteId); // Especifica el tipo del estado
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId
  const navigation = useNavigation<any>();

  const [isFocused, setisFocused] = useState(false);
  const [isFocused1, setisFocused1] = useState(false);
  const [isFocused2, setisFocused2] = useState(false);
  const [isFocused3, setisFocused3] = useState(false);

  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientDetail = async () => {
      try {
        setLoading(true); // Mostrar indicador de carga

        // Obtén el clienteId desde AsyncStorage
        const clienteId = await AsyncStorage.getItem("clienteId");
        if (!clienteId) {
          throw new Error("Cliente ID no encontrado.");
        }

        // Llama a la API para obtener los detalles del cliente
        const data = await getClientDetail(Number(clienteId));
        console.log("Detalles del cliente:", data);
        setUserInfo(data);
      } catch (error: any) {
        console.error("Error al obtener los detalles del cliente:", error.message);

        // Si la sesión ha expirado, redirige al inicio de sesión
        if (error.message === "Sesión expirada. Por favor, inicie sesión nuevamente.") {
          Alert.alert(
            "Sesión expirada",
            "Por favor, inicie sesión nuevamente.",
            [
              {
                text: "Iniciar sesión",
                onPress: () => navigation.navigate("SignIn"),
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert("Error", error.message);
        }
      } finally {
        setLoading(false); // Ocultar indicador de carga
      }
    };

    fetchClientDetail();
  }, []);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header title="Perfil de usuario" leftIcon="back" titleRight />
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
                  height: 120,
                  width: 120,
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
                    borderColor: COLORS.primary,
                    resizeMode: "contain",
                  }}
                  source={
                    userInfo?.image ? { uri: userInfo.image } : IMAGES.write1 // Imagen predeterminada
                  }
                />
              </View>
              {/* <TouchableOpacity
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
              </TouchableOpacity> */}
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
                Nombre: {userInfo.cli_des}
              </Animatable.Text>
            <Animatable.Text
                animation="fadeInLeft"
                delay={300}
                style={{ color: colors.title, marginBottom: 10 }}>
                Nombre de usuario: {userInfo.username}
              </Animatable.Text>
              <Animatable.Text
                animation="fadeInLeft"
                delay={300}
                style={{ color: colors.title, marginBottom: 10 }}>
                Nro° de teléfono: {userInfo.telefonos}
              </Animatable.Text>
              <Animatable.Text
                animation="fadeInLeft"
                delay={300}
                style={{ color: colors.title, marginBottom: 10 }}>
                Dirección: {userInfo.direc1}
              </Animatable.Text>
              <Animatable.Text
                animation="fadeInLeft"
                delay={300}
                style={{ color: colors.title, marginBottom: 10 }}>
                Ciudad: {userInfo.ciudad}
              </Animatable.Text>
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
                delay={600}
                style={{ color: colors.title, marginBottom: 10 }}>
                Activo: {userInfo.is_user ? "Sí" : "No"}
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
