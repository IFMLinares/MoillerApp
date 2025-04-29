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
import { addTowishList } from "../../redux/reducer/wishListReducer";
import { useDispatch, useSelector } from "react-redux"; 
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import Toast from "react-native-toast-message";
import { addToCart } from "../../redux/reducer/cartReducer";
import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { fetchProductsBySubcategory } from "../../api/listSubCategoryApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QuantityButton from "../Components/QuantityButton";
import QuantityButton2 from "../Components/QuantityButton2";
import { BASE_URL } from "../../api/globalUrlApi"; // Importar la URL base

type ProductsScreenProps = StackScreenProps<RootStackParamList, "Products">;

type Article = {
  id: number;
  name: string;
  price: number;
  code: string;
  highImage: string;
  createdAt: string;
};

const Products = ({ navigation, route }: ProductsScreenProps) => {
  const { subcategoryId, subcategoryName, clienteId } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors } = theme;
  const [show, setShow] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [quantities, setQuantities] = useState({});
  const sheetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para el indicador de carga
  const [sortCriteria, setSortCriteria] = useState("De la A a la Z"); // Estado para el criterio de ordenación
  const [currentPage, setCurrentPage] = useState(1); // Estado para la paginación
  const [hasMore, setHasMore] = useState(true); // Controlar si hay más páginas
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
    showToast("success", "¡Producto añadido al carrito exitosamente!");
  } catch (error) {
    showToast("error", "Error al añadir al carrito", "Inténtalo de nuevo.");
  }
};

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        // await AsyncStorage.clear(); // Limpiar AsyncStorage para pruebas
        // Llamar a la API con los parámetros subcategoryId y clienteId
        const data = await fetchProductsBySubcategory(
          subcategoryId.toString(), // Convierte subcategoryId a string
          clienteId.toString(),
          currentPage
        );

        // Actualizar los artículos y manejar la paginación
        setArticles((prevArticles) => [...prevArticles, ...data.results]);
        setHasMore(!!data.next); // Verificar si hay más páginas
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, [subcategoryId, clienteId, currentPage]);

  // Función para cargar más productos al llegar al final de la lista
  const loadMoreArticles = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Función para ordenar los artículos
  const sortArticles = (criteria: "De la A a la Z" | "De la Z a la A" | "Precio: menor a mayor" | "Precio: mayor a menor" | "Lo más nuevo primero") => {
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
      sortedArticles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    setArticles(sortedArticles);
  };

  // Manejar el cambio de criterio de ordenación
  const handleSortChange = (criteria: string) => {
    const validCriteria = [
      "De la A a la Z",
      "De la Z a la A",
      "Precio: menor a mayor",
      "Precio: mayor a menor",
      "Lo más nuevo primero",
    ] as const;
  
    if (validCriteria.includes(criteria as typeof validCriteria[number])) {
      setSortCriteria(criteria as typeof validCriteria[number]);
      sortArticles(criteria as typeof validCriteria[number]);
    } else {
      console.warn(`Criterio de ordenación no válido: ${criteria}`);
    }
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
        price={item.price.toString()}
        modelo={item.code}
        borderTop
        onPress={() =>
          navigation.navigate("ProductsDetails", {
            product: item, // Pasa el objeto completo del producto aquí
            productId: item.id, // Agrega la propiedad productId
          })
        } 
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
  console.log("Pasando showToast a QuantityButton:", showToast);
  // flatlist card1
  // flatlist card2
  const renderItem2 = ({ item, index }: { item: Article; index: number }) => (
    <View key={index} style={{ marginBottom: 10 }}>
      <Cardstyle2
        title={item.name}
        price={item.price.toString()}
        marca={item.code}
        image={{ uri: `${BASE_URL}${item.highImage}` }}
        delevery={true.toString()} // Agrega esta propiedad
        quantity={1} // Agrega esta propiedad
        productId={item.id.toString()} // Agrega esta propiedad
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
              style={[FONTS.fontMedium, { fontSize: 15, color: colors.text}]}>
              FILTROS
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
          { paddingTop: 15, paddingHorizontal: 0, marginBottom: 100 },
        ]}>
        {isLoading && currentPage === 1 ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <FlatList
            data={articles}
            renderItem={show ? renderItem : renderItem2}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            numColumns={show ? 2 : 1}
            key={show ? "grid" : "list"} // Cambia la clave aquí
            onEndReached={loadMoreArticles} // Cargar más productos al llegar al final
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              hasMore ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : null
            }
          />
        )}
      </View>
      <BottomSheet2 ref={sheetRef} onSortChange={handleSortChange} />
      <Toast  />
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

export default Products;
