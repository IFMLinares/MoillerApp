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
import { removeFromCart } from "../../redux/reducer/cartReducer";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { Ionicons } from "@expo/vector-icons";
import Cardstyle3 from "../../components/Card/Cardstyle3";
import { useDispatch, useSelector } from "react-redux";

import * as ImagePicker from "expo-image-picker"; // Para Expo

type CheckoutScreenProps = StackScreenProps<RootStackParamList, "Pedido">;

const Pedido = ({ navigation, route }: CheckoutScreenProps) => {
  const { order } = route.params; // Recibir los datos del pedido
  const cart = useSelector((state: any) => state.cart.cart);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false);
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null); // Estado para almacenar la imagen seleccionada
  const [amountPaid, setAmountPaid] = useState(0); // Estado para el monto abonado

  // Calcular el monto total de los productos
  const calculateTotal = () => {
    return order.products
      .reduce((total: number, product: any) => total + product.price * product.quantity, 0)
      .toFixed(2);
  };

  const totalAmount = parseFloat(calculateTotal()); // Monto total calculado
  const remainingAmount = totalAmount - amountPaid; // Monto restante

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value) || 0; // Convertir el valor ingresado a número
    setAmountPaid(numericValue);
  };


  // Función para abrir la cámara
  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Se requiere permiso para usar la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Guarda la URI de la imagen seleccionada
    }
  };

  // Función para seleccionar una imagen de la galería
  const handleSelectFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Se requiere permiso para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Guarda la URI de la imagen seleccionada
    }
  };
 

  const handleConfirmOrder = () => {
    setIsConfirmationModalVisible(false);
    setIsModalVisible(true);
    setTimeout(() => {
      setIsModalVisible(false);
      navigation.navigate("Myorder", {
        updatedOrder: {
          ...order,
          paid: amountPaid, // Actualizar el monto abonado
        },
      });
    }, 2000);
  };

  const handleOpenConfirmationModal = () => {
    setIsConfirmationModalVisible(true);
  };

  const handleCancelOrder = () => {
    setIsConfirmationModalVisible(false);
  };
 

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header title="Todos los productos" leftIcon="back" titleRight />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
 
        <View>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={true}>
            <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
            {order.products.map((product: any, index: number) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Cardstyle3
                title={product.name}
                price={product.price}
                discount={product.discount}
                delevery={product.delevery}
                image={{ uri: `http://10.0.2.2:8000${product.highImage}` }}
                offer={product.offer}
                brand={product.brand}
                marca={product.code}
                modelo={product.line}
                hideActions={true}
              />
            </View>
          ))}
            </View>
          </ScrollView>
        </View>
        {/* <View style={{ flex: 1 }}></View> */}
        <View
          style={{
            backgroundColor: COLORS.white,
            width: "100%",
            borderRadius: 10,
            padding: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            marginBottom: 15,
          }}>
          <Text
            style={{
              ...FONTS.fontMedium,
              fontSize: 16,
              color: colors.title,
              marginBottom: 10,
            }}>
            Subir comprobante de pago:
          </Text>
          {/* Botón para tomar una foto */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                // marginBottom: 10,
                marginRight: 10,
                width: "50%",
              }}
              onPress={handleTakePhoto}>
              <Text style={{ color: COLORS.white, fontSize: 16 }}>
                Tomar foto
              </Text>
            </TouchableOpacity>

            {/* Botón para seleccionar desde la galería */}
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.text,
                padding: 10,
                borderRadius: 5,
                alignItems: "center",
                // marginBottom: 20,
                width: "50%",
              }}
              onPress={handleSelectFromGallery}>
              <Text style={{ color: COLORS.white, fontSize: 16 }}>
                Seleccionar desde galería
              </Text>
            </TouchableOpacity>
          </View>

          {/* Mostrar la imagen seleccionada */}
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 10,
                marginTop: 10,
              }}
            />
          )}

          {/* Input numérico para el monto en euros */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: 15, 
            }}>
            <Text
              style={{
                ...FONTS.fontMedium,
                fontSize: 16,
                color: colors.title,
                marginBottom: 10,
              }}>
              Monto en euros:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: COLORS.primaryLight,
                borderRadius: 10,
                padding: 10,
                fontSize: 16,
                color: colors.title,
              }}
              keyboardType="numeric"
              placeholder=" Ingresa el monto"
              placeholderTextColor={colors.text}
              onChangeText={handleAmountChange} // Actualizar el monto abonado
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
        {/* <View
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
          <View
            style={{
              backgroundColor: COLORS.white,
              width: "100%",
              borderRadius: 10,
              padding: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
              marginBottom: 15,
            }}>
            <Text
              style={{
                ...FONTS.fontMedium,
                fontSize: 16,
                color: colors.title,
                marginBottom: 10,
              }}>
              Detalles del precio
            </Text>
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
                Monto total:
              </Text>
              <Text
                style={{
                  ...FONTS.fontMediumItalic,
                  fontSize: 14,
                  color: colors.title,
                  fontWeight: "bold",
                }}>
                {totalAmount.toFixed(2)}€
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
                Monto abonado:
              </Text>
              <Text
                style={{
                  ...FONTS.fontMediumItalic,
                  fontSize: 14,
                  color: COLORS.success,
                  fontWeight: "bold",
                }}>
                {amountPaid.toFixed(2)}€
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
                Monto restante:
              </Text>
              <Text
                style={{
                  ...FONTS.fontMediumItalic,
                  fontSize: 14,
                  color: remainingAmount <= 0 ? COLORS.success : COLORS.warning,
                  fontWeight: "bold",
                }}>
                {remainingAmount.toFixed(2)}€
              </Text>
            </View>
          </View>
        </View> */}
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
            title="ACEPTAR"
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
              ¿Estás seguro?
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
              ¡Información actualizada!
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Pedido;
