import React, { useRef, useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { COLORS, FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import Cardstyle1 from "../../components/Card/Cardstyle1";
import Cardstyle2 from "../../components/Card/Cardstyle2";
import BottomSheet2 from "../Components/BottomSheet2";
import Header from "../../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import Toast from "react-native-toast-message";
import { addToCart } from "../../redux/reducer/cartReducer";
import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { fetchArticles } from "../../api/listCatalogoApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QuantityButton from "../Components/QuantityButton";
import QuantityButton2 from "../Components/QuantityButton2";

import { BASE_URL } from "../../api/globalUrlApi"; // Importar la URL base

type ProductsScreenProps = StackScreenProps<RootStackParamList, "Nuevo">;

// Define el tipo SortCriteria
type SortCriteria = string;

const Nuevo = ({ navigation, route }: ProductsScreenProps) => {
  const { subcategoryName } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors } = theme;
  const [show, setShow] = useState(false);
  const [quantities, setQuantities] = useState({});
  const sheetRef = useRef<any>(null);
  const [sortCriteria, setSortCriteria] = useState("De la A a la Z"); // Estado para el criterio de ordenación

  const clienteId = useSelector((state: RootState) => state.user.clienteId); // Especifica el tipo del estado
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId

  const [articles, setArticles] = useState<Article[]>([]); // Define el tipo como un array de artículos
  interface Article {
    id: number;
    name: string;
    price: number;
    code: string;
    highImage: string;
    createdAt: string;
    line?: string; // Agrega esta propiedad si es opcional
    delevery?: string; // Agrega esta propiedad si es opcional
    quantity?: number; // Agrega esta propiedad si es opcional
  }
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef(null); // Referencia para FlatList

  const toastRef = useRef(null);

  const showToast = (type: string, text1: string, text2: string = "") => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  const addItemToCart = async (item: Article) => {
    try {
      // Lógica para añadir al carrito...
      showToast("success", "¡Producto añadido al carrito exitosamente!");
    } catch (error) {
      showToast("error", "Error al añadir al carrito", "Inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    loadArticles();
  }, [page]);

  const loadArticles = async () => {
    if (!hasMore || isLoading) return;
  
    setIsLoading(true);
    try {
      const { articles: newArticles, next } = await fetchArticles(
        clienteId,
        page // Sin necesidad de pasar "alfabetico", se ordenará por fecha
      );
  
      const articlesWithDefaultPrice = newArticles.map((article: Article) => ({
        ...article,
        price: article.price || 0,
      }));
  
      setArticles((prevArticles) => [
        ...prevArticles,
        ...articlesWithDefaultPrice,
      ]);
      setHasMore(!!next);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al cargar los productos",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para ordenar los artículos
  const sortArticles = (criteria: SortCriteria) => {
    let sortedArticles = [...articles];
    if (criteria === "De la A a la Z") {
      sortedArticles.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === "De la Z a la A") {
      sortedArticles.sort((a, b) => b.name.localeCompare(a.name));
    } else if (criteria === "Precio: menor a mayor") {
      sortedArticles.sort((a, b) => a.price - b.price);
    } else if (criteria === "Precio: mayor a menor") {
      sortedArticles.sort((a, b) => b.price - a.price);
    } else if (criteria === "Lo más nuevo primero") {
      sortedArticles.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    setArticles(sortedArticles);
  };

  const handleSortChange = (criteria: SortCriteria) => {
    setSortCriteria(criteria);
    sortArticles(criteria);
  };

  // flatlist card1
  const renderItem = ({ item }: { item: Article }) => (
    <View
      style={[
        GlobalStyleSheet.col50,
        {
          marginBottom: 10,
          paddingHorizontal: 0,
          backgroundColor: colors.card,
        },
      ]}>
      <Cardstyle1
        id={item.id.toString()}
        title={item.name}
        image={{ uri: `${BASE_URL}${item.highImage}` }}
        price={(item.price || 0).toString()} // Proporciona un valor predeterminado si `price` es undefined
        modelo={item.code}
        borderTop
        onPress={() =>
          navigation.navigate("ProductsDetails", {
            product: item, // Pasa el objeto completo del producto aquí
            productId: item.id, // Agrega la propiedad productId
          })
        }
        // onPress3={() => addItemToWishList(item)}
      />
      <QuantityButton
        item={item}
        quantities={quantities}
        setQuantities={setQuantities}
        clienteId={clienteId} // Pasa el clienteId automáticamente
        showToast={showToast} // Pasa la función showToast
      />
    </View>
  );
  // flatlist card1
  // flatlist card2
  const renderItem2 = ({ item, index }: { item: Article; index: number }) => (
    <View key={index} style={{ marginBottom: 10 }}>
      <Cardstyle2
        title={item.name}
        price={(item.price || 0).toString()} // Proporciona un valor predeterminado si `price` es undefined // Convierte el precio a string si es necesario
        marca={item.code} // Proporciona el código como marca
        modelo={item.line || "Sin modelo"} // Proporciona un valor predeterminado si `line` es undefined
        delevery={item.delevery || "Sin información"} // Proporciona un valor predeterminado si `delevery` es undefined
        quantity={item.quantity || 0} // Proporciona un valor predeterminado si `quantity` es undefined
        productId={item.id.toString()} // Convierte el ID a string
        image={{ uri: `${BASE_URL}${item.highImage}` }}
        removebottom
        onPress={() =>
          navigation.navigate("ProductsDetails", {
            product: item, // Pasa el objeto completo del producto aquí
            productId: item.id, // Agrega la propiedad productId
          })
        }
      />

      <QuantityButton2
        item={item}
        quantities={quantities}
        setQuantities={setQuantities}
        clienteId={clienteId} // Pasa el clienteId automáticamente
        showToast={showToast} // Pasa la función showToast
      />
    </View>
  );

  // fatlist card2

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title={subcategoryName} // Usa el nombre de la subcategoría aquí
        leftIcon="back"
        titleLeft
        rightIcon5={"search"}
        rightIcon2={"cart"}
      />

      <View
        style={[
          {
            padding: 0,
            backgroundColor: theme.dark ? "rgba(255,255,255,.1)" : colors.card,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.35,
            shadowRadius: 6.27,
            elevation: 5,
            height: 40,
            width: "100%",
          },
        ]}>
        <View
          style={[
            GlobalStyleSheet.container,
            {
              padding: 0,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            },
          ]}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => sheetRef.current.openSheet("short")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              width: "35%",
              justifyContent: "center",
            }}>
            <Image
              style={{ height: 16, width: 16, resizeMode: "contain" }}
              source={IMAGES.list2}
            />
            <Text
              style={[FONTS.fontMedium, { fontSize: 15, color: colors.text }]}>
              ORDENAR POR
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: 1,
              height: 40,
              backgroundColor: COLORS.primaryLight,
            }}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => sheetRef.current.openSheet("filter")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              width: "35%",
              justifyContent: "center",
            }}>
            <Image
              style={{ height: 16, width: 16, resizeMode: "contain" }}
              source={IMAGES.filter3}
            />
            <Text
              style={[FONTS.fontMedium, { fontSize: 15, color: colors.text }]}>
              CATEGORÍAS
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: 1,
              height: 40,
              backgroundColor: COLORS.primaryLight,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setShow(!show);
            }}
            style={{
              width: "15%",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Image
              style={{
                height: 22,
                width: 22,
                resizeMode: "contain",
                tintColor: show ? colors.text : COLORS.primary,
              }}
              source={IMAGES.grid}
            />
          </TouchableOpacity>
          <View
            style={{
              width: 1,
              height: 40,
              backgroundColor: COLORS.primaryLight,
            }}
          />
          <TouchableOpacity
            onPress={() => {
              setShow(!show);
            }}
            style={{
              width: "15%",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Image
              style={{
                height: 22,
                width: 22,
                resizeMode: "contain",
                tintColor: show ? COLORS.primary : colors.text,
              }}
              source={IMAGES.list}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          GlobalStyleSheet.container,
          { paddingTop: 15, paddingHorizontal: 0 },
        ]}>
        <FlatList
          ref={flatListRef} // Referencia para mantener la posición
          data={articles}
          renderItem={show ? renderItem : renderItem2}
          keyExtractor={(item, index) => `${item.id}-${index}`} // Genera una clave única combinando el id y el índice
          contentContainerStyle={{ paddingBottom: 20 }}
          numColumns={2}
          onEndReached={() => {
            if (hasMore && !isLoading) {
              setPage((prevPage) => prevPage + 1); // Incrementa la página solo si hay más productos
            }
          }}
          onEndReachedThreshold={0.5} // Umbral para cargar más productos
          ListFooterComponent={
            hasMore && isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : null
          }
          initialNumToRender={10} // Renderiza inicialmente 10 artículos
          getItemLayout={(data, index) => ({
            length: 200, // Altura aproximada de cada elemento
            offset: 200 * index,
            index,
          })} // Optimización para mantener la posición
          maintainVisibleContentPosition={{
            minIndexForVisible: 0, // Mantiene la posición visible desde el índice 0
          }}
        />
      </View>
      <BottomSheet2
        ref={sheetRef}
        onSortChange={handleSortChange}
        activeSortCriteria={sortCriteria} // Pasa el estado actual como prop
      />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    ...FONTS.fontMedium,
  },
  actionBtn: {
    height: 45,
    width: 45,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    marginLeft: 15,
  },
});

export default Nuevo;
