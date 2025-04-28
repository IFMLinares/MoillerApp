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
import { searchArticles, Article } from "../../api/apiSearch"; // Asegúrate de tener esta función
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import { BASE_URL } from "../../api/globalUrlApi";

const Search = ({ navigation }: any) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [searchText, setSearchText] = useState("");
  const [articles, setArticles] = useState<Article[]>([]); // Especifica el tipo Article[]
  const [loading, setLoading] = useState(false); // Estado para el indicador de carga

  const clienteId = useSelector((state: RootState) => state.user.clienteId); // Especifica el tipo del estado
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId

  // Función de búsqueda con debounce
const handleSearch = useCallback(
  debounce(async (text: string) => { // Especifica el tipo 'string'
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

  // Actualiza los resultados de búsqueda cuando cambia el texto
  const handleTextChange = (text: string) => {
    setSearchText(text);
    handleSearch(text);
  };

  const handleNavigateToProduct = (product: Article) => {
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
                  style={{ height: 40, width: 40, resizeMode: "contain" }}
                  source={{ uri: `${BASE_URL}${item.lowImage}` }} // Cambia "low_Image" por "lowImage"
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
