import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { IMAGES } from "../constants/Images";
import { FONTS, COLORS } from "../constants/theme";
import { useNavigation, useTheme } from "@react-navigation/native";
import { GlobalStyleSheet } from "../constants/StyleSheet";
import { ScrollView } from "react-native"; 
import { fetchSubcategories } from "../api/categoryApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducer";
 

const capitalizeFirstLetter = (string) => {
  return string
    .split(" ") // Divide el texto en palabras
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza la primera letra de cada palabra
    .join(" "); // Une las palabras de nuevo con espacios
};

const CategoryCart = ({ categoryId, categoryTitle }) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const navigation = useNavigation<any>();
  const [subcategories, setSubcategories] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado para el indicador de carga
  const clienteId = useSelector((state: RootState) => state.user.clienteId); // Especifica el tipo del estado
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId
  const dispatch = useDispatch();
  
  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        setIsLoading(true);
  
        // Verificar si las subcategorías están en AsyncStorage
        const cachedSubcategories = await AsyncStorage.getItem(
          `subcategories_${categoryId}`
        ); 
        if (cachedSubcategories) {
          // Si están en caché, cargarlas desde AsyncStorage
          setSubcategories(JSON.parse(cachedSubcategories));
        } else {
          // Si no están en caché, obtenerlas de la API
          const subcategories = await fetchSubcategories(categoryId);
  
          // Guardar en AsyncStorage para futuras solicitudes
          await AsyncStorage.setItem(
            `subcategories_${categoryId}`,
            JSON.stringify(subcategories)
          );
  
          setSubcategories(subcategories);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadSubcategories();
  }, [categoryId]);

  const displayedSubcategories = showAll
    ? subcategories
    : subcategories.slice(0, 7);

  return (
    <View>
      <View
        style={[
          GlobalStyleSheet.container,
          {
            paddingHorizontal: 0,
            backgroundColor: theme.dark ? "rgba(255,255,258,.1)" : colors.card,
            marginTop: 15,
          },
        ]}>
        {isLoading ? (
          // Mostrar el ActivityIndicator mientras se cargan los datos
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}>
            {displayedSubcategories.map((subcategory, index) => (
              <TouchableOpacity
                key={index}
                style={{ alignItems: "center" }}
                activeOpacity={0.5}
                onPress={() => {
                  console.log("co_subl:", subcategory.id, "co_cli:", clienteId); // Depuración
                  navigation.navigate("Products", {
                    subcategoryId: subcategory.id, // co_subl
                    subcategoryName: subcategory.name,
                    clienteId: clienteId, // co_cli
                  });
                }}
              >
                <View
                  style={[
                    {
                      height: 40,
                      width: "100%",
                      paddingHorizontal: 10,
                      backgroundColor: COLORS.primary,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                    },
                  ]}>
                  <Text
                    style={[
                      FONTS.fontRegular,
                      { fontSize: 13, color: COLORS.white },
                    ]}>
                    {capitalizeFirstLetter(subcategory.name)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            {subcategories.length > 7 && !showAll && (
              <TouchableOpacity
                style={{ alignItems: "center" }}
                activeOpacity={0.5}
                onPress={() => setShowAll(true)}>
                <View
                  style={[
                    {
                      height: 40,
                      width: "100%",
                      paddingHorizontal: 10,
                      backgroundColor: COLORS.blue,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}>
                  <Text
                    style={[
                      FONTS.fontRegular,
                      { fontSize: 13, color: COLORS.white },
                    ]}>
                    Mostrar más
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default CategoryCart;
