import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS, FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import Button from "../Button/Button";
import { useNavigation, useTheme } from "@react-navigation/native";
import ButtonOutline from "../Button/ButtonOutline";
import { fetchCategories, fetchSubcategories } from "../../api/categoryApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
type Props = {
  sheetRef?: any;
};

const FilterSheet2 = ({ sheetRef }: Props) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const clienteId = useSelector((state: RootState) => state.user.clienteId); // Especifica el tipo del estado
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId
  const navigation = useNavigation();

  // const brandData = ["Adidas", "Reebok", "Zara", "Gucci", "Vogue"];

  // const [activeSize, setActiveSize] = useState(brandData[0]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);

  // Estados para mostrar/ocultar categorías y subcategorías
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);
  const [showCategories, setShowCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);

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
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadSubcategories = async () => {
      if (selectedCategory) {
        try {
          setIsLoadingSubcategories(true);

          // Verificar si las subcategorías están en AsyncStorage
          const cachedSubcategories = await AsyncStorage.getItem(
            `subcategories_${selectedCategory}`
          );

          if (cachedSubcategories) {
            setSubcategories(JSON.parse(cachedSubcategories));
          } else {
            const fetchedSubcategories = await fetchSubcategories(
              selectedCategory
            );

            // Guardar en AsyncStorage
            await AsyncStorage.setItem(
              `subcategories_${selectedCategory}`,
              JSON.stringify(fetchedSubcategories)
            );

            setSubcategories(fetchedSubcategories);
          }
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        } finally {
          setIsLoadingSubcategories(false);
        }
      }
    };

    loadSubcategories();
  }, [selectedCategory]);

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 5);
  const displayedSubcategories = showAllSubcategories
    ? subcategories
    : subcategories.slice(0, 5);

  const capitalizeFirstLetter = (string) => {
    return string
      .split(" ") // Divide el texto en palabras
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza la primera letra de cada palabra
      .join(" "); // Une las palabras de nuevo con espacios
  };

  return (
    <View
      style={[
        GlobalStyleSheet.container,
        {
          paddingTop: 0,
          backgroundColor: theme.dark ? colors.background : colors.card,
          height: "100%",
        },
      ]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          paddingBottom: 10,
          paddingTop: 10,
          marginHorizontal: -15,
          paddingHorizontal: 15,
        }}>
        <Text style={[FONTS.fontMedium, { color: colors.title, fontSize: 16 }]}>
          FILTROS
        </Text>
        <TouchableOpacity
          style={{
            height: 38,
            width: 38,
            backgroundColor: colors.card,
            borderRadius: 38,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => sheetRef.current.close()}>
          <Image
            style={{
              width: 18,
              height: 18,
              resizeMode: "contain",
              tintColor: colors.title,
            }}
            source={IMAGES.close}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {showCategories && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
              }}>
              <Text
                style={{
                  ...FONTS.fontMedium,
                  fontSize: 15,
                  color: colors.title,
                }}>
                Categorías
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setShowAllCategories(!showAllCategories)}>
                <Text
                  style={{
                    ...FONTS.fontRegular,
                    fontSize: 13,
                    color: COLORS.primary,
                  }}>
                  {showAllCategories ? "Mostrar menos" : "Mostrar todos"}
                </Text>
              </TouchableOpacity>
            </View>
            {isLoadingCategories ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{ marginTop: 20 }}
              />
            ) : (
              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  gap: 10,
                }}>
                {displayedCategories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedCategory(category.id);
                      setShowCategories(false);
                    }}
                    style={{ alignItems: "center" }}>
                    <View
                      style={[
                        {
                          height: 45,
                          width: 45,
                          borderRadius: 50,
                          borderWidth: 1,
                          borderColor: COLORS.primaryLight,
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        selectedCategory === category.id && {
                          borderColor: COLORS.primary,
                        },
                      ]}>
                      <Image
                        style={{
                          height: 45,
                          width: 45,
                          resizeMode: "contain",
                          borderRadius: 30,
                        }}
                        source={
                          category.imageUrl
                            ? { uri: category.imageUrl } // Usa la URL de la imagen si está disponible
                            : IMAGES.defaultImage // Usa una imagen predeterminada si no hay imagen
                        }
                      />
                    </View>
                    <Text
                      style={[
                        FONTS.fontMedium,
                        {
                          fontSize: 14,
                          color: colors.title,
                          marginTop: 10,
                          width: "100%",
                          textAlign: "center",
                        },
                      ]}
                      numberOfLines={2}>
                      {capitalizeFirstLetter(category.name)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}
        {selectedCategory && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
              }}>
              <Text
                style={{
                  ...FONTS.fontMedium,
                  fontSize: 15,
                  color: colors.title,
                }}>
                Subcategorías
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setShowAllSubcategories(!showAllSubcategories)}>
                <Text
                  style={{
                    ...FONTS.fontRegular,
                    fontSize: 13,
                    color: COLORS.primary,
                  }}>
                  {showAllSubcategories ? "Mostrar menos" : "Mostrar todos"}
                </Text>
              </TouchableOpacity>
            </View>
            {isLoadingSubcategories ? (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                style={{ marginTop: 20 }}
              />
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: 5,
                  marginTop: 10,
                }}>
                {displayedSubcategories.map((subcategory, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      navigation.navigate("Products", {
                        subcategoryId: subcategory.id, // co_subl
                        subcategoryName: subcategory.name,
                        clienteId: clienteId, // co_cli
                      });
                      sheetRef.current.close();
                    }}
                    style={[
                      {
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: COLORS.primaryLight,
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                        marginBottom: 5,
                      },
                    ]}>
                    <Text
                      style={[
                        {
                          ...FONTS.fontMedium,
                          fontSize: 13,
                          color: colors.title,
                        },
                      ]}>
                      {capitalizeFirstLetter(subcategory.name)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setShowCategories(true)}
              style={{
                marginTop: 10,
                alignItems: "center",
                marginBottom: 20,
              }}>
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 13,
                  color: COLORS.primary,
                }}>
                Volver a Categorías
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default FilterSheet2;
