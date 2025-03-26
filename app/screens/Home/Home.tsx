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
import { useDispatch } from "react-redux";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mapea las rutas de las imágenes a las importaciones
// const images = {
//   "IMAGES.producto1": producto1,
//   "IMAGES.producto2": producto2,
//   "IMAGES.producto3": producto3,
//   "IMAGES.producto5": producto5,
//   "IMAGES.producto6": producto6,
//   "IMAGES.producto7": producto7,
//   "IMAGES.producto8": producto8,
//   "IMAGES.producto9": producto9,
//   "IMAGES.producto10": producto10,
//   "IMAGES.producto11": producto11,
//   "IMAGES.producto12": producto12,
//   "IMAGES.producto13": producto13,
//   "IMAGES.producto14": producto14,
//   "IMAGES.producto15": producto15,
//   "IMAGES.producto16": producto16,
//   "IMAGES.producto17": producto17,
//   "IMAGES.producto18": producto18,
//   "IMAGES.producto19": producto19,
// };

const bannerData = [
  {
    // image:IMAGES.banner1,
    title: "AirPods",
    text: "2nd generation",
    price: "$1259.00*",
    bottom: false,
  },
  {
    // image:IMAGES.banner3,
    title: "Shoes",
    text: "1nd generation",
    price: "$125.00*",
    bottom: true,
  },
  {
    // image:IMAGES.banner2,
    title: "AirPods",
    text: "3nd generation",
    price: "$1029.00*",
    bottom: true,
  },
];

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
  //   {
  //     title: "Deal of the day",
  //   },
  //   {
  //     title: "Hot Deals",
  //     image: true,
  //   },
  //   {
  //     title: "Best Sellers",
  //   },
  //   {
  //     title: "New Arrivals",
  //   },
];

const brandData = [
  {
    title: "Mobiles",
    image: IMAGES.item9,
  },
  {
    title: "Electronics",
    image: IMAGES.item10,
  },
  {
    title: "Camera",
    image: IMAGES.item11,
  },
  {
    title: "Headphone",
    image: IMAGES.item12,
  },
  {
    title: "TVs & LED",
    image: IMAGES.item13,
  },
  {
    title: "Furniture",
    image: IMAGES.item14,
  },
  {
    title: "Mobiles",
    image: IMAGES.item9,
  },
  {
    title: "Electronics",
    image: IMAGES.item10,
  },
  {
    title: "Camera",
    image: IMAGES.item11,
  },
  {
    title: "Headphone",
    image: IMAGES.item12,
  },
  {
    title: "TVs & LED",
    image: IMAGES.item13,
  },
  {
    title: "Furniture",
    image: IMAGES.item14,
  },
];

const absData = [
  {
    image: IMAGES.ads12,
  },
  // {
  //     image: IMAGES.ads3,
  // },
  // {
  //     image: IMAGES.ads2,
  // },
];
const marcas = [
  {
    image: IMAGES.marca,
    subcolor: "STEINMANN", // Identificador único para la marca
    name: "STEINMANN", // Nombre de la marca
  },
  {
    image: IMAGES.marca1,
    subcolor: "MASLEX",
    name: "Maslex",
  },
  {
    image: IMAGES.marca2,
    subcolor: "SECOP",
    name: "Secop",
  },
  {
    image: IMAGES.marca3,
    subcolor: "AMERICOLD",
    name: "Americold",
  },
];
const abs2Data = [
  {
    image: IMAGES.ads6,
  },
  {
    image: IMAGES.ads7,
  },
  {
    image: IMAGES.ads6,
  },
  {
    image: IMAGES.ads7,
  },
];

const abs3Data = [
  {
    image: IMAGES.ads9,
  },
  {
    image: IMAGES.ads10,
  },
  {
    image: IMAGES.ads11,
  },
];

const offerData = [
  {
    image: IMAGES.deliverytruck,
    title: "Free Shipping & Returns",
    text: "For all orders over $99",
  },
  {
    image: IMAGES.check3,
    title: "Secure Payment",
    text: "We ensure secure payment",
  },
  {
    image: IMAGES.savemoney,
    title: "Money Back Guarantee",
    text: "Any back within 30 days",
  },
  {
    image: IMAGES.technicalsupport,
    title: "Customer Support",
    text: "Call or email us 24/7",
  },
  {
    image: IMAGES.wallet2,
    title: "Flexible Payment",
    text: "Pay with Multiple Credit Card",
  },
];

