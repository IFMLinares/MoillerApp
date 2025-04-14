import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  SectionList,
  Linking,
} from "react-native";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import FeatherIcon from "react-native-vector-icons/Feather";
import { IMAGES } from "../../constants/Images";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
//import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useDispatch } from "react-redux";
import { openDrawer } from "../../redux/actions/drawerAction";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ListwithiconData = [
  {
    title: "Configuracion de la cuenta",
    data: [
      {
        icon: IMAGES.user3,
        title: "Editar Perfil",
        navigate: "EditProfile",
      },
      {
        icon: IMAGES.chat,
        title: "Preguntas y respuestas",
        navigate: "Questions",
      },
      {
        icon: IMAGES.delete,
        title: "Eliminar cuenta",
        navigate: "Questions",
      },
      {
        icon: IMAGES.logout,
        title: "Cerrar sesión",
        navigate: "Login", // Cambia la navegación a la pantalla de Login
        action: async () => {
          await AsyncStorage.clear(); // Limpia los datos de sesión
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }], // Reinicia la navegación a la pantalla de Login
          });
        },
      },
    ],
  },
];
const soporteData = [
  {
    title: "Soporte",
    data: [
      {
        icon: IMAGES.gmail,
        title: "ventas@mollierca.com",
      },
      {
        icon: IMAGES.call,
        title: "+58 424-3789402",
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

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    getUsername();
  }, []);

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  //const navigation = useNavigation();

  const dispatch = useDispatch();

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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingBottom: 20,
          }}>
          <Image
            style={{ height: 40, width: 40, borderRadius: 50 }}
            source={IMAGES.write1}
          />
          <Text
            style={{ ...FONTS.fontRegular, fontSize: 20, color: colors.title }}>
            {username}
          </Text>
        </View>
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
            sections={ListwithiconData}
            keyExtractor={(item: any, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (item.action) {
                    item.action(); // Ejecuta la acción personalizada si existe
                  } else if (item.navigate) {
                    navigation.navigate(item.navigate); // Navega si tiene una ruta definida
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
      <View style={[GlobalStyleSheet.container, { flex: 1, paddingTop: 0 }]}>
        <View style={{ marginHorizontal: -15, marginTop: 0, flex: 1 }}>
          <SectionList
            sections={soporteData}
            keyExtractor={(item: any, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (item.link) {
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
    </View>
  );
};

export default Profile;
