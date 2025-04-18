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
      <BottomSheet2 ref={sheetRef} />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

export default Category;
