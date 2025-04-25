import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Header from "../../layout/Header";
import { IMAGES } from "../../constants/Images";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import FeatherIcon from "react-native-vector-icons/Feather";
//import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from "../../constants/theme";
import Button from "../../components/Button/Button";
import { clearCart } from "../../redux/reducer/cartReducer";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { Ionicons } from "@expo/vector-icons";
import Cardstyle2 from "../../components/Card/Cardstyle2";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../redux/reducer/cartReducer";
import { convertCartToCotizacion } from "../../api/checkoutCotizacionApi";
import { BASE_URL } from "../../api/globalUrlApi"; // Importar la URL base
type CheckoutScreenProps = StackScreenProps<RootStackParamList, "Checkout">;

const Checkout = ({ navigation, route }: CheckoutScreenProps) => {
  const { clienteId, cartId } = route.params; // Recibe el cliente_id y el cart_id
  const cart = useSelector((state: any) => state.cart.cart);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const dispatch = useDispatch();
  
  console.log("Cliente ID recibido en Checkout:", clienteId);
  console.log("Cart ID recibido en Checkout:", cartId);

  const navigateToProductDetails = (product) => {
    navigation.navigate("ProductsDetails", { product });
  };

  const handleConfirmOrder = async () => {
    setIsConfirmationModalVisible(false);
    setIsModalVisible(true);
  
    try {
      const totalPrice = calculateTotal(); // Precio total
      const productCount = cart.length; // Cantidad de productos
  
      if (!clienteId || !cartId) {
        throw new Error("El ID del cliente o del carrito no está definido.");
      }
  
      const response = await convertCartToCotizacion(clienteId, cartId);
      console.log("Respuesta de la API:", response);
  
      const newOrder = {
        id: response.id,
        clienteId,
        cartId,
        total: totalPrice,
        productCount,
        status: "Pendiente",
      };
  
      setTimeout(() => {
        setIsModalVisible(false);
        navigation.navigate("Myorder", { order: newOrder });
        dispatch(clearCart());
      }, 2000);
    } catch (error) {
      console.error("Error al confirmar el pedido:", error.response?.data || error.message);
  
      // Manejo de errores específicos
      if (error.response?.data?.message === "Articulo no posee unidad.") {
        alert("Uno de los artículos en el carrito no tiene una unidad asociada. Por favor, verifica los datos.");
      } else {
        alert("Ocurrió un error al confirmar el pedido. Por favor, intenta nuevamente.");
      }
  
      setIsModalVisible(false);
    }
  };

  const handleOpenConfirmationModal = () => {
    setIsConfirmationModalVisible(true);
  };

  const handleCancelOrder = () => {
    setIsConfirmationModalVisible(false);
  };

  // Función para calcular el total
  const calculateTotal = () => {
    return cart
      .reduce((total: number, item: any) => {
        const price = parseFloat(
          item.price.replace(/[^0-9.-]+/g, "").replace(",", ".")
        );
        return total + price * item.quantity; // Multiplica el precio por la cantidad
      }, 0)
      .toFixed(2);
  };

  const removeItemFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header title="Verificar Pedido" leftIcon="back" titleRight />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={true}>
            <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
              {cart.map((data: any, index: any) => {
                return (
                  <View key={index} style={{ marginBottom: 10 }}>
                    <Cardstyle2
                      title={data.name}
                      price={data.price}
                      discount={data.discount}
                      delevery={data.delevery}
                      image={{ uri: `${BASE_URL}${data.highImage}` }} // Usa la URL de la imagen de baja calidad
                      offer={data.offer}
                      brand={data.brand}
                      marca={data.code}
                      modelo={data.line}
                      quantity={data.quantity} // Pasar la cantidad
                      productId={data.id} // Pasar el ID del producto
                      onPress={() => navigateToProductDetails(data)}
                      onPress4={() => removeItemFromCart(data)}
                    />
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <View
          style={[
            GlobalStyleSheet.container,
            {
              paddingTop: 10,
              backgroundColor: theme.dark
                ? "rgba(255,255,255,.1)"
                : colors.card,
              marginTop: 15,
            },
          ]}>
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                ...FONTS.fontRegular,
                fontSize: 15,
                color: colors.title,
              }}>
              Notas adicionales:
            </Text>
            <TextInput
              style={{
                ...FONTS.fontRegular,
                fontSize: 15,
                color: colors.title,
                //paddingVertical: 12,
                //paddingHorizontal: 15,
                borderBottomWidth: 2,
                borderBottomColor: COLORS.primaryLight,
                //height: 60,
                paddingBottom: 50,
                // width: '100%',
              }}
              placeholder=" Escribe aquí"
              multiline
              placeholderTextColor={colors.text}
            />
          </View>
        </View>
        <View
          style={[
            GlobalStyleSheet.container,
            {
              paddingTop: 10,
              backgroundColor: theme.dark
                ? "rgba(255,255,255,.1)"
                : colors.card,
              marginTop: 15,
            },
          ]}>
          <View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: COLORS.primaryLight,
                marginHorizontal: -15,
                paddingHorizontal: 15,
                paddingBottom: 15,
                marginTop: 5,
              }}>
              <Text
                style={[
                  FONTS.fontMedium,
                  { fontSize: 16, color: colors.title },
                ]}>
                Detalles del precio
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 5,
                marginTop: 15,
              }}>
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 14,
                  color: colors.title,
                }}>
                Precio ({cart.length} Items)
              </Text>
              <Text
                style={{
                  ...FONTS.fontMediumItalic,
                  fontSize: 14,
                  color: colors.title,
                  fontWeight: "bold",
                }}>
                {calculateTotal()}€
              </Text>
            </View>

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: COLORS.primaryLight,
                marginHorizontal: -0,
                paddingHorizontal: 15,
                paddingTop: 15,
                paddingBottom: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Text
                style={[
                  FONTS.fontMedium,
                  { fontSize: 16, color: colors.title },
                ]}>
                Subtotal:
              </Text>
              <Text
                style={[
                  FONTS.fontMediumItalic,
                  { fontSize: 16, color: COLORS.success, fontWeight: "bold" },
                ]}>
                {calculateTotal()}€
              </Text>
            </View>

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: COLORS.primaryLight,
                marginHorizontal: -0,
                paddingHorizontal: 15,
                paddingTop: 15,
                paddingBottom: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Text
                style={[
                  FONTS.fontMedium,
                  { fontSize: 16, color: colors.title },
                ]}>
                TOTAL:
              </Text>
              <Text
                style={[
                  FONTS.fontMediumItalic,
                  { fontSize: 16, color: COLORS.success, fontWeight: "bold" },
                ]}>
                {calculateTotal()}€
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={[
          GlobalStyleSheet.container,
          { paddingHorizontal: 0, paddingBottom: 0 },
        ]}>
        <View
          style={{
            height: 88,
            width: "100%",
            backgroundColor: theme.dark ? "rgba(255,255,255,.1)" : colors.card,
            justifyContent: "center",
            paddingHorizontal: 15,
          }}>
          <Button
            title="CONFIRMAR PEDIDO"
            color={COLORS.primary}
            text={COLORS.white}
            onPress={handleOpenConfirmationModal}
          />
        </View>
      </View>

      {/* Modal de confirmación */}
      <Modal
        visible={isConfirmationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsConfirmationModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}>
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: colors.card,
              borderRadius: 10,
              alignItems: "center",
            }}>
            <Text
              style={{
                ...FONTS.fontMedium,
                fontSize: 18,
                color: colors.title,
                marginBottom: 20,
              }}>
              ¿Estás seguro de realizar el pedido?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "green",
                  padding: 10,
                  borderRadius: 10,
                  flex: 1,
                  marginRight: 5,
                  alignItems: "center",
                }}
                onPress={handleConfirmOrder}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 16,
                    ...FONTS.fontMedium,
                  }}>
                  Aceptar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 10,
                  flex: 1,
                  marginLeft: 5,
                  alignItems: "center",
                }}
                onPress={handleCancelOrder}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 16,
                    ...FONTS.fontMedium,
                  }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de éxito */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}>
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: colors.card,
              borderRadius: 10,
              alignItems: "center",
            }}>
            <Ionicons name="checkmark-circle" size={80} color="green" />
            <Text
              style={{
                ...FONTS.fontMedium,
                fontSize: 18,
                color: colors.title,
                marginVertical: 20,
              }}>
              ¡Pedido realizado exitosamente!
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Checkout;
