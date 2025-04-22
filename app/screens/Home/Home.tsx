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
// api articulos
import QuantityButton from "../Components/QuantityButton"; 
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// buscador
import SearchArticles from "../Components/SearchArticles";
// buscador
 

const PopoulerData = [
  {
    title: "Ofertas",
  },
  {
    title: "Más vendidos",
    image: true,
  },
  {
    title: "Nuevo",
  },
  {
    title: "Catálogo",
  }, 
];
 
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
          console.log("Cliente ID restaurado desde AsyncStorage:", storedClienteId);
          dispatch(setClienteId(parseInt(storedClienteId, 10))); // Restaura el clienteId en Redux
        }
      } catch (error) {
        console.error("Error al restaurar el clienteId:", error);
      }
    };

    restoreClienteId();
  }, []);
  // api
  useEffect(() => {
    const getArticles = async () => {
      try {
        setLoading(true);

        // Obtener los artículos directamente de la API
        const data = await fetchArticles(page);

        setArticles(data);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error("Error al obtener los artículos:", error);
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, [page]);

  const loadMoreArticles = async () => {
    if (hasMore) {
      try {
        setLoading(true);

        // Obtener más artículos directamente de la API
        const data = await fetchArticles(page + 1);

        setArticles((prevArticles) => [...prevArticles, ...data]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error("Error al cargar más artículos:", error);
      } finally {
        setLoading(false);
      }
    }
  };

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

                <SearchArticles />
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
            {/* {bannerData.map((data: any, index) => {
              return (
                <LinearGradient
                  key={index}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  colors={["#001A44", "#193561"]}
                  style={{ height: undefined, width: "100%" }}>
                  <View
                    style={[
                      GlobalStyleSheet.container,
                      { paddingHorizontal: 30, overflow: "hidden" },
                    ]}>
                    <View style={GlobalStyleSheet.row}>
                      <View
                        style={[
                          GlobalStyleSheet.col50,
                          { alignSelf: "center", zIndex: 25 },
                        ]}>
                        <View style={{ paddingVertical: 10 }}>
                          <Text
                            style={[
                              FONTS.fontSemiBold,
                              { fontSize: 35, color: "#fff" },
                            ]}>
                            {data.title}
                          </Text>
                          <Text
                            style={[
                              FONTS.fontSemiBold,
                              {
                                fontSize: 16,
                                color: COLORS.secondary,
                                marginTop: -5,
                              },
                            ]}>
                            {data.text}
                          </Text>
                          <Text
                            style={[
                              FONTS.fontSemiBold,
                              {
                                fontSize: 16,
                                color: COLORS.white,
                                marginTop: 10,
                              },
                            ]}>
                            {data.price}*
                          </Text>
                          <View style={{ width: "55%", marginTop: 15 }}>
                            <Button
                              title="Buy Now"
                              size={"sm"}
                              color={COLORS.white}
                              text={COLORS.title}
                              onPress={() =>
                                navigation.navigate("ProductsDetails")
                              }
                            />
                          </View>
                        </View>
                      </View>
                      <View style={[GlobalStyleSheet.col50, {}]}>
                        <View
                          style={{
                            marginTop: -15,
                            marginBottom: -15,
                            marginLeft: -15,
                            marginRight: -15,
                            position: "absolute",
                            alignItems: "center",
                            bottom: data.bottom ? -10 : -50,
                            right: 15,
                            zIndex: 30,
                          }}>
                          <Image
                            style={{
                              height: 200,
                              width: 150,
                              //aspectRatio:1/1,
                              //resizeMode:'contain'
                            }}
                            source={data.image}
                          />
                        </View>
                      </View>
                    </View>
                    <View
                      style={{ position: "absolute", right: -90, top: -100 }}>
                      <Image
                        style={{
                          height: undefined,
                          width: "100%",
                          aspectRatio: 1 / 0.8,
                          resizeMode: "contain",
                        }}
                        source={IMAGES.bannerborder2}
                      />
                    </View>
                    <View
                      style={{
                        position: "absolute",
                        bottom: -100,
                        left: -130,
                      }}>
                      <Image
                        style={{
                          height: undefined,
                          width: "100%",
                          aspectRatio: 1 / 0.5,
                          resizeMode: "contain",
                        }}
                        source={IMAGES.bannerborder1}
                      />
                    </View>
                  </View>
                </LinearGradient>
              );
            })} */}
          </Swiper>
          {/* <View style={[GlobalStyleSheet.container, { paddingVertical: 0 }]}>
            <View style={{ marginHorizontal: -15, marginVertical: 10 }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Category", { initialIndex: 0 })
                }>
                <Image
                  style={{ width: "100%", height: 165 }}
                  source={require("../../assets/images/home/lineablanca.png")}
                  resizeMode="stretch"
                />
              </TouchableOpacity>
            </View>
          </View> */}
          {/* <View
            style={[
              {
                paddingVertical: 0,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              },
            ]}>
            <View style={{ marginHorizontal: 0, marginVertical: 0 }}>
              <ScrollView contentContainerStyle={{ width: "100%" }}>
                {absData.map((data, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          width: "100%",
                          height: 150,
                        }}>
                        <TouchableOpacity
                          style={{
                            width: "40%",
                            height: "100%",
                            marginRight: 10,
                          }}
                          onPress={() =>
                            navigation.navigate("Category", { initialIndex: 1 })
                          } // Cambia el índice según la pestaña deseada
                        >
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 20,
                            }}
                            source={IMAGES.ads12}
                            resizeMode="stretch"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{ width: "60%", height: "100%" }}
                          onPress={() =>
                            navigation.navigate("Category", { initialIndex: 2 })
                          } // Cambia el índice según la pestaña deseada
                        >
                          <Image
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: 20,
                            }}
                            source={IMAGES.ads13}
                            resizeMode="stretch"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View> */}
          <View style={[GlobalStyleSheet.container, { paddingVertical: 0 }]}>
            <View style={{ marginHorizontal: -0, marginVertical: 10 }}>
              <View
                style={{
                  borderTopColor: "white",
                  borderBottomColor: "white",
                  borderTopWidth: 3,
                  borderBottomWidth: 3,
                }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{}}>
                  {marcas.map((marca, index) => (
                    <View
                      key={index}
                      style={{ marginRight: 10, marginVertical: 15 }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigateToProductsMarcas(marca.brand, marca.name)
                        }>
                        <Image
                          style={{ width: 95, height: 20 }}
                          source={marca.image}
                          resizeMode="stretch"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
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
                          Oferta
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
                    image={{ uri: `http://10.0.2.2:8000${article.highImage}` }}
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
