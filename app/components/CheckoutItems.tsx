import React ,{useState} from 'react'
import { View, Text ,ScrollView, Image, TouchableOpacity ,} from 'react-native'
import { useTheme } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS,FONTS, SIZES } from '../constants/theme';
import { useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "../redux/reducer/cartReducer";

type CheckoutItemsProps = {
  quantity: number; // Cantidad del producto
  productId: string; // ID del producto
};

const CheckoutItems = ({ quantity, productId }: CheckoutItemsProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(incrementQuantity({ id: productId }));
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      dispatch(decrementQuantity({ id: productId }));
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