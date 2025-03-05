import React, { useRef, useState } from "react";
//import { Ionicons } from '@expo/vector-icons';
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
import { useDispatch } from "react-redux";
import data from "../../data/data.json";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import Toast from "react-native-toast-message";
import { addToCart } from "../../redux/reducer/cartReducer";
import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Importa las imágenes
import producto1 from "../../assets/images/producto/item.webp";
import producto2 from "../../assets/images/producto/item1.webp";
import producto3 from "../../assets/images/producto/item2.png";
import producto5 from "../../assets/images/producto/item3.jpg";
import producto6 from "../../assets/images/producto/item4.webp";
import producto7 from "../../assets/images/producto/item5.webp";
import producto8 from "../../assets/images/producto/item6.webp";
import producto9 from "../../assets/images/producto/item7.webp";
import producto10 from "../../assets/images/producto/item8.jpg";
import producto11 from "../../assets/images/producto/item9.webp";
import producto12 from "../../assets/images/producto/item11.webp";
import producto13 from "../../assets/images/producto/item12.webp";
import producto14 from "../../assets/images/producto/item13.jpg";
import producto15 from "../../assets/images/producto/item14.webp";
import producto16 from "../../assets/images/producto/item15.png";
import producto17 from "../../assets/images/producto/item16.webp";
import producto18 from "../../assets/images/producto/item17.webp";
import producto19 from "../../assets/images/producto/item18.jpg";

// Mapea las rutas de las imágenes a las importaciones
const images = {
  "IMAGES.producto1": producto1,
  "IMAGES.producto2": producto2,
  "IMAGES.producto3": producto3,
  "IMAGES.producto5": producto5,
  "IMAGES.producto6": producto6,
  "IMAGES.producto7": producto7,
  "IMAGES.producto8": producto8,
  "IMAGES.producto9": producto9,
  "IMAGES.producto10": producto10,
  "IMAGES.producto11": producto11,
  "IMAGES.producto12": producto12,
  "IMAGES.producto13": producto13,
  "IMAGES.producto14": producto14,
  "IMAGES.producto15": producto15,
  "IMAGES.producto16": producto16,
  "IMAGES.producto17": producto17,
  "IMAGES.producto18": producto18,
  "IMAGES.producto19": producto19,
};