const ArrivalData = [
  {
    image: IMAGES.item15,
    title: "Fashion",
  },
  {
    image: IMAGES.item16,
    title: "Beauty",
  },
  {
    image: IMAGES.item17,
    title: "Home",
  },
  {
    image: IMAGES.item20,
    title: "phone",
  },
  {
    image: IMAGES.item15,
    title: "Fashion",
  },
  {
    image: IMAGES.item16,
    title: "Beauty",
  },
  {
    image: IMAGES.item17,
    title: "Home",
  },
  {
    image: IMAGES.item20,
    title: "phone",
  },
];

const cardData = [
  {
    id: "0",
    image: IMAGES.item1,
    title: "APPLE iPhone 14 (Bluetooth)",
    price: "$199",
    discount: "$112",
    offer: "70% OFF",
    brand: "Apple",
    color: false,
    hascolor: true,
  },
  {
    id: "1",
    image: IMAGES.item2,
    title: "APPLE iPhone 11 (Bluetooth)",
    price: "$149",
    discount: "$114",
    offer: "50% OFF",
    brand: "Apple",
    color: false,
    hascolor: true,
  },
  {
    id: "2",
    image: IMAGES.item1,
    title: "APPLE iPhone 13 (Bluetooth)",
    price: "$139",
    discount: "$116",
    offer: "50% OFF",
    color: false,
    brand: "Apple",
    hascolor: true,
  },
  {
    id: "3",
    image: IMAGES.item2,
    title: "APPLE iPhone 15 (Bluetooth)",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    color: true,
    brand: "Apple",
    hascolor: true,
  },
];

const card2Data = [
  {
    id: "4",
    image: IMAGES.item3,
    title: "LG TurboWash Washing",
    price: "$199",
    discount: "$112",
    offer: "70% OFF",
    brand: "OLG",
    //color:false,
    hascolor: true,
  },
  {
    id: "5",
    image: IMAGES.item4,
    title: "KitchenAid 9-Cup Food",
    price: "$149",
    discount: "$114",
    offer: "50% OFF",
    brand: "Apple",
    //color:false,
    hascolor: true,
  },
  {
    id: "6",
    image: IMAGES.item5,
    title: "KitchenAid 9-mixer Food",
    price: "$199",
    discount: "$116",
    offer: "70% OFF",
    //color:false,
    brand: "OLG",
    hascolor: true,
  },
  {
    id: "7",
    image: IMAGES.item1,
    title: "APPLE iPhone 15 (Bluetooth)",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    //color:true,
    brand: "Apple",
    hascolor: true,
  },
];

