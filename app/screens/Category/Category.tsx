import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import CategoryCart from "../../components/CategoryCart";
import { COLORS, FONTS } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { fetchCategories } from "../../api/categoryApi";
import { IMAGES } from "../../constants/Images";
import BottomSheet2 from "../Components/BottomSheet2";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CategoryScreenProps = StackScreenProps<RootStackParamList, "Category">;

const marcas = [
  {
    image: IMAGES.marca,
    subcolor: "STEINMANN", // Identificador único para la marca
    name: "STEINMANN", // Nombre de la marca
  },
  {
    image: IMAGES.marca1,
    subcolor: "MASLEX",
    name: "MASLEX",
  },
  {
    image: IMAGES.marca2,
    subcolor: "SECOP",
    name: "SECOP",
  },
  {
    image: IMAGES.marca3,
    subcolor: "AMERICOLD",
    name: "AMERICOLD",
  },
];
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const Category = ({ navigation, route }: CategoryScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [show, setShow] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Estado para el indicador de carga
  const sheetRef = useRef<any>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true); // Mostrar el indicador de carga

        // Verificar si las categorías están en AsyncStorage
        const cachedCategories = await AsyncStorage.getItem("categories");

        if (cachedCategories) {
          // Si están en caché, cargarlas desde AsyncStorage
          setCategories(JSON.parse(cachedCategories));
        } else {
          // Si no están en caché, obtenerlas de la API
          const categories = await fetchCategories();

          // Guardar en AsyncStorage para futuras solicitudes
          await AsyncStorage.setItem("categories", JSON.stringify(categories));

          setCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false); // Ocultar el indicador de carga
      }
    };

    loadCategories();
  }, []);

  const renderCategory = ({ item }) => {
    // Busca la imagen correspondiente en el objeto IMAGES
    const imageName = item.name.toLowerCase() ; // Convierte el nombre a minúsculas y elimina espacios
    const categoryImage = IMAGES[imageName] || IMAGES.default; // Usa una imagen por defecto si no se encuentra

    return (
      <TouchableOpacity
        style={{ alignItems: "center", margin: 10 }}
        onPress={() => setSelectedCategory(item.id)}>
        <View
          style={{
            height: 70,
            width: 70,
            borderRadius: 50,
            backgroundColor: COLORS.primaryLight,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Image
            source={categoryImage}
            style={{ height: 70, width: 70, borderRadius: 25 }}
          />
        </View>
        <Text
          style={[
            FONTS.fontRegular,
            {
              fontSize: 13,
              color: colors.title,
              marginTop: 5,
              width: "100%",
              textAlign: "center",
            },
          ]}
          numberOfLines={2}>
          {capitalizeFirstLetter(item.name)}
        </Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title="Categorías"
        leftIcon="back"
        titleLeft
        rightIcon4="filter"
      /> 
        <View style={{ padding: 10 }}>
        {isLoading ? (
            // Mostrar el ActivityIndicator mientras se cargan los datos
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={{ alignItems: "center" }}
          />
        )}
        </View>
        {selectedCategory && <CategoryCart categoryId={selectedCategory} />}
        <View
          style={[
            GlobalStyleSheet.container,
            {
              paddingHorizontal: 0,
              backgroundColor: theme.dark
                ? "rgba(255,255,258,.1)"
                : colors.card,
              marginTop: 0,
            },
          ]}>
          <View
            style={{
              paddingHorizontal: 15,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.primaryLight,
              paddingBottom: 15,
            }}>
            <Text
              style={[FONTS.fontMedium, { fontSize: 14, color: colors.title }]}>
              Marca
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 20,
              paddingTop: 20,
              alignItems: "center",
              justifyContent: "center",
              gap: 15,
            }}>
            {marcas.map((data: any, index) => {
              return (
                <View
                  key={index}
                  style={[
                    {
                      height: 70,
                      width: 70,
                      borderRadius: 50,
                      borderWidth: 1,
                      borderColor: COLORS.primaryLight,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ProductsMarcas", {
                        subcolor: data.subcolor.trim(), // Pasa el identificador de la marca
                        subcategoryName: data.name, // Pasa el nombre de la marca
                      })
                    }>
                    <Image
                      style={[
                        {
                          height: 65,
                          width: 65,
                          resizeMode: "contain",
                          borderRadius: 40,
                          backgroundColor: COLORS.primary,
                        },
                      ]}
                      source={data.image}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View> 
      <BottomSheet2 ref={sheetRef} />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

export default Category;
