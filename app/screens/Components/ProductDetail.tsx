import React from "react";
import { View, Text } from "react-native";

const ProductDetail = ({ route }) => {
  const { productId } = route.params;

  return (
    <View>
      <Text>Detalle del Producto</Text>
      <Text>ID: {productId}</Text>
    </View>
  );
};

export default ProductDetail;