// const card3Data = [
//   {
//     id: "8",
//     image: IMAGES.producto1,
//     title: "COMPRESOR AMERICOLD ALTA R134a 1/3 1213 WATTS 4142 BTU 115V",
//     price: "  75,12 € ",
//     // discount: "$112",
//     // offer: "70% OFF",
//     hascolor: true,
//   },
//   {
//     id: "9",
//     image: IMAGES.producto2,
//     title: "COMPRESOR AMERICOLD BAJA R134a 1/3 348 WATTS 1187 BTU 115V",
//     price: "  71,25 € ",
//     // discount: "$114",
//     // offer: "50% OFF",
//     hascolor: true,
//   },
//   {
//     id: "10",
//     image: IMAGES.producto3,
//     title:
//       "COMPRESOR AMERICOLD BAJA MEDIA ALTA R134a 1/3 1091BTU/-23.3C 4248BTU/7.2C 115V/127V",
//     price: "  79,61 € ",
//     // discount: "$114",
//     // offer: "50% OFF",
//     hascolor: true,
//   },
//   {
//     id: "11",
//     image: IMAGES.producto5,
//     title: "COMPRESOR SECOP 1/4 NF10FX 115V 1048BTU LMBP R134a",
//     price: "  0,05 € ",
//     // discount: "$114",
//     // offer: "50% OFF",
//     hascolor: true,
//   },
//   {
//     id: "12",
//     image: IMAGES.producto6,
//     title: "COMPRESOR SECOP 1/2HP 104G7555 115V/60HZ LMHBP R134a SC15G",
//     price: "  138,88 € ",
//     // discount: "$114",
//     // offer: "50% OFF",
//     hascolor: true,
//   },
//   {
//     id: "13",
//     image: IMAGES.producto7,
//     title: "COMPRESOR EMBRACO 1/5 EMIS70HHR 115V/60Hz L/M/HBP R134a 700BTU",
//     price: "  88,66 € ",
//     // discount: "$114",
//     // offer: "50% OFF",
//     hascolor: true,
//   },
//   {
//     id: "14",
//     image: IMAGES.producto8,
//     title: "COMPRESOR EMBRACO 1/4 FFUS70HAK 115V/60Hz L/MBP R134a 750BTU",
//     price: "  104,76 € ",
//     // discount: "$114",
//     // offer: "50% OFF",
//     hascolor: true,
//   },
//   {
//     id: "15",
//     image: IMAGES.producto9,
//     title: "COMPRESOR EMBRACO 1/4+ FFUS80HAK 115V/60Hz L/MBP R134a 807BTU",
//     price: "  100,21 € ",
//     // discount: "$114",
//     // offer: "50% OFF",
//     hascolor: true,
//   },
//   {
//     id: "16",
//     image: IMAGES.producto10,
//     title: "COMPRESOR EMBRACO 1/3 EGAS100HLR 115/60Hz LBP R134a 1.050BTU",
//     price: "  104,54 € ",
//     // discount: "$114",
//     // offer: "50% OFF",
//     hascolor: true,
//   },
//   {
//     id: "17",
//     image: IMAGES.producto11,
//     title:
//       "COMPRESOR EMBRACO 1/3+ FFI12HBX 115V/60Hz L/HBP R134a 1.190/5300BTU",
//     price: "  113,54 € ",
//     // discount: "$114",
//     // offer: "50% OFF",
//     hascolor: true,
//   },
//   {
//     id: "18",
//     image: IMAGES.producto12,
//     title: "FILTRO SECADOR 1/4 15 GRAMOS C/VALVULA DE GUSANILLO",
//     price: "  1,73 € ",
//     // discount: "$114",
//     // offer: "50% OFF",
//     hascolor: true,
//   },
//   {
//     id: "19",
//     image: IMAGES.producto13,
//     title: "FILTRO SECADOR 1/4 APPLIPARTS APFD-107 25GR ROSCABLE CON TUERCAS",
//     price: "  2,10 € ",
//     // discount: "$114",
//     // offer: "50% OFF",
//     hascolor: true,
//   },
// ];

const swiperimageData = [
  {
    image: IMAGES.product1,
    smallImage: IMAGES.product1,
  },
  {
    image: IMAGES.product2,
    smallImage: IMAGES.product2,
  },
  {
    image: IMAGES.product3,
    smallImage: IMAGES.product3,
  },
  {
    image: IMAGES.product4,
    smallImage: IMAGES.product4,
  },
];

type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;

