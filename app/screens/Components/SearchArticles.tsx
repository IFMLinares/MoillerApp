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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS } from "../../constants/theme";
import { searchArticles } from "../../api/apiSearch";
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
        console.log("Texto de búsqueda vacío, limpiando resultados.");
        setArticles([]);
        setLoading(false);
        return;
      }
  
      console.log("Buscando artículos con texto:", text);
      setLoading(true);
  
      try {
        const results = await searchArticles(text); // Llama a searchArticles
        console.log("Resultados procesados en el componente:", results); // Log de los resultados procesados
        setArticles(results);
      } catch (error) {
        console.error("Error al buscar artículos:", error);
      }
  
      setLoading(false);
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
                  flexDirection: "row", // Alinea el contenido en fila
                  alignItems: "center", // Centra verticalmente
                  padding: 10,
                }}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleNavigateToProduct(item)}>
                  <Text style={styles.articleText} numberOfLines={2}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
                {item.lowImage && (
                  <View style={{ marginLeft: 10 }}>
                    <Image
                      source={{ uri: item.lowImage }}
                      style={{ width: 50, height: 50, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                  </View>
                )}
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
