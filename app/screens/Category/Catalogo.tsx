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
import { fetchArticles } from "../../api/listCatalogoApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QuantityButton from "../Components/QuantityButton";
import QuantityButton2 from "../Components/QuantityButton2";

 

type ProductsScreenProps = StackScreenProps<RootStackParamList, "Catalogo">;

const Catalogo = ({ navigation, route }: ProductsScreenProps) => {
  const { subcategoryName } = route.params;
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors } = theme;
  const [show, setShow] = useState(false);
  const [articles, setArticles] = useState([]);
  const [quantities, setQuantities] = useState({});
  const sheetRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Estado para el indicador de carga

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);

        // Intentar cargar los productos desde AsyncStorage
        const cachedArticles = await AsyncStorage.getItem("cachedArticles");

        if (cachedArticles) {
          // Si hay datos en AsyncStorage, cargarlos
          setArticles(JSON.parse(cachedArticles));
          setIsLoading(false);
        }

        // Realizar la solicitud a la API para obtener los productos más recientes
        const fetchedArticles = await fetchArticles();

        // Ordenar los artículos alfabéticamente por nombre
        fetchedArticles.sort((a, b) => a.name.localeCompare(b.name));

        // Guardar los productos en el estado y en AsyncStorage
        setArticles(fetchedArticles);
        await AsyncStorage.setItem(
          "cachedArticles",
          JSON.stringify(fetchedArticles)
        );
      } catch (error) {
        console.error("Error fetching articles:", error);
        Toast.show({
          type: "error",
          text1: "Error al cargar los productos",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);
 
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
        title={subcategoryName} // Usa el nombre de la subcategoría aquí
        leftIcon="back"
        titleLeft
        // rightIcon1={"search"}
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
        ]}
      >
        <View
          style={[
            GlobalStyleSheet.container,
            {
              padding: 0,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => sheetRef.current.openSheet("short")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              width: "35%",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ height: 16, width: 16, resizeMode: "contain" }}
              source={IMAGES.list2}
            />
            <Text
              style={[FONTS.fontMedium, { fontSize: 15, color: colors.title }]}
            >
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
            }}
          >
            <Image
              style={{ height: 16, width: 16, resizeMode: "contain" }}
              source={IMAGES.filter3}
            />
            <Text
              style={[FONTS.fontMedium, { fontSize: 15, color: colors.title }]}
            >
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
            }}
          >
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
            }}
          >
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
        ]}
      >
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <FlatList
            data={articles}
            renderItem={show ? renderItem : renderItem2}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            numColumns={show ? 2 : 1}
            key={show ? "grid" : "list"} // Cambia la clave aquí
          />
        )}
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

export default Catalogo;