const Home = ({ navigation }: HomeScreenProps) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // api
  useEffect(() => {
    const getArticles = async () => {
      try {
        setLoading(true);

        // Verificar si los artículos están en AsyncStorage
        const cachedArticles = await AsyncStorage.getItem("home_articles");

        if (cachedArticles) {
          // Si están en caché, cargarlos desde AsyncStorage
          setArticles(JSON.parse(cachedArticles));
        } else {
          // Si no están en caché, obtenerlos de la API
          const data = await fetchArticles(page);

          // Guardar en AsyncStorage para futuras solicitudes
          await AsyncStorage.setItem("home_articles", JSON.stringify(data));

          setArticles(data);
          setHasMore(data.length > 0);
        }
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

        // Obtener más artículos de la API
        const data = await fetchArticles(page + 1);

        // Actualizar los artículos y la página
        setArticles((prevArticles) => [...prevArticles, ...data]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(data.length > 0);

        // Actualizar el caché en AsyncStorage
        await AsyncStorage.setItem(
          "home_articles",
          JSON.stringify([...articles, ...data])
        );
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
  // api
  const dispatch = useDispatch();

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const addItemToWishList = (data: any) => {
    dispatch(addTowishList(data));
  };

  const incrementQuantity = (id: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 1) + 1,
    }));
  };

  const decrementQuantity = (id: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: prevQuantities[id] > 1 ? prevQuantities[id] - 1 : 1,
    }));
  };

  const addItemToCart = (item: any) => {
    const quantity = quantities[item.id] || 1;
    dispatch(addToCart({ ...item, quantity }));
    Toast.show({
      type: "success",
      text1: "¡Producto/s añadido a su carrito exitosamente!",
    });
  };

  const moresheet2 = useRef<any>(null);

  const [Select, setSelect] = useState(offerData[0]);

  const [currentSlide, setCurrentSlide] = useState(0);

  // const addItemToWishList = (data: any) => {
  //   dispatch(addTowishList(data));
  // };

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        colors={["#001A44", "#193561"]}
        style={{ height: undefined, width: "100%" }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              height: 40,
              backgroundColor: COLORS.primary,
              marginBottom: 20,
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
                  {/* <TouchableOpacity
                    style={{ margin: 5 }}
                    onPress={() => dispatch(openDrawer())}>
                    <Image
                      style={{
                        height: 22,
                        width: 22,
                        tintColor: COLORS.card,
                        resizeMode: "contain",
                      }}
                      source={IMAGES.grid5}
                    />
                  </TouchableOpacity> */}
                  <Image
                    style={{
                      resizeMode: "contain",
                      width: wp("30.5%"),
                      height: hp("5%"),
                    }}
                    source={IMAGES.appname}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: COLORS.card,
                      borderRadius: 18,
                      // paddingHorizontal: 10,
                    }}>
                    <View
                      style={{
                        transform: [{ rotate: "90deg" }],
                        marginLeft: wp("5%"),
                      }}>
                      <Feather
                        name="search"
                        size={hp("2.5%")}
                        color={COLORS.title}
                      />
                    </View>
                    <TextInput
                      placeholder="Buscar"
                      placeholderTextColor={COLORS.title}
                      style={{
                        backgroundColor: COLORS.card,
                        width: wp("35%"),
                        height: hp("4%"),
                        borderRadius: 18,
                        paddingLeft: wp("2.5%"),
                        color: COLORS.title,
                        fontSize: hp("2%"),
                      }}
                    />
 
                  </View>
                  {/* <TouchableOpacity
                    //onPress={() => navigation.navigate('Notification')}
                    onPress={() => moresheet2.current.openSheet("notification")}
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
                        height: 20,
                        width: 20,
                        tintColor: COLORS.card,
                        resizeMode: "contain",
                      }}
                      source={IMAGES.ball}
                    />
                  </TouchableOpacity> */}
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
              source={require("../../assets/images/carousel/slide1.png")}
            />
            <Image
              style={{
                height: 200,
                width: "100%",
                //aspectRatio:1/1,
                resizeMode: "contain",
              }}
              source={require("../../assets/images/carousel/slide1.png")}
            />
            <Image
              style={{
                height: 200,
                width: "100%",
                //aspectRatio:1/1,
                resizeMode: "contain",
              }}
              source={require("../../assets/images/carousel/slide1.png")}
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
                  {marcas.map((data, index) => (
                    <View
                      key={index}
                      style={{ marginRight: 10, marginVertical: 15 }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("ProductsMarcas", {
                            subcolor: data.subcolor.trim(), // Pasa el identificador de la marca
                            subcategoryName: data.name, // Pasa el nombre de la marca
                          })
                        }>
                        <Image
                          style={{ width: 95, height: 20 }}
                          source={data.image}
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
                { padding: 10, paddingHorizontal: 0 },
              ]}>
              <View style={{}}>
                <ScrollView
                  // horizontal
                  contentContainerStyle={{ paddingHorizontal: 10, flexGrow: 1 }}
                  showsHorizontalScrollIndicator={true}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 60,
                    }}>
                    {PopoulerData.map((data: any, index) => {
                      const isSelected = selectedCategory === data.title;
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => setSelectedCategory(data.title)}
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                            paddingBottom: 5,
                            borderBottomWidth: isSelected ? 2 : 0,
                            borderBottomColor: isSelected
                              ? "white"
                              : "transparent",
                          }}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 5,
                            }}>
                            {data.image ? (
                              <Image
                                style={{
                                  height: 16,
                                  width: 16,
                                  resizeMode: "contain",
                                }}
                                source={IMAGES.fire}
                              />
                            ) : null}
                            <Text
                              style={[
                                FONTS.fontBold,
                                { fontSize: 13, color: "white" },
                              ]}>
                              {data.title}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
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
              ]}
            >
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
