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

const SearchArticles = () => {
  const [searchText, setSearchText] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga
  const navigation = useNavigation();

  // Animación para la lista desplegable
  const dropdownAnimation = useRef(new Animated.Value(0)).current;

  // Función para manejar la búsqueda con debounce
  const handleSearch = useCallback(
    debounce(async (text) => {
      if (text.trim() === "") {
        setArticles([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const results = await fetchArticles();
      const filteredResults = results.filter((article) =>
        article.name.toLowerCase().includes(text.toLowerCase())
      );
      setArticles(filteredResults.slice(0, 5));
      setLoading(false);

      // Inicia la animación cuando hay resultados
      Animated.timing(dropdownAnimation, {
        toValue: 1, // Aparece completamente
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 500),
    []
  );

  // Actualiza la búsqueda cuando cambia el texto
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
            width: wp("45%"),
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
            maxHeight: hp("30%"),
            width: wp("50%"),
            position: "absolute",
            zIndex: 1,
            top: hp("5%"),
            left: wp("3%"),
          }}
        >
          <FlatList
            data={articles}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false} // Oculta el indicador de scroll
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.articleItem}
                onPress={() => handleNavigateToProduct(item)}
              >
                <Text style={styles.articleText}>{item.name}</Text>
              </TouchableOpacity>
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
    borderBottomColor: COLORS.title,
  },
  articleText: {
    color: COLORS.title,
    fontSize: hp("2%"),
  },
});
