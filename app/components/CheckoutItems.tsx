import React ,{useState, useCallback} from 'react'
import { View, Text ,ScrollView, Image, TouchableOpacity ,} from 'react-native'
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS,FONTS, SIZES } from '../constants/theme';
import { useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "../redux/reducer/cartReducer";
import { addItemToCartApi } from "../api/addItemApi";
import Toast from "react-native-toast-message";

type CheckoutItemsProps = {
  quantity: number; // Cantidad del producto
  productId: number; // ID del producto
  clienteId: number; // ID del cliente
};


const CheckoutItems = ({ quantity, productId, clienteId }: CheckoutItemsProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const dispatch = useDispatch();

  // Mostrar un mensaje de error si faltan los IDs, pero no detener el renderizado
  // Validar clienteId y productId
  if (!clienteId || !productId) {
    console.error("Faltan clienteId o productId en CheckoutItems");
    return null; // Evita renderizar el componente si faltan valores
  }

  const updateCartApi = useCallback(
    async (newQuantity: number) => {
      try {
        await addItemToCartApi(clienteId, productId, newQuantity);
        Toast.show({
          type: "success",
          text1: "Cantidad actualizada en el carrito",
        });
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: "Error al actualizar el carrito",
          text2: "Por favor, inténtelo de nuevo.",
        });
      }
    },
    [clienteId, productId]
  );

  const handleIncrement = async () => {
    if (!clienteId || !productId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debe proporcionar el ID del cliente y el ID del producto.",
      });
      return;
    }

    const newQuantity = quantity + 1;
    dispatch(incrementQuantity({ id: productId }));
    await updateCartApi(newQuantity);
  };

  const handleDecrement = async () => {
    if (!clienteId || !productId) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debe proporcionar el ID del cliente y el ID del producto.",
      });
      return;
    }

    if (quantity > 1) {
      const newQuantity = quantity - 1;
      dispatch(decrementQuantity({ id: productId }));
      await updateCartApi(newQuantity);
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={handleDecrement}
        style={{
          height: 30,
          width: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather size={20} color={colors.text} name={"minus"} />
      </TouchableOpacity>
      <Text
        style={{
          ...FONTS.fontRegular,
          fontSize: 14,
          color: colors.title,
          width: 50,
          textAlign: "center",
        }}
      >
        {quantity}
      </Text>
      <TouchableOpacity
        onPress={handleIncrement}
        style={{
          height: 30,
          width: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather size={20} color={colors.text} name={"plus"} />
      </TouchableOpacity>
    </View>
  );
};

export default CheckoutItems;