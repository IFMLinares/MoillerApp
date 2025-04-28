import React, { useRef, useState, useEffect } from "react";
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
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import Feather from "react-native-vector-icons/Feather";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { addToCart } from "../../redux/reducer/cartReducer";
import { Dimensions } from "react-native";
// api articulos
import { fetchArticles } from "../../api/authApi";
import { BASE_URL } from "../../api/globalUrlApi"; // Importar la URL base
// api articulos
import QuantityButton from "../Components/QuantityButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// buscador
import SearchArticles from "../Components/SearchArticles";
// buscador

const marcas = [
  {
    image: IMAGES.marca,
    brand: "STEINMANN", // Identificador único para la marca
    name: "STEINMANN", // Nombre de la marca
  },
  {
    image: IMAGES.marca1,
    brand: "MASLEX",
    name: "Maslex",
  },
  {
    image: IMAGES.marca2,
    brand: "SECOP",
    name: "Secop",
  },
  {
    image: IMAGES.marca3,
    brand: "AMERICOLD",
    name: "Americold",
  },
];

type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;

const Home = ({ navigation }: HomeScreenProps) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const clienteId = useSelector((state) => state.user.clienteId); // Obtén el clienteId desde Redux
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId

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

  const navigateToProductDetails = (product) => {
    navigation.navigate("ProductsDetails", { product });
  };

  const navigateToProductsMarcas = (brand: string, brandName: string) => {
    navigation.navigate("ProductsMarcas", { brandId: brand, brandName });
  };
  // api
  const dispatch = useDispatch();

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const addItemToWishList = (data: any) => {
    dispatch(addTowishList(data));
  };

  const moresheet2 = useRef<any>(null);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        colors={["#001A44", "#193561"]}
        style={{ height: undefined, width: "100%" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}>
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
            <Image
              style={{
                height: 200,
                width: "100%",
                // aspectRatio:1/1,
                resizeMode: "contain",
              }}
              source={require("../../assets/images/carousel/AMERICOLD.png")}
            />
            <Image
              style={{
                height: 200,
                width: "100%",
                //aspectRatio:1/1,
                resizeMode: "contain",
              }}
              source={require("../../assets/images/carousel/SECOP.png")}
            />
            <Image
              style={{
                height: 200,
                width: "100%",
                //aspectRatio:1/1,
                resizeMode: "contain",
              }}
              source={require("../../assets/images/carousel/STEINMANN.png")}
            />
          </Swiper>

          <View style={[GlobalStyleSheet.container, { paddingVertical: 0 }]}>
            <View style={{ marginHorizontal: 0, marginVertical: 10 }}>
              <View
                style={{
                  borderTopColor: "white",
                  borderBottomColor: "white",
                  borderTopWidth: 3,
                  borderBottomWidth: 3,
                  flexDirection: "row", // Asegura que las imágenes estén en fila
                  flexWrap: "wrap", // Permite que las imágenes pasen a la siguiente línea si no caben
                  justifyContent: "space-between", // Espaciado uniforme entre las imágenes
                  paddingVertical: 15,
                }}>
                {marcas.map((marca, index) => (
                  <TouchableOpacity
                    key={index}
                    // style={{ marginBottom: hp('2%') }} // Margen inferior adaptado al dispositivo
                    onPress={() =>
                      navigateToProductsMarcas(marca.brand, marca.name)
                    }>
                    <Image
                      style={{
                        width: wp("20%"), // Ancho adaptado al 20% del ancho del dispositivo
                        height: hp("2.5%"), // Alto adaptado al 5% del alto del dispositivo
                      }}
                      source={marca.image}
                      resizeMode="stretch"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

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
                          Más vendidos
                        </Text>
                      </View>
                    </TouchableOpacity>
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
                          Nuevo
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
                    id={article.id}
                    title={article.name}
                    modelo={article.code}
                    price={article.price}
                    hascolor={true}
                    image={{ uri: `${BASE_URL}${article.highImage}` }}
                    onPress={() => navigateToProductDetails(article)}
                    onPress3={() => addItemToWishList(article)}
                  />
                  <QuantityButton
                    item={article}
                    quantities={quantities}
                    setQuantities={setQuantities}
                    clienteId={clienteId} // Pasa el clienteId automáticamente
                  />
                </View>
              ))}
            </View>
            {loading && (
              <ActivityIndicator size="large" color={COLORS.primary} />
            )}
          </View>
        </ScrollView>
        <BottomSheet2 ref={moresheet2} />
      </LinearGradient>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

export default Home;
