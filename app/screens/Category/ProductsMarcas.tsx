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
import data from "../../data/data.json";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import Toast from "react-native-toast-message";
import { addToCart } from "../../redux/reducer/cartReducer";
import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { fetchArticles } from "../../api/listMarcasApi";
import QuantityButton from "../Components/QuantityButton";
import QuantityButton2 from "../Components/QuantityButton2";
import AsyncStorage from '@react-native-async-storage/async-storage';

 

type ProductsScreenProps = StackScreenProps<
  RootStackParamList,
  "ProductsMarcas"
>;

const ProductsMarcas = ({ navigation, route }: ProductsScreenProps) => {
  const { brandId, brandName } = route.params; // Recibe los parámetros de la marca
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors } = theme;
  const [show, setShow] = useState(true); // Alternar entre las dos listas
  const [articles, setArticles] = useState([]);
  const [quantities, setQuantities] = useState({});
  const sheetRef = useRef<any>(null);
  const [page, setPage] = useState(1); // Página actual para la paginación
  const [initialLoading, setInitialLoading] = useState(false); // Estado para la carga inicial
  const [loadingMoreGrid, setLoadingMoreGrid] = useState(false); // Estado para cargar más artículos en la vista de cuadrícula
  const [loadingMoreList, setLoadingMoreList] = useState(false); // Estado para cargar más artículos en la vista de lista
  const [hasMore, setHasMore] = useState(true); // Indica si hay más productos para cargar

  const clienteId = useSelector((state) => state.user.clienteId); // Obtén el clienteId desde Redux
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId 
  

 // Cargar productos al montar el componente
 useEffect(() => {
  const loadArticles = async () => {
    try {
      setInitialLoading(true); // Inicia el indicador de carga inicial

      // Verificar si los productos ya están en AsyncStorage
      const cachedArticles = await AsyncStorage.getItem(`articles_${brandId}`);
      if (cachedArticles) {
        console.log("Cargando artículos desde AsyncStorage");
        setArticles(JSON.parse(cachedArticles));
        setHasMore(false); // No hay más productos para cargar
        return; // Salir si los datos están en caché
      }

      // Si no hay datos en caché, cargar desde la API
      console.log("Cargando artículos desde la API");
      const fetchedArticles = await fetchArticles(brandName, page); // Filtra por marca y página
      if (fetchedArticles.length === 0) {
        setHasMore(false); // No hay más productos para cargar
      } else {
        setArticles(fetchedArticles);

        // Guardar los productos en AsyncStorage
        await AsyncStorage.setItem(
          `articles_${brandId}`,
          JSON.stringify(fetchedArticles)
        );
      }
    } catch (error) {
      console.error("Error al cargar los artículos:", error);
    } finally {
      setInitialLoading(false); // Detén el indicador de carga inicial
    }
  };

  loadArticles();
}, [brandId, brandName, page]); // Escucha cambios en los parámetros y la página

const loadMoreArticles = async (listType: "grid" | "list") => {
  if (!hasMore) return; // No cargar más si no hay más productos
  if (listType === "grid" && loadingMoreGrid) return; // Evitar múltiples solicitudes simultáneas para la cuadrícula
  if (listType === "list" && loadingMoreList) return; // Evitar múltiples solicitudes simultáneas para la lista

  if (listType === "grid") setLoadingMoreGrid(true);
  if (listType === "list") setLoadingMoreList(true);

  try {
    const newArticles = await fetchArticles(brandName, page + 1); // Filtra por marca y página
    if (newArticles.length === 0) {
      setHasMore(false); // No hay más productos para cargar
    } else {
      const updatedArticles = [...articles, ...newArticles];
      setArticles(updatedArticles);
      setPage((prevPage) => prevPage + 1); // Incrementa la página

      // Actualizar los productos en AsyncStorage
      await AsyncStorage.setItem(
        `articles_${brandId}`,
        JSON.stringify(updatedArticles)
      );
    }
  } catch (error) {
    console.error("Error al cargar más artículos:", error);
  } finally {
    if (listType === "grid") setLoadingMoreGrid(false);
    if (listType === "list") setLoadingMoreList(false);
  }
};


  // flatlist card1
  const renderItem = ({ item }) => (
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
        id={item.id}
        title={item.name}
        image={{ uri: `http://10.0.2.2:8000${item.highImage}` }}
        price={item.price}
        modelo={item.code}
        borderTop
        onPress={() =>
          navigation.navigate("ProductsDetails", {
            product: item, // Pasa el objeto completo del producto aquí
          })
        }
        onPress3={() => addItemToWishList(item)}
      />
      <QuantityButton
        item={item}
        quantities={quantities}
        setQuantities={setQuantities}
        clienteId={clienteId} // Pasa el clienteId automáticamente

      />
    </View>
  );
  // flatlist card1
  // flatlist card2
  const renderItem2 = ({ item, index }) => (
    <View key={index} style={{ marginBottom: 10 }}>
      <Cardstyle2
        title={item.name}
        price={item.price}
        marca={item.code}
        image={{ uri: `http://10.0.2.2:8000${item.highImage}` }}
        removebottom
        onPress={() =>
          navigation.navigate("ProductsDetails", {
            product: item, // Pasa el objeto completo del producto aquí
          })
        }
      />

      <QuantityButton2
        item={item}
        quantities={quantities}
        setQuantities={setQuantities}
        clienteId={clienteId} // Pasa el clienteId automáticamente

      />
    </View>
  );

  // fatlist card2

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title={brandName} // Usa el nombre de la marca
        leftIcon="back"
        titleLeft
        rightIcon1={"search"}
        rightIcon2={"cart"}
      />

      <View
        style={[
          {
            padding: 0,
            //paddingHorizontal:15,
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
              style={[FONTS.fontMedium, { fontSize: 15, color: colors.title }]}>
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
              style={[FONTS.fontMedium, { fontSize: 15, color: colors.title }]}>
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
          { paddingTop: 15, paddingHorizontal: 0, marginBottom: 80 },
        ]}>
        <View>
        {initialLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : (
          <View>
            {show ? (
              <FlatList
                data={articles}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()} // Usa un identificador único
                contentContainerStyle={{ paddingBottom: 20 }}
                numColumns={2}
                onEndReached={() => loadMoreArticles("grid")}
                onEndReachedThreshold={0.5} // Carga más artículos cuando el usuario está al 50% del final
                ListFooterComponent={
                  hasMore && articles.length >= 4 && loadingMoreGrid && (
                    <ActivityIndicator size="large" color={COLORS.primary} />
                  )
                }
              />
            ) : (
              <FlatList
                data={articles}
                renderItem={renderItem2}
                keyExtractor={(item, index) => `${item.id}:${index}`} // Clave única
                contentContainerStyle={{ paddingBottom: 20 }}
                key={show ? "grid" : "list"} // Cambia la clave aquí
                onEndReached={() => loadMoreArticles("list")}
                onEndReachedThreshold={0.5} // Carga más artículos cuando el usuario está al 50% del final
                ListFooterComponent={
                  hasMore && articles.length >= 4 && loadingMoreList && (
                    <ActivityIndicator size="large" color={COLORS.primary} />
                  )
                }
              />
            )}
          </View>
        )}
        </View>
      </View>
      <BottomSheet2 ref={sheetRef} />
      <Toast ref={(ref) => Toast.setRef(ref)} />
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

export default ProductsMarcas;
