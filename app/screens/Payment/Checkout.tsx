import { useTheme } from "@react-navigation/native";
import React, {useState} from "react";
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
import { Ionicons } from '@expo/vector-icons';
import Cardstyle2 from "../../components/Card/Cardstyle2";
import { useDispatch, useSelector } from "react-redux";

const checkoutData = [
  {
    image: IMAGES.map,
    title: "Dirección de entrega",
    text: " ",
    navigate: "DeliveryAddress",
  },
  {
    image: IMAGES.card2,
    title: "Método de pago",
    text: " ",
    navigate: "Payment",
  },
];

 
type CheckoutScreenProps = StackScreenProps<RootStackParamList, "Checkout">;

const Checkout = ({ navigation }: CheckoutScreenProps) => {
  const cart = useSelector((state: any) => state.cart.cart);
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const dispatch = useDispatch();

  const navigateToProductDetails = (product) => {
    navigation.navigate('ProductsDetails', { product });
  };
  const handleConfirmOrder = () => {
    setIsModalVisible(true);
    setTimeout(() => {
      setIsModalVisible(false);
      navigation.navigate("Myorder");
    }, 2000);
  };

    // Función para calcular el total
    const calculateTotal = () => {
      return cart
        .reduce((total: number, item: any) => {
          const price = parseFloat(item.price.replace(/[^0-9.-]+/g, "").replace(",", "."));
          return total + price;
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
          {/* {checkoutData.map((data:any, index) => {
                        return (
                            <TouchableOpacity
                                onPress={() => navigation.navigate(data.navigate)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottomWidth: 1,
                                    marginHorizontal:-15,
                                    paddingHorizontal:15,
                                    borderBottomColor: COLORS.primaryLight,
                                    paddingBottom: 10,
                                    marginTop: 10
                                }}
                                key={index}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10,flex:1 }}>
                                    <View style={{ height: 40, width: 40,borderWidth:1,borderColor:COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                                        <Image
                                            style={{ height: 20, width: 20, tintColor: COLORS.primary , resizeMode: 'contain' }}
                                            source={data.image}
                                        />
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text style={{ ...FONTS.fontMedium, fontSize: 16, color: colors.title }}>{data.title}</Text>
                                        <Text style={{ ...FONTS.fontRegular, fontSize: 14, color: colors.text }}>{data.text}</Text>
                                    </View>
                                </View>
                                <FeatherIcon size={22} color={colors.title} name={'chevron-right'} />
                                <Ionicons color={colors.title} name='chevron-forward' size={20}/>
                            </TouchableOpacity>
                        )
                    })} */}
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
        <View  >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={true}
          >
            <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
              {cart.map((data: any, index: any) => {
                return (
                  <View key={index} style={{ marginBottom: 10 }}>
                    <Cardstyle2
                      title={data.name}
                      price={data.price}
                      discount={data.discount}
                      delevery={data.delevery}
                      image={{ uri: `http://10.0.2.2:8000${data.highImage}` }} // Usa la URL de la imagen de baja calidad
                      offer={data.offer}
                      brand={data.brand}
                      marca={data.code}
                      modelo={data.line}
                      onPress={() => navigateToProductDetails(data)}
                      onPress4={() => removeItemFromCart(data)}
                    />
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
        {/* <View style={{ flex: 1 }}></View> */}
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
                  { fontSize: 16, color: COLORS.success, fontWeight: "bold", },
                ]}>
                {calculateTotal()}€
              </Text>
            </View>
            {/* <View
              style={{
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
                Delivery:
              </Text>
              <Text
                style={[
                  FONTS.fontMedium,
                  { fontSize: 16, color: COLORS.success },
                ]}>
                0$
              </Text>
            </View> */}
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
                  { fontSize: 16, color: COLORS.success, fontWeight: "bold", },
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
        ]}
      >
        <View
          style={{
            height: 88,
            width: "100%",
            backgroundColor: theme.dark ? "rgba(255,255,255,.1)" : colors.card,
            justifyContent: "center",
            paddingHorizontal: 15,
          }}
        >
          <Button
            title="CONFIRMAR PEDIDO"
            color={COLORS.primary}
            text={COLORS.white}
            onPress={handleConfirmOrder}
          />
        </View>
      </View>
      
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: colors.card,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Ionicons name="checkmark-circle" size={80} color="green" />
            <Text
              style={{
                ...FONTS.fontMedium,
                fontSize: 18,
                color: colors.title,
                marginVertical: 20,
              }}
            >
              ¡Pedido realizado exitosamente!
            </Text>
            {/* <TouchableOpacity
              style={{
                backgroundColor: "green",
                padding: 10,
                borderRadius: 10,
                width: "100%",
                alignItems: "center",
              }}
              onPress={() => {
                setIsModalVisible(false);
                navigation.navigate("Myorder");
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 16,
                  ...FONTS.fontMedium,
                }}
              >
                Siguiente
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Checkout;
