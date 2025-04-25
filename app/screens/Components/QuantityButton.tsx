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
import { addItemToCartApi } from "../../api/addItemApi";

const QuantityButton = ({ item, quantities, setQuantities, clienteId }) => {
  const dispatch = useDispatch();

  // Añadir producto al carrito con la cantidad seleccionada y enviar a la API
  const addItemToCart = useCallback(
    async (item) => {
      const quantity = quantities[item.id] || 1; // Obtener la cantidad seleccionada

      try {
        console.log("Cantidad enviada a la API:", quantity); // Depuración

        // Llamar a la API para añadir el producto al carrito
        const response = await addItemToCartApi(clienteId, item.id, quantity);

        console.log("Respuesta de la API:", response); // Verificar respuesta de la API

        // Actualizar el estado del carrito en Redux
        dispatch(addToCart({ ...item, quantity })); // Aquí se suma en el reducer

        // Mostrar mensaje de éxito
        Toast.show({
          type: "success",
          text1: "¡Producto/s añadido a su carrito exitosamente!",
        });
      } catch (error) {
        console.error("Error al añadir al carrito:", error); // Depuración de errores

        // Manejar errores
        Toast.show({
          type: "error",
          text1: "Error al añadir al carrito",
          text2: "Por favor, inténtelo de nuevo.",
        });
      }
    },
    [dispatch, quantities, clienteId]
  );

  // Incrementar la cantidad del producto
  const incrementQuantity = useCallback(
    (id) => {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: (prevQuantities[id] || 1) + 1,
      }));
    },
    [setQuantities]
  );

  // Decrementar la cantidad del producto
  const decrementQuantity = useCallback(
    (id) => {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: prevQuantities[id] > 1 ? prevQuantities[id] - 1 : 1,
      }));
    },
    [setQuantities]
  );

  // Cambiar la cantidad manualmente desde el TextInput
  const handleQuantityChange = useCallback(
    (id, value) => {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue) && numericValue > 0) {
        setQuantities((prevQuantities) => ({
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
        paddingRight: wp("1.5%"),
        borderRightWidth: 1,
        borderRightColor: COLORS.primaryLight,
        width: "100%",
      }}>
      {/* Controles de cantidad */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.light,
          borderRadius: 10,
          height: hp("4.0%"), 
        }}>
        <TouchableOpacity
          onPress={() => decrementQuantity(item.id)}
          style={{
            paddingHorizontal: wp("1.5%"),
            // backgroundColor: COLORS.primary,
          }}>
          <Text style={{ fontSize: hp("2.25%") }}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={{
            fontSize: hp("1.5%"),
            // marginHorizontal: wp("1%"),
            fontWeight: "bold",
            textAlign: "center",
            width: wp("9.0%"),
          }}
          keyboardType="numeric"
          value={(quantities[item.id] || 1).toString()}
          onChangeText={(value) => handleQuantityChange(item.id, value)}
        />
        <TouchableOpacity
          onPress={() => incrementQuantity(item.id)}
          style={{
            paddingHorizontal: wp("1.5%"),
            // backgroundColor: COLORS.primary,
            
          }}>
          <Text style={{ fontSize: hp("2.25%") }}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para añadir al carrito */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
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

export default QuantityButton;

const styles = StyleSheet.create({});
