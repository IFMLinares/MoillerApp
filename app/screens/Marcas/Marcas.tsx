import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import CategoryCart from "../../components/CategoryCart";
import { COLORS, FONTS } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { fetchBrands } from "../../api/categoryApi";
import { IMAGES } from "../../constants/Images";
import BottomSheet2 from "../Components/BottomSheet2";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

type MarcasScreenProps = StackScreenProps<RootStackParamList, "Marcas">;

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const Marcas = ({ navigation, route }: MarcasScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [brands, setBrands] = useState([]); // Cambiar a "brands"
  const [isLoading, setIsLoading] = useState(true); // Estado para el indicador de carga
  const sheetRef = useRef<any>(null);
  const [visibleBrands, setVisibleBrands] = useState(21); // Controla cuántas marcas se muestran
  const clienteId = useSelector((state: RootState) => state.user.clienteId); // Especifica el tipo del estado
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId

  useEffect(() => {
    const loadBrands = async () => {
      try {
        setIsLoading(true); // Mostrar el indicador de carga
  
        // Obtener las marcas directamente desde la API
        const fetchedBrands = await fetchBrands();
        console.log("Marcas desde la API:", fetchedBrands);
  
        // Establecer las marcas en el estado
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setIsLoading(false); // Ocultar el indicador de carga
      }
    };
  
    loadBrands();
  }, []);


  const handleShowMore = () => {
    setVisibleBrands((prev) => prev + 12); // Muestra 12 marcas más
  };

  const handleShowLess = () => {
    setVisibleBrands(12); // Vuelve a mostrar solo 12 marcas
  };

  const renderBrand = ({ item }) => {
    return (
        <TouchableOpacity
      style={{
        alignItems: "center",
        margin: wp("2%"),
        width: wp("28%"), // Ajusta el ancho dinámicamente
      }}
      onPress={() =>{
        console.log("co_cat (id de la marca):", item.id); // Log del co_cat (ID único de la marca)
        navigation.navigate("ProductsMarcas", {
          brandId: item.id, // co_cat (código único de la marca)
          brandName: item.name, // Nombre de la marca
          clienteId: clienteId, // Pasar clienteId
        });
      }}
    >
      <View
        style={{
          height: hp("4%"), // Ajusta la altura dinámicamente
          width: "100%",
          paddingHorizontal: wp("2%"),
          backgroundColor: COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 5,
        }}>
        <Text
          style={[
            FONTS.fontRegular,
            {
              fontSize: wp("2.3%"),
              color: colors.card,
              textAlign: "center",
              fontWeight: "bold",
            },
          ]}
          numberOfLines={2}>
          {capitalizeFirstLetter(item.name).toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <View
      style={{ backgroundColor: colors.background, flex: 1, marginBottom: 80 }}>
      <Header title="Marcas" leftIcon="back" titleLeft rightIcon4="filter" />
      <View style={{ padding: 10, marginBottom: 80 }}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 20 }}
          />
        ) : (
          <>
            <FlatList
              data={brands.slice(0, visibleBrands)} // Muestra solo las marcas visibles
              renderItem={renderBrand}
              keyExtractor={(item) => item.id}
              numColumns={3}
              contentContainerStyle={{ alignItems: "center" }}
            />
            <View style={{ alignItems: "center", marginVertical: 10 }}>
              {visibleBrands < brands.length ? (
                <TouchableOpacity
                  onPress={handleShowMore}
                  style={{
                    height: 50,
                    width: "100%",
                    paddingHorizontal: 10,
                    backgroundColor: COLORS.blue,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                  }}>
                  <Text style={{ color: colors.card, ...FONTS.fontRegular, fontWeight: "bold" }}>
                    MOSTRAR MÁS
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleShowLess}
                  style={{
                    height: 50,
                    width: "100%",
                    paddingHorizontal: 10,
                    backgroundColor: COLORS.blue,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                  }}>
                  <Text style={{ color: colors.card, ...FONTS.fontRegular, fontWeight: "bold" }}>
                    MOSTRAR MENOS
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
      <BottomSheet2 ref={sheetRef} />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

export default Marcas;
