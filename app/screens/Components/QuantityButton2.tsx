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
import { useSelector } from "react-redux";
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
  quantities: { [key: number]: number | undefined }; // Permitir undefined
  setQuantities: React.Dispatch<React.SetStateAction<{ [key: number]: number | undefined }>>; // Permitir undefined
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
   
  const cart = useSelector((state: any) => state.cart.cart);
   
  // Añadir producto al carrito con la cantidad seleccionada y enviar a la API
  const addItemToCart = useCallback(
    async (item: Article) => {
      const quantityToAdd = quantities[item.id] || 1; // Cantidad seleccionada en QuantityButton
  
      // Verificar si el producto ya está en el carrito
      const existingCartItem = cart.find((cartItem: any) => cartItem.id === item.id);
  
      try {
        let newQuantity = quantityToAdd;
  
        if (existingCartItem) {
          // Si el producto ya está en el carrito, suma la cantidad
          newQuantity = existingCartItem.quantity + quantityToAdd;
  
          // Mostrar mensaje con la cantidad total
          Toast.show({
            type: "info",
            text1: "Producto actualizado",
            text2: `Ahora tienes unidades de este producto en tu carrito.`,
          });
        } else {
          // Mostrar mensaje de éxito si es un producto nuevo
          Toast.show({
            type: "success",
            text1: "¡Producto añadido!",
            text2: "El producto se ha añadido a tu carrito.",
          });
        }
  
        // Llamar a la API para actualizar la cantidad total
        await addItemToCartApi(clienteId, item.id, newQuantity);
  
        // Actualizar el estado del carrito en Redux
        dispatch(addToCart({ ...item, quantity: newQuantity }));
      } catch (error: any) {
        if (error.response?.status === 409) {
          // Mostrar solo el mensaje de stock insuficiente
          Toast.show({
            type: "error",
            text1: "Stock insuficiente",
            text2: "No hay suficiente stock para este producto.",
          });
        }  else {
          Toast.show({
            type: "error",
            text1: "Error al añadir al carrito",
            text2: "Por favor, inténtelo de nuevo.",
          });
        }
      }
    },
    [dispatch, quantities, clienteId, cart]
  );


  const incrementQuantity = useCallback(
    (id: number) => {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: (prevQuantities[id] ?? 0) + 1, // Usa 0 como valor predeterminado si es undefined
      }));
    },
    [setQuantities]
  );

const decrementQuantity = useCallback(
  (id: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] ?? 1) > 1 ? (prevQuantities[id] ?? 1) - 1 : 1,
    }));
  },
  [setQuantities]
)
  
  const handleQuantityChange = useCallback(
    (id: number, value: string) => {
      if (value === "") {
        // Permitir que el campo quede vacío
        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [id]: undefined, // O eliminar la clave si prefieres
        }));
      } else {
        const numericValue = parseInt(value, 10);
        if (!isNaN(numericValue) && numericValue > 0) {
          setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [id]: numericValue,
          }));
        }
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
          value={quantities[item.id]?.toString() || ""}
          placeholder="1" // Muestra el número 1 como un placeholder
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
