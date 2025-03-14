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
import { fetchArticles } from "../../api/listSubCategoryApi";
import QuantityButton from "../Components/QuantityButton";
import QuantityButton2 from "../Components/QuantityButton2";

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
  const { subcategoryId, subcategoryName } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors } = theme;
  const [show, setShow] = useState(true);
  const [articles, setArticles] = useState([]);
  const [quantities, setQuantities] = useState({});
  const sheetRef = useRef<any>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const fetchedArticles = await fetchArticles(subcategoryName);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    loadArticles();
  }, [subcategoryName]);

 
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
      />

    </View>
  );

  // fatlist card2

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title={subcategoryName} // Usa el nombre de la categoría aquí
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

      <View
        style={[
          GlobalStyleSheet.container,
          { paddingTop: 15, paddingHorizontal: 0 },
        ]}>
        <View>
          {show ? (
            <FlatList
              data={articles}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 20 }}
              numColumns={2}
            />
          ) : (
            <FlatList
              data={articles}
              renderItem={renderItem2}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingBottom: 20 }}
              key={show ? "grid" : "list"} // Cambia la clave aquí
            />
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

export default Products;
