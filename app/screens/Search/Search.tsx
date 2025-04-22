import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
//import FeatherIcon from 'react-native-vector-icons/Feather';
import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import debounce from "lodash.debounce"; // Instala lodash si no lo tienes: npm install lodash
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage
import { fetchArticles } from "../../api/apiSearch"; // Asegúrate de tener esta función

const Search = ({ navigation }: any) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [searchText, setSearchText] = useState("");
  const [articles, setArticles] = useState([]); // Estado para los resultados de búsqueda
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga

  // Función de búsqueda con debounce
  const handleSearch = useCallback(
    debounce(async (text) => {
      if (text.trim() === "") {
        setArticles([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Verifica si los resultados ya están en AsyncStorage
        const cachedResults = await AsyncStorage.getItem(`search_${text}`);
        if (cachedResults) {
          setArticles(JSON.parse(cachedResults));
          setLoading(false);
          return;
        }

        // Si no hay resultados en caché, realiza la búsqueda
        const results = await fetchArticles();
        const filteredResults = results.filter((article) => {
          const productWords = article.name
            .toLowerCase()
            .split(" ")
            .slice(0, 4)
            .join(" ");
          return (
            productWords.includes(text.toLowerCase()) || // Coincidencia en las primeras 4 palabras del nombre
            article.code.toLowerCase().includes(text.toLowerCase()) || // Coincidencia en el código
            article.model.toLowerCase().includes(text.toLowerCase()) // Coincidencia en el modelo
          );
        });

        // Guarda los resultados en AsyncStorage
        await AsyncStorage.setItem(
          `search_${text}`,
          JSON.stringify(filteredResults)
        );

        setArticles(filteredResults);
      } catch (error) {
        console.error("Error al buscar artículos:", error);
      }

      setLoading(false);
    }, 500),
    []
  );

  // Actualiza los resultados de búsqueda cuando cambia el texto
  const handleTextChange = (text: string) => {
    setSearchText(text);
    handleSearch(text);
  };

  const handleNavigateToProduct = (product: any) => {
    navigation.navigate("ProductsDetails", { product });
  };

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <View
        style={[
          GlobalStyleSheet.container,
          {
            height: 60,
            backgroundColor: theme.dark ? "rgba(255,255,255,.1)" : colors.card,
            justifyContent: "center",
            borderBottomWidth: 1,
            borderBottomColor: COLORS.primaryLight,
          },
        ]}>
        <View style={[GlobalStyleSheet.row, {}]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              height: 48,
              width: 48,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Feather size={24} color={colors.text} name={"arrow-left"} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Busque los mejores artículos para usted"
              placeholderTextColor={colors.text}
              style={[
                FONTS.fontRegular,
                {
                  height: 48,
                  flex: 1,
                  borderRadius: 8,
                  paddingHorizontal: 20,
                  color: colors.title,
                  fontSize: 16,
                },
              ]}
              value={searchText}
              onChangeText={handleTextChange}
            />
          </View>
        </View>
      </View>

      {/* Indicador de carga */}
      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.title}
          style={{ marginTop: 20 }}
        />
      )}

      <View
        style={{
          paddingHorizontal: 15,
          marginTop: 0,
          backgroundColor: colors.card,
        }}>
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => handleNavigateToProduct(item)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 15,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.primaryLight,
                width: "100%",
              }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  width: "90%",
                }}>
                <Image
                  style={{ height: 20, width: 20, resizeMode: "contain" }}
                  source={IMAGES.timer} // Cambia esto según la imagen que quieras mostrar
                />
                <Text
                  style={[
                    FONTS.fontRegular,
                    { fontSize: 14, color: colors.title, width: "90%" },
                  ]}>
                  {item.name}
                </Text>
              </View>
              <View style={{ width: "10%" }}>
                <Feather
                  size={24}
                  color={colors.text}
                  name={"arrow-up-right"}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default Search;
