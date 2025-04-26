import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../constants/theme";
import { fetchArticles } from "../../api/apiSearch";
import { useNavigation } from "@react-navigation/native";
import debounce from "lodash.debounce"; // Instala lodash si no lo tienes: npm install lodash
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage

const SearchArticles = () => {
  const [searchText, setSearchText] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga
  const navigation = useNavigation();

  // Animación para la lista desplegable
  const dropdownAnimation = useRef(new Animated.Value(0)).current;

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
          // Verifica si el texto coincide con el nombre, código o modelo
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

      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 500),
    []
  );

  useEffect(() => {
    handleSearch(searchText);
  }, [searchText]);

  const handleNavigateToProduct = (product) => {
    if (!product) {
      console.error("El producto es null o undefined");
      return;
    }
    navigation.navigate("ProductsDetails", { product });
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.card,
          borderRadius: 18,
        }}>
        <View
          style={{
            transform: [{ rotate: "90deg" }],
            marginLeft: wp("5%"),
          }}>
          <Feather name="search" size={hp("2.5%")} color={COLORS.title} />
        </View>
        <TextInput
          placeholder="Buscar"
          placeholderTextColor={COLORS.title}
          style={{
            backgroundColor: COLORS.card,
            width: wp("40%"),
            height: hp("5%"),
            borderRadius: 18,
            paddingLeft: wp("2.5%"),
            color: COLORS.title,
            fontSize: hp("2%"),
          }}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Indicador de carga */}
      {loading && (
        <ActivityIndicator
          size="large"
          color={COLORS.title}
          style={{ position: "absolute", top: hp("5%"), left: wp("20%") }}
        />
      )}

      {/* Lista desplegable */}
      {articles.length > 0 && !loading && (
        <Animated.View
          style={{
            opacity: dropdownAnimation, // Animación de opacidad
            transform: [
              {
                scaleY: dropdownAnimation, // Animación de escala vertical
              },
            ],
            backgroundColor: COLORS.card,
            borderRadius: 18,
            marginTop: hp("1%"),
            width: wp("50%"),
            position: "absolute",
            zIndex: 1,
            top: hp("5%"),
            left: wp("3%"),
            maxHeight: hp("30%"), // Límite de altura para el contenedor
          }}>
          <FlatList
            data={articles}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={true} // Habilita el indicador de scroll
            nestedScrollEnabled={true} // Permite el desplazamiento anidado
            renderItem={({ item }) => (
              <Animated.View
                style={{
                  opacity: dropdownAnimation, // Animación de opacidad
                  transform: [
                    {
                      scale: dropdownAnimation, // Animación de escala
                    },
                  ],
                  backgroundColor: COLORS.card,
                  borderRadius: 18,
                }}>
                <TouchableOpacity
                  style={styles.articleItem}
                  onPress={() => handleNavigateToProduct(item)}>
                  <Text style={styles.articleText} numberOfLines={2}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default SearchArticles;

const styles = StyleSheet.create({
  articleItem: {
    padding: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderRadius: 18,
    borderBottomColor: COLORS.title,
  },
  articleText: {
    color: COLORS.title,
    fontSize: hp("1.5%"),
  },
});
