import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import Button from "../../components/Button/Button";
import Cardstyle1 from "../../components/Card/Cardstyle1";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../../redux/reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setClienteId } from "../../redux/actions/drawerAction";
import { openDrawer } from "../../redux/actions/drawerAction";
import { LinearGradient } from "expo-linear-gradient";
import BottomSheet2 from "../Components/BottomSheet2";
import StopWatch from "../../components/StopWatch";
import StopWatch2 from "../../components/StopWatch2";
import { addTowishList } from "../../redux/reducer/wishListReducer";
import Swiper from "react-native-swiper/src";
import Toast from "react-native-toast-message";
import { addToCart } from "../../redux/reducer/cartReducer";
import { Dimensions } from "react-native";
// api articulos
import { fetchArticles, Article } from "../../api/authApi";
import { BASE_URL } from "../../api/globalUrlApi"; // Importar la URL base
import { fetchBanners } from "../../api/bannerApi"; // Importar la función desde bannerApi
import { fetchProductsBrand } from "../../api/listMarcasApi"; // Importar la función de la API

// api articulos
import QuantityButton from "../Components/QuantityButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// buscador

// buscador
import { BackHandler, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const marcas = [
  {
    image: IMAGES.marca,
    brand: "STE", // Identificador único para la marca
    name: "STEINMANN", // Nombre de la marca
  },
  {
    image: IMAGES.marca1,
    brand: "MAS",
    name: "MASLEX",
  },
  {
    image: IMAGES.marca2,
    brand: "SEC",
    name: "SECOP",
  },
  {
    image: IMAGES.marca3,
    brand: "AMR",
    name: "AMERICOLD",
  },
];

type HomeScreenProps = StackScreenProps<RootStackParamList, "Home"> & {
  onScrollToTop?: () => void;
};

type Banner = {
  id: number;
  banner_image: string;
};

const Home = forwardRef(({ navigation }: HomeScreenProps, ref)  => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]); // Define el tipo del estado
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();
  const clienteId = useSelector((state: RootState) => state.user.clienteId); // Especifica el tipo del estado
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId
  const [marca, setMarcas] = useState([]); // Estado para las marcas
  const [loadingMarcas, setLoadingMarcas] = useState(true); // Estado de carga para las marcas
  const toastRef = useRef(null);
  const [message, setMessage] = useState<string | null>(null); // Estado para el mensaje
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  ); // Tipo de mensaje
  const scrollViewRef = useRef<ScrollView>(null);

  React.useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    },
  }));

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Mostrar una alerta para confirmar si el usuario desea salir
        Alert.alert(
          "Salir de la aplicación",
          "¿Estás seguro de que deseas salir?",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Salir", onPress: () => BackHandler.exitApp() },
          ]
        );
        return true; // Evita que el botón de retroceso funcione
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const showToast = (type: string, text1: string, text2: string = "") => {
    Toast.show({
      type,
      text1,
      text2,
    });
  };

  const showMessage = (type: "success" | "error", text: string) => {
    console.log(`Mostrando mensaje: ${type} - ${text}`);
    setMessageType(type);
    setMessage(text);
    setTimeout(() => {
      setMessage(null); // Oculta el mensaje después de 3 segundos
    }, 3000);
  };

  const addItemToCart = async (item: Article) => {
    try {
      console.log("Añadiendo al carrito...");
      // Lógica para añadir al carrito...
      showMessage("success", "¡Producto añadido al carrito exitosamente!");
    } catch (error) {
      console.log("Error al añadir al carrito:", error);
      showMessage("error", "Error al añadir al carrito. Inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        setLoadingMarcas(true);
        const co_cat = "defaultCategory"; // Reemplaza con la categoría adecuada o lógica para obtenerla
        const response = await fetchProductsBrand(co_cat, clienteId); // Pasa ambos argumentos
        const uniqueBrands = response.results.map((item: any) => ({
          brand: item.brand,
          name: item.brand,
          image: item.highImage || IMAGES.defaultImage, // Imagen por defecto si no hay
        }));
        setMarcas(uniqueBrands);
      } catch (error) {
        console.error("Error al obtener las marcas:", error);
      } finally {
        setLoadingMarcas(false);
      }
    };

    if (clienteId) {
      fetchMarcas();
    }
  }, [clienteId]);

  // redux
  useEffect(() => {
    const restoreClienteId = async () => {
      try {
        const storedClienteId = await AsyncStorage.getItem("clienteId");
        if (storedClienteId) {
          console.log(
            "Cliente ID restaurado desde AsyncStorage:",
            storedClienteId
          );
          dispatch(setClienteId(parseInt(storedClienteId, 10))); // Restaura el clienteId en Redux
        }
      } catch (error) {
        console.error("Error al restaurar el clienteId:", error);
      }
    };

    restoreClienteId();
  }, [dispatch]);

  // api
  const loadMoreArticles = async () => {
    try {
      setLoading(true);
      const newArticles = await fetchArticles(clienteId!, 12); // Cargar 12 productos más
      setArticles((prevArticles) => [...prevArticles, ...newArticles]); // Agregar los nuevos productos
    } catch (error) {
      console.error("Error al cargar más artículos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getArticles = async () => {
      try {
        setLoading(true);
        const data = await fetchArticles(clienteId);
        setArticles(data);
      } catch (error) {
        console.error("Error al obtener los artículos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (clienteId) {
      getArticles();
    }
  }, [clienteId, page]);

  const navigateToProductDetails = (product: {
    id: number;
    name: string;
    price: number;
    code: string;
    highImage: string;
  }) => {
    navigation.navigate("ProductsDetails", {
      product, // Pasa el objeto completo del producto aquí
      productId: product.id, // Agrega la propiedad productId
    });
  };

  const navigateToProductsMarcas = (brand: string, brandName: string) => {
    navigation.navigate("ProductsMarcas", {
      brandId: brand,
      brandName,
      clienteId,
    });
  };
  // api

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const addItemToWishList = (data: any) => {
    dispatch(addTowishList(data));
  };

  const moresheet2 = useRef<any>(null);

  const [loadingBanners, setLoadingBanners] = useState(true);
  useEffect(() => {
    const getBanners = async () => {
      setLoadingBanners(true);
      const data = await fetchBanners(); // Llama a la función de bannerApi
      setBanners(data);
      setLoadingBanners(false);
    };

    getBanners();
  }, []);

  const defaultImages = [
    require("../../assets/images/carousel/AMERICOLD.png"),
    require("../../assets/images/carousel/SECOP.png"),
    require("../../assets/images/carousel/STEINMANN.png"),
  ];

  const renderImages = () => {
    if (banners.length > 0) {
      return banners.map((banner) => (
        <Image
          key={banner.id}
          style={{
            height: 200,
            width: "100%",
            resizeMode: "contain",
          }}
          source={{ uri: `${BASE_URL}${banner.banner_image}` }}
        />
      ));
    } else {
      return defaultImages.map((image, index) => (
        <Image
          key={index}
          style={{
            height: 200,
            width: "100%",
            resizeMode: "contain",
          }}
          source={image}
        />
      ));
    }
  };

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      {/* Mensaje local */}
      {message && (
        <View
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            right: 10,
            padding: 10,
            backgroundColor: messageType === "success" ? "green" : "red",
            borderRadius: 5,
            zIndex: 1000,
          }}>
          <Text style={{ color: "white", textAlign: "center" }}>{message}</Text>
        </View>
      )}
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        colors={["#001A44", "#193561"]}
        style={{ height: undefined, width: "100%" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          ref={scrollViewRef}>
          <View
            style={{
              height: 40,
              backgroundColor: COLORS.primary,
              marginBottom: 20,
              zIndex: 100,
            }}>
            <View
              style={[GlobalStyleSheet.container, { paddingHorizontal: 20 }]}>
              <View
                style={[
                  GlobalStyleSheet.row,
                  { alignItems: "center", justifyContent: "space-between" },
                ]}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}>
                  <Image
                    style={{ resizeMode: "contain", width: 150, height: 50 }} // Ajusta el tamaño aquí
                    source={IMAGES.appname}
                  />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Search")}
                    style={{
                      height: 35,
                      width: 35,
                      // borderRadius:8,
                      // backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)' : COLORS.background,
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <Image
                      style={{
                        height: 22,
                        width: 22,
                        tintColor: COLORS.card,
                        resizeMode: "contain",
                      }}
                      source={IMAGES.search}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <Swiper
            autoplay={true}
            autoplayTimeout={5}
            height={"auto"}
            dotStyle={{
              height: 6,
              width: 6,
              backgroundColor: COLORS.card,
              opacity: 0.2,
            }}
            activeDotStyle={{
              height: 6,
              width: 6,
              backgroundColor: COLORS.card,
            }}
            paginationStyle={{ bottom: 10 }}
            showsPagination={Platform.OS === "android" ? true : false}>
            {loadingBanners ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              renderImages()
            )}
          </Swiper>

          {loadingMarcas ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <View style={[GlobalStyleSheet.container, { paddingVertical: 0 }]}>
              <View style={{ marginHorizontal: 0, marginVertical: 10 }}>
                <View
                  style={{
                    borderTopColor: "white",
                    borderBottomColor: "white",
                    borderTopWidth: 3,
                    borderBottomWidth: 3,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    paddingVertical: 15,
                  }}>
                  {marcas.map((marca, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        navigateToProductsMarcas(marca.brand, marca.name)
                      }>
                      <Image
                        style={{
                          width: wp("20%"),
                          height: hp("2.5%"),
                        }}
                        source={marca.image}
                        resizeMode="stretch"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
          <View style={{ height: 50 }}>
            <View
              style={[
                GlobalStyleSheet.container,
                { padding: 0, paddingHorizontal: 0 },
              ]}>
              <View style={{}}>
                <ScrollView
                  // horizontal
                  contentContainerStyle={{ paddingHorizontal: 20, flexGrow: 1 }}
                  showsHorizontalScrollIndicator={true}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                    <TouchableOpacity
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingBottom: 5,
                      }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                        }}>
                        <Text
                          style={[
                            FONTS.fontBold,
                            { fontSize: 13, color: "white" },
                          ]}>
                          Ofertas
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.primary,
                        padding: 15,
                        borderRadius: 8,
                        alignItems: "center",
                      }}
                      onPress={() =>
                        navigation.navigate("MasVendido", {
                          subcategoryId: "MasVendido",
                          subcategoryName: "Más Vendido",
                        })
                      }>
                      <Text style={[FONTS.fontBold, { color: COLORS.white }]}>
                        Más Vendido
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.primary,
                        padding: 15,
                        borderRadius: 8,
                        alignItems: "center",
                      }}
                      onPress={() =>
                        navigation.navigate("Nuevo", {
                          subcategoryId: "Nuevo",
                          subcategoryName: "Nuevo",
                        })
                      }>
                      <Text style={[FONTS.fontBold, { color: COLORS.white }]}>
                        Nuevo
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.primary,
                        padding: 15,
                        borderRadius: 8,
                        alignItems: "center",
                      }}
                      onPress={() =>
                        navigation.navigate("Catalogo", {
                          subcategoryId: "catalogo",
                          subcategoryName: "Catálogo",
                        })
                      }>
                      <Text style={[FONTS.fontBold, { color: COLORS.white }]}>
                        Ver Catálogo
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>

          <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
            <View
              style={[
                GlobalStyleSheet.row,
                {
                  marginTop: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: COLORS.primaryLight,
                  marginBottom: 15,
                },
              ]}>
              {articles.map((article, index) => (
                <View
                  style={[
                    GlobalStyleSheet.col50,
                    {
                      marginBottom: 10,
                      paddingHorizontal: 0,
                      backgroundColor: colors.card,
                    },
                  ]}
                  key={article.id || index} // Usa `article.id` o el índice como clave
                >
                  <Cardstyle1
                    id={article.id.toString()}
                    title={article.name}
                    modelo={article.code}
                    price={article.price.toString()}
                    hascolor={true}
                    image={{ uri: `${BASE_URL}${article.highImage}` }}
                    onPress={() => navigateToProductDetails(article)}
                  />
                  <QuantityButton
                    item={article}
                    quantities={quantities}
                    setQuantities={setQuantities}
                    clienteId={clienteId} // Pasa el clienteId automáticamente
                    // showToast={showToast} // Pasa la función showToast
                    // addItemToCart={addItemToCart} // Pasa la función desde Home
                  />
                </View>
              ))}
            </View>
            {loading && (
              <ActivityIndicator size="large" color={COLORS.primary} />
            )}
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                padding: 15,
                borderRadius: 8,
                alignItems: "center",
                marginVertical: 20,
              }}
              onPress={loadMoreArticles}>
              <Text style={{ color: COLORS.white }}>Cargar más productos</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* <BottomSheet2 ref={moresheet2} /> */}
      </LinearGradient>
      {/* <Toast /> */}
    </View>
  );
});

export default Home;
