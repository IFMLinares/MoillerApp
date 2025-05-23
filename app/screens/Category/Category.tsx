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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import { RefreshControl } from "react-native";

type CategoryScreenProps = StackScreenProps<RootStackParamList, "Category">;

interface Category {
  id: string;
  name: string;
  imageUrl?: string | null;
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const Category = ({ navigation, route }: CategoryScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [show, setShow] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // Estado para el indicador de carga
  const sheetRef = useRef<any>(null);
  const clienteId = useSelector((state: RootState) => state.user.clienteId); // Especifica el tipo del estado
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false); // Estado para manejar la recarga

  const loadCategories = async () => {
    try {
      setIsLoading(true); // Mostrar el indicador de carga

      // Obtener las categorías desde la API
      const categoriesFromServer = await fetchCategories();

      // Obtener las categorías almacenadas en AsyncStorage
      const cachedCategories = await AsyncStorage.getItem("categories");

      if (cachedCategories) {
        const parsedCachedCategories = JSON.parse(cachedCategories);

        // Comparar los datos del servidor con los datos en caché
        if (
          JSON.stringify(parsedCachedCategories) !==
          JSON.stringify(categoriesFromServer)
        ) {
          // Si los datos son diferentes, actualizar el caché
          await AsyncStorage.setItem(
            "categories",
            JSON.stringify(categoriesFromServer)
          );
          setCategories(categoriesFromServer);
        } else {
          // Si los datos son iguales, usar los datos en caché
          setCategories(parsedCachedCategories);
        }
      } else {
        // Si no hay datos en caché, usar los datos del servidor
        await AsyncStorage.setItem(
          "categories",
          JSON.stringify(categoriesFromServer)
        );
        setCategories(categoriesFromServer);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false); // Ocultar el indicador de carga
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true); // Mostrar el indicador de recarga
    try {
      // Obtener las categorías directamente desde la API
      const categoriesFromServer = await fetchCategories();
      console.log("Categorías recargadas desde la API:", categoriesFromServer);

      // Actualizar las categorías en el estado
      setCategories(categoriesFromServer);

      // Actualizar el caché en AsyncStorage
      await AsyncStorage.setItem(
        "categories",
        JSON.stringify(categoriesFromServer)
      );
    } catch (error) {
      console.error("Error al recargar las categorías:", error);
    } finally {
      setRefreshing(false); // Ocultar el indicador de recarga
    }
  };

  const renderCategory = ({ item }: { item: Category }) => {
    // Busca la imagen correspondiente en el objeto IMAGES
    const imageName = item.name.toLowerCase(); // Convierte el nombre a minúsculas y elimina espacios

    return (
      <TouchableOpacity
        style={{ alignItems: "center", margin: 10 }}
        onPress={() => {
          console.log("Categoría seleccionada (co_lin):", item.id); // Log del co_lin
          setSelectedCategory(item.id); // Actualiza la categoría seleccionada
        }}>
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
            source={
              item.imageUrl ? { uri: item.imageUrl } : IMAGES.defaultImage
            }
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } // Agrega la funcionalidad de recarga
          />
        )}
      </View>
      {selectedCategory && (
        <CategoryCart
          categoryId={selectedCategory}
          categoryTitle={
            categories.find((cat) => cat.id === selectedCategory)?.name ||
            "Sin título"
          }
        />
      )}
      <BottomSheet2
        ref={sheetRef}
        onSortChange={(criteria: string) => {
          console.log("Criterio de ordenación seleccionado:", criteria);
          // Aquí puedes manejar el cambio de orden, por ejemplo, actualizar el estado o realizar una acción
        }}
      />
      <Toast />
    </View>
  );
};

export default Category;