const sliderData = [
  {
    title: "Crazy Deals",
  },
  {
    title: "Budget Buys",
  },
  {
    title: "Best Offer",
  },
  {
    title: "Woman",
  },
  {
    title: "Dress",
  },
  {
    title: "unisex",
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

const cardgridData = [
  {
    id: "8",
    image: IMAGES.producto1,
    title: "COMPRESOR AMERICOLD ALTA R134a 1/3 1213 WATTS 4142 BTU 115V",
    price: "  75,12 € ",
    // discount: "$112",
    // offer: "70% OFF",
    hascolor: true,
  },
  {
    id: "9",
    image: IMAGES.producto2,
    title: "COMPRESOR AMERICOLD BAJA R134a 1/3 348 WATTS 1187 BTU 115V",
    price: "  71,25 € ",
    // discount: "$114",
    // offer: "50% OFF",
    hascolor: true,
  },
  {
    id: "10",
    image: IMAGES.producto3,
    title:
      "COMPRESOR AMERICOLD BAJA MEDIA ALTA R134a 1/3 1091BTU/-23.3C 4248BTU/7.2C 115V/127V",
    price: "  79,61 € ",
    // discount: "$114",
    // offer: "50% OFF",
    hascolor: true,
  },
  {
    id: "11",
    image: IMAGES.producto5,
    title: "COMPRESOR SECOP 1/4 NF10FX 115V 1048BTU LMBP R134a",
    price: "  0,05 € ",
    // discount: "$114",
    // offer: "50% OFF",
    hascolor: true,
  },
  {
    id: "12",
    image: IMAGES.producto6,
    title: "COMPRESOR SECOP 1/2HP 104G7555 115V/60HZ LMHBP R134a SC15G",
    price: "  138,88 € ",
    // discount: "$114",
    // offer: "50% OFF",
    hascolor: true,
  },
  {
    id: "13",
    image: IMAGES.producto7,
    title: "COMPRESOR EMBRACO 1/5 EMIS70HHR 115V/60Hz L/M/HBP R134a 700BTU",
    price: "  88,66 € ",
    // discount: "$114",
    // offer: "50% OFF",
    hascolor: true,
  },
  {
    id: "14",
    image: IMAGES.producto8,
    title: "COMPRESOR EMBRACO 1/4 FFUS70HAK 115V/60Hz L/MBP R134a 750BTU",
    price: "  104,76 € ",
    // discount: "$114",
    // offer: "50% OFF",
    hascolor: true,
  },
  {
    id: "15",
    image: IMAGES.producto9,
    title: "COMPRESOR EMBRACO 1/4+ FFUS80HAK 115V/60Hz L/MBP R134a 807BTU",
    price: "  100,21 € ",
    // discount: "$114",
    // offer: "50% OFF",
    hascolor: true,
  },
  {
    id: "16",
    image: IMAGES.producto10,
    title: "COMPRESOR EMBRACO 1/3 EGAS100HLR 115/60Hz LBP R134a 1.050BTU",
    price: "  104,54 € ",
    // discount: "$114",
    // offer: "50% OFF",
    hascolor: true,
  },
  {
    id: "17",
    image: IMAGES.producto11,
    title:
      "COMPRESOR EMBRACO 1/3+ FFI12HBX 115V/60Hz L/HBP R134a 1.190/5300BTU",
    price: "  113,54 € ",
    // discount: "$114",
    // offer: "50% OFF",
    hascolor: true,
  },
  {
    id: "18",
    image: IMAGES.producto12,
    title: "FILTRO SECADOR 1/4 15 GRAMOS C/VALVULA DE GUSANILLO",
    price: "  1,73 € ",
    // discount: "$114",
    // offer: "50% OFF",
    hascolor: true,
  },
  {
    id: "19",
    image: IMAGES.producto13,
    title: "FILTRO SECADOR 1/4 APPLIPARTS APFD-107 25GR ROSCABLE CON TUERCAS",
    price: "  2,10 € ",
    // discount: "$114",
    // offer: "50% OFF",
    hascolor: true,
  },
];

const cardgrid2Data = [
  {
    id: "34",
    image: IMAGES.item05,
    title: "Polka dot wrap blouse dress",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
  {
    id: "35",
    image: IMAGES.item06,
    title: "Pleated high-waisted is",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
  {
    id: "36",
    image: IMAGES.item07,
    title: "LG TurboWash Washing for",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
  {
    id: "37",
    image: IMAGES.item08,
    title: "Ergonomic Office Chair",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
];
const cardgrid3Data = [
  {
    id: "38",
    image: IMAGES.item09,
    title: "APPLE iPhone 14 (Bluetooth)",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
  {
    id: "39",
    image: IMAGES.item010,
    title: "KitchenAid 9-Cup Food and",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
  {
    id: "40",
    image: IMAGES.item011,
    title: "Engraved Metal Money is",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
  {
    id: "41",
    image: IMAGES.item012,
    title: "OnePlus Bullets EyeBuds",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
];

const CardlistData = [
  {
    image: IMAGES.item9,
    title: "Echo Vibe Urban Runners",
    price: "$179",
    delevery: "FREE Delivery",
    discount: "$112",
    offer: "40% OFF",
    brand: "Apple",
  },
  {
    image: IMAGES.item10,
    title: "Swift Glide Sprinter Soles",
    price: "$199",
    delevery: "FREE Delivery",
    discount: "$110",
    offer: "40% OFF",
    brand: "OLG",
  },
];

const Cardlist2Data = [
  {
    image: IMAGES.item06,
    brand: "SKY",
    title: "Pleated high-waisted is",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
  {
    image: IMAGES.item07,
    title: "LG TurboWash Washing for",
    brand: "OLG",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
];
const Cardlist3Data = [
  {
    image: IMAGES.item09,
    brand: "Apple",
    title: "APPLE iPhone 14 (Bluetooth)",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
  {
    image: IMAGES.item010,
    brand: "Apple",
    title: "KitchenAid 9-Cup Food and",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
  {
    image: IMAGES.item011,
    brand: "Whp",
    title: "Engraved Metal Money is",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
  {
    image: IMAGES.item012,
    brand: "Vivo",
    title: "OnePlus Bullets EyeBuds",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    hascolor: true,
  },
];

type ProductsScreenProps = StackScreenProps<RootStackParamList, "Products">;

const Products = ({ navigation, route }: ProductsScreenProps) => {
  const { categoryId, categoryName } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [show, setShow] = useState(true);
  const sheetRef = useRef<any>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Filtrar los datos según el categoryId
  let filteredData = [];
  if (categoryId === "1") {
    filteredData = data.filter((item) => item.category === "compresor");
  } else if (categoryId === "2") {
    filteredData = data.filter(
      (item) =>
        item.category === "refrigeracion" &&
        item.subCategory === "Filtros Secadores"
    );
  } else if (categoryId === "3") {
    filteredData = data.filter((item) => item.category === "Herramientas");
  }

  const addItemToWishList = (data: any) => {
    dispatch(addTowishList(data));
  };

  const addItemToCart = (item: any) => {
    const quantity = quantities[item.id] || 1;
    dispatch(addToCart({ ...item, quantity }));
    Toast.show({
      type: "success",
      text1: "¡Producto/s añadido a su carrito exitosamente!",
    });
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

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title={categoryName} // Usa el nombre de la categoría aquí
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
            // onPress={() => sheetRef.current.openSheet("filter")}
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
              FILTRO
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
              source={IMAGES.list}
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
              source={IMAGES.grid}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        {/* <View
          style={[
            GlobalStyleSheet.container,
            { paddingHorizontal: 0, paddingTop: 15, paddingBottom: 0 },
          ]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginRight: 10,
              }}>
              {ArrivalData.map((data: any, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate("ProductsDetails")}
                    key={index}
                    style={{
                      backgroundColor: colors.card,
                      height: 35,
                      alignItems: "center",
                      gap: 5,
                      //justifyContent: 'center',
                      flexDirection: "row",
                      borderRadius: 34,
                      borderWidth: 1,
                      borderColor: colors.text,
                      //marginTop: 10,
                      paddingHorizontal: 5,
                      paddingVertical: 5,
                      overflow: "hidden",
                    }}>
                    <Image
                      style={{ width: 44, height: 45, resizeMode: "contain" }}
                      source={data.image}
                    />
                    <Text
                      style={{
                        ...FONTS.fontMedium,
                        fontSize: 13,
                        color: colors.title,
                      }}>
                      {data.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View> */}
        <View
          style={[
            GlobalStyleSheet.container,
            { paddingTop: 15, paddingHorizontal: 0 },
          ]}>
          <View>
            {show ? (
              <View style={{}}>
                <View style={[GlobalStyleSheet.row]}>
                  {filteredData.map((data: any, index) => (
                    <View
                      key={index}
                      style={[
                        GlobalStyleSheet.col50,
                        {
                          marginBottom: 10,
                          paddingHorizontal: 0,
                          backgroundColor: colors.card,
                        },
                      ]}>
                      <Cardstyle1
                        id={data.id}
                        title={data.title}
                        image={images[data.image]} // Usa el objeto images para obtener la imagen
                        modelo={data.modelo}
                        price={data.price}
                        color={data.color}
                        offer={data.offer}
                        hascolor={data.hascolor}
                        discount={data.discount}
                        borderTop
                        onPress={() =>
                          navigation.navigate("ProductsDetails", {
                            productId: data.id,
                          })
                        } // Pasa el productId aquí
                        onPress3={() => addItemToWishList(data)}
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          marginBottom: hp("0.4%"),
                          // marginHorizontal: wp('2.5%'),
                          paddingRight: wp("2.5%"),
                          borderRightWidth: 1,
                          borderRightColor: COLORS.primaryLight,
                          width: "100%",
                        }}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: COLORS.light,
                            borderRadius: 10,
                            height: hp("4.0%"),
                          }}>
                          <TouchableOpacity
                            onPress={() => decrementQuantity(data.id)}
                            style={{ paddingHorizontal: wp("2.10%") }}>
                            <Text style={{ fontSize: hp("2.25%") }}>-</Text>
                          </TouchableOpacity>
                          <Text
                            style={{
                              fontSize: hp("2%"),
                              marginHorizontal: wp("1%"),
                              fontWeight: "bold",
                            }}>
                            {quantities[data.id] || 1}
                          </Text>
                          <TouchableOpacity
                            onPress={() => incrementQuantity(data.id)}
                            style={{ paddingHorizontal: wp("2.10%") }}>
                            <Text style={{ fontSize: hp("2.25%") }}>+</Text>
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          <TouchableOpacity
                            onPress={() => addItemToCart(data)}
                            style={{
                              marginLeft: wp("2.0%"),
                              marginRight: wp("2.0%"),
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#001A44",
                              padding: hp("0.625%"),
                              borderRadius: 10,
                              paddingHorizontal: wp("2.5%"),
                              height: hp("4.0%"),
                            }}>
                            <FontAwesome
                              name="cart-shopping"
                              size={hp("1.8%")}
                              color={COLORS.white}
                              style={{ marginRight: wp("2.5%") }}
                            />
                            <Text
                              style={[
                                FONTS.fontMedium,
                                {
                                  fontSize: hp("1.9%"),
                                  color: "white",
                                  position: "relative",
                                  top: -2,
                                },
                              ]}>
                              Añadir
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
                {/* <View style={{paddingVertical:5}}>
                                    <Image
                                        style={{width:'100%',height:undefined,aspectRatio:1/.3,resizeMode:'contain'}}
                                        source={IMAGES.ads4}
                                    />
                                </View> */}
                {/* <View style={[GlobalStyleSheet.row]}>
                                    {cardgrid2Data.map((data:any, index) => {
                                        return (
                                            <View key={index} style={[GlobalStyleSheet.col50, { paddingHorizontal:0 }]}>
                                                <Cardstyle1
                                                    id={data.id}
                                                    title={data.title}
                                                    image={data.image}
                                                    price={data.price}
                                                    color={data.color}
                                                    offer={data.offer}
                                                    hascolor={data.hascolor}
                                                    discount={data.discount}
                                                    borderTop
                                                    onPress={() => navigation.navigate('ProductsDetails')}
                                                    onPress3={() => addItemToWishList(data)}
                                                />
                                            </View>
                                        )
                                    })}   
                                </View> */}
                {/* <View style={[{ paddingTop:5,paddingBottom:0 ,}]}>
                                    <View style={{ marginHorizontal: -15, marginBottom: 10,paddingHorizontal:15 }}>
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ paddingHorizontal: 15}}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                                                {sliderData.map((data, index) => {
                                                    return (
                                                        <TouchableOpacity
                                                            onPress={() => navigation.navigate('ProductsDetails')}
                                                            activeOpacity={0.5}
                                                            key={index}
                                                            style={{
                                                                backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)': colors.card,
                                                                height: 40,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                //borderRadius: 8,
                                                                //borderWidth: 1,
                                                                //borderColor: theme.dark ? COLORS.white : colors.borderColor,
                                                                marginTop: 5,
                                                                paddingHorizontal: 15,
                                                                paddingVertical: 5
                                                            }}>
                                                            <Text style={{ ...FONTS.fontMedium, fontSize: 13, color: colors.title }}>{data.title}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })}
                                            </View>
                                        </ScrollView>
                                    </View>
                                </View> */}
                {/* <View style={[GlobalStyleSheet.row]}>
                                    {cardgrid3Data.map((data:any, index) => {
                                        return (
                                            <View key={index} style={[GlobalStyleSheet.col50, { paddingHorizontal:0 }]}>
                                                <Cardstyle1
                                                    id={data.id}
                                                    title={data.title}
                                                    image={data.image}
                                                    price={data.price}
                                                    color={data.color}
                                                    offer={data.offer}
                                                    hascolor={data.hascolor}
                                                    discount={data.discount}
                                                    borderTop
                                                    onPress={() => navigation.navigate('ProductsDetails')}
                                                    onPress3={() => addItemToWishList(data)}
                                                />
                                            </View>
                                        )
                                    })}   
                                </View> */}
              </View>
            ) : (
              <View style={{}}>
                {/* <View style={[{}]}>
                                    {CardlistData.map((data:any, index) => {
                                        return (
                                            <View key={index} style={{marginBottom:10}}>
                                                <Cardstyle2
                                                    title={data.title}
                                                    price={data.price}
                                                    delevery={data.delevery}
                                                    image={data.image}
                                                    offer={data.offer}
                                                    removebottom
                                                    discount={data.discount}
                                                    brand={data.brand}
                                                    onPress={() => navigation.navigate('ProductsDetails')}
                                                />
                                            </View>
                                        )
                                    })}
                                </View> */}
                {/* <View style={{paddingVertical:0,marginTop:-10,marginBottom:0}}>
                                    <Image
                                        style={{width:'100%',height:undefined,aspectRatio:1/.3,resizeMode:'contain'}}
                                        source={IMAGES.ads4}
                                    />
                                </View> */}
                {/* <View style={[{}]}>
                                    {Cardlist2Data.map((data:any, index) => {
                                        return (
                                            <View key={index} style={{marginBottom:10}}>
                                                <Cardstyle2
                                                    title={data.title}
                                                    price={data.price}
                                                    delevery={data.delevery}
                                                    image={data.image}
                                                    offer={data.offer}
                                                    removebottom
                                                    discount={data.discount}
                                                    brand={data.brand}
                                                    onPress={() => navigation.navigate('ProductsDetails')}
                                                />
                                            </View>
                                        )
                                    })}
                                </View> */}
                {/* <View style={[{ paddingTop:0,paddingBottom:0 ,}]}>
                                    <View style={{ marginHorizontal: -15, marginBottom: 15,paddingHorizontal:15 }}>
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ paddingHorizontal: 15}}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                                                {sliderData.map((data, index) => {
                                                    return (
                                                        <TouchableOpacity
                                                            activeOpacity={0.5}
                                                            key={index}
                                                            style={{
                                                                backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)': colors.card,
                                                                height: 40,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                //borderRadius: 8,
                                                                //borderWidth: 1,
                                                                //borderColor: theme.dark ? COLORS.white : colors.borderColor,
                                                                marginTop: 5,
                                                                paddingHorizontal: 15,
                                                                paddingVertical: 5
                                                            }}>
                                                            <Text style={{ ...FONTS.fontMedium, fontSize: 13, color: colors.title }}>{data.title}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })}
                                            </View>
                                        </ScrollView>
                                    </View>
                                </View> */}
                {/* <View style={[{}]}>
                                    {Cardlist3Data.map((data:any, index) => {
                                        return (
                                            <View key={index} style={{marginBottom:10}}>
                                                <Cardstyle2
                                                    title={data.title}
                                                    price={data.price}
                                                    delevery={data.delevery}
                                                    image={data.image}
                                                    offer={data.offer}
                                                    removebottom
                                                    discount={data.discount}
                                                    brand={data.brand}
                                                    onPress={() => navigation.navigate('ProductsDetails')}
                                                />
                                            </View>
                                        )
                                    })}
                                </View> */}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
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

export default Products;
