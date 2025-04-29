import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useCallback } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS, FONTS } from "../../constants/theme";
import { useDispatch } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import Toast from "react-native-toast-message";
import { addToCart } from "../../redux/reducer/cartReducer";
import { addTowishList } from "../../redux/reducer/wishListReducer";
import { useTheme } from "@react-navigation/native";
import { addItemToCartApi } from "../../api/addItemApi";

type Article = {
  id: number;
  name: string;
  price: number;
  code: string;
  highImage: string;
};

type QuantityButton2Props = {
  item: Article; // Define el tipo de `item` como `Article`
  quantities: { [key: number]: number }; // Define `quantities` como un objeto con claves numéricas y valores numéricos
  setQuantities: React.Dispatch<React.SetStateAction<{ [key: number]: number }>>; // Define `setQuantities` como una función de React para actualizar el estado
  clienteId: number; // Define `clienteId` como un número
  showToast: (type: string, text1: string, text2?: string) => void; // Define `showToast` como una función que muestra un mensaje
};

const QuantityButton2: React.FC<QuantityButton2Props> = ({
  item,
  quantities,
  setQuantities,
  clienteId,
  showToast,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors } = theme;
   

  // Añadir producto al carrito con la cantidad seleccionada y enviar a la API
  const addItemToCart = useCallback(
    async (item: Article) => { // Define el tipo de `item` como `Article`
      const quantity = quantities[item.id] || 1; // Obtener la cantidad seleccionada
  
      try {
        // Llamar a la API para añadir el producto al carrito
        await addItemToCartApi(clienteId, item.id, quantity);
  
        // Actualizar el estado del carrito en Redux
        dispatch(addToCart({ ...item, quantity }));
  
        // Mostrar mensaje de éxito
        Toast.show({
          type: "success",
          text1: "¡Producto/s añadido a su carrito exitosamente!",
        });
      } catch (error) {
        // Manejar errores
        Toast.show({
          type: "error",
          text1: "Error al añadir al carrito",
          text2: "Por favor, inténtelo de nuevo.",
        });
      }
    },
    [dispatch, quantities, clienteId, showToast]
  );

  const incrementQuantity = useCallback(
    (id: number) => {
      setQuantities((prevQuantities: { [key: number]: number }) => ({
        ...prevQuantities,
        [id]: (prevQuantities[id] || 1) + 1,
      }));
    },
    [setQuantities]
  );
  
  const decrementQuantity = useCallback(
    (id: number) => {
      setQuantities((prevQuantities: { [key: number]: number }) => ({
        ...prevQuantities,
        [id]: prevQuantities[id] > 1 ? prevQuantities[id] - 1 : 1,
      }));
    },
    [setQuantities]
  );
  
  const handleQuantityChange = useCallback(
    (id: number, value: string) => {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue) && numericValue > 0) {
        setQuantities((prevQuantities: { [key: number]: number }) => ({
          ...prevQuantities,
          [id]: numericValue,
        }));
      }
    },
    [setQuantities]
  );

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: hp("0.4%"),
        paddingRight: wp("2.5%"),
        borderRightWidth: 1,
        borderRightColor: COLORS.primaryLight,
        width: "100%",
        backgroundColor: colors.card,
        position: "relative",
        top: -10,
      }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.light,
          borderRadius: 10,
          height: hp("4.0%"),
          marginBottom: 10,
        }}>
        <TouchableOpacity
          onPress={() => decrementQuantity(item.id)}
          style={{ paddingHorizontal: wp("2.10%") }}>
          <Text style={{ fontSize: hp("2.25%") }}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={{
            fontSize: hp("1.5%"),
            marginHorizontal: wp("1%"),
            fontWeight: "bold",
            textAlign: "center",
            width: wp("4.0%"),
          }}
          keyboardType="numeric"
          value={(quantities[item.id] || 1).toString()}
          onChangeText={(value) => handleQuantityChange(item.id, value)}
        />
        <TouchableOpacity
          onPress={() => incrementQuantity(item.id)}
          style={{ paddingHorizontal: wp("2.10%") }}>
          <Text style={{ fontSize: hp("2.25%") }}>+</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,

        }}>
        <TouchableOpacity
          onPress={() => addItemToCart(item)}
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
  );
};

export default QuantityButton2;

const styles = StyleSheet.create({});
