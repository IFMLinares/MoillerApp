import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
//import FeatherIcon from 'react-native-vector-icons/Feather';
import { Feather } from "@expo/vector-icons";
import { COLORS, FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import debounce from "lodash.debounce"; // Instala lodash si no lo tienes: npm install lodash
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage
import { searchArticles, Article } from "../../api/apiSearch"; // Asegúrate de tener esta función
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import { BASE_URL } from "../../api/globalUrlApi";

const Search = ({ navigation }: any) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [searchText, setSearchText] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // Estado para el indicador de carga al cargar más
  const [page, setPage] = useState(1); // Estado para la página actual
  const [hasMore, setHasMore] = useState(true); // Estado para verificar si hay más datos

  const searchInputRef = useRef<TextInput>(null); // Crea una referencia para el TextInput
  const clienteId = useSelector((state: RootState) => state.user.clienteId); // Especifica el tipo del estado
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId

  // Función de búsqueda con debounce
  const handleSearch = useCallback(
    async (text: string, pageNumber: number = 1) => {
      if (text.trim() === "") {
        setArticles([]);
        setLoading(false);
        setHasMore(false);
        return;
      }

      setLoading(pageNumber === 1);
      setLoadingMore(pageNumber > 1);

      try {
        const results = await searchArticles(text, pageNumber);
        setArticles((prev) =>
          pageNumber === 1 ? results : [...prev, ...results]
        );
        setHasMore(results.length > 0); // Si hay resultados, hay más datos
      } catch (error) {
        console.error("Error al buscar artículos:", error);
      }

      setLoading(false);
      setLoadingMore(false);
    },
    []
  );

  // Actualiza los resultados de búsqueda cuando cambia el texto
  const handleTextChange = (text: string) => {
    setSearchText(text);
    setPage(1); // Reinicia la página al cambiar el texto
    handleSearch(text, 1);
  };

  const loadMoreArticles = () => {
    if (hasMore && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      handleSearch(searchText, nextPage);
    }
  };

  const handleNavigateToProduct = (product: Article) => {
    navigation.navigate("ProductsDetails", { product });
  };

  // Enfoca el TextInput automáticamente al cargar la pantalla
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus(); // Enfoca el TextInput
      }
    }, 100); // Retraso de 100 ms

    return () => clearTimeout(timer); // Limpia el temporizador al desmontar
  }, []);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <ScrollView>
        <View
          style={[
            GlobalStyleSheet.container,
            {
              height: 60,
              backgroundColor: theme.dark
                ? "rgba(255,255,255,.1)"
                : colors.card,
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
                ref={searchInputRef} // Asigna la referencia al TextInput
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
            height: "100%",
            backgroundColor: colors.card,
          }}>
          <FlatList
            data={articles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  navigation.navigate("ProductsDetails", { product: item })
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.primaryLight,
                  paddingHorizontal: 15,
                }}>
                <Image
                  style={{ height: 40, width: 40, resizeMode: "contain" }}
                  source={{ uri: `${BASE_URL}${item.lowImage}` }}
                />
                <Text
                  style={[
                    FONTS.fontRegular,
                    { fontSize: 14, color: COLORS.title, flex: 1 },
                  ]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              articles.length > 0 && hasMore && !loading ? (
                <TouchableOpacity
                  onPress={loadMoreArticles}
                  style={{
                    padding: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: COLORS.primary,
                    borderRadius: 8,
                    marginHorizontal: 15,
                    marginVertical: 10,
                  }}>
                  {loadingMore ? (
                    <ActivityIndicator size="small" color={COLORS.background} />
                  ) : (
                    <Text
                      style={[FONTS.fontRegular, { color: COLORS.background, fontWeight: "bold" }]}>
                      MOSTRAR MÁS RESULTADOS
                    </Text>
                  )}
                </TouchableOpacity>
              ) : null
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Search;
