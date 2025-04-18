import { useTheme } from "@react-navigation/native";
import React, {useEffect} from "react";
import { View, Text, ScrollView, Image } from "react-native";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import { COLORS, FONTS } from "../../constants/theme";
import Cardstyle2 from "../../components/Card/Cardstyle2";
import Button from "../../components/Button/Button";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../redux/reducer/cartReducer";
import { Feather } from "@expo/vector-icons"; 
import { getCartItemsApi } from "../../api/addItemApi"; // Importa la nueva función
import { deleteItemFromCartApi } from "../../api/deleteItemApi"; // Importa la función correctamente
type MyCartScreenProps = StackScreenProps<RootStackParamList, "Mi Carrito">;

const MyCart = ({ navigation }: MyCartScreenProps) => {
  const cart = useSelector((state: any) => state.cart.cart);
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const clienteId = 1; // Reemplaza con el clienteId dinámico si es necesario

  const navigateToProductDetails = (product) => {
    navigation.navigate("ProductsDetails", { product });
  };

  const removeItemFromCart = async (itemId: string) => {
    try {
      await deleteItemFromCartApi(clienteId, itemId); // Llama a la API con itemId
      dispatch(removeFromCart(itemId)); // Actualiza el estado en Redux
      console.log("Producto eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartItems = await getCartItemsApi(clienteId);
        console.log("Productos del carrito obtenidos:", cartItems);
      } catch (error) {
        console.error("Error al obtener los productos del carrito:", error);
      }
    };

    fetchCartItems();
  }, [clienteId]);

  // Función para calcular el total
  const calculateTotal = () => {
    return cart
      .reduce((total: number, item: any) => {
        const price = parseFloat(item.price.replace(/[^0-9.-]+/g, "").replace(",", "."));
        return total + price * item.quantity; // Multiplica el precio por la cantidad
      }, 0)
      .toFixed(2);
  };

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header title="Mi carrito" leftIcon="back" titleLeft righttitle2 />

      {/* {cart.length > 0 ?
                <View style={[GlobalStyleSheet.container,{padding:0}]}>
                    <View style={{height:45,backgroundColor:'#87E8FF',marginVertical:15,flexDirection:'row',alignItems:'center',width:'100%',justifyContent:'space-between',paddingLeft:15}}>
                        <View>
                            <Text style={[FONTS.fontRegular,{fontSize:15,color:COLORS.title}]} >You're saving<Text style={[FONTS.fontSemiBold,{color:'#07A3C5'}]}> $5,565 </Text>on this time</Text>
                        </View>
                        <View>
                            <Image
                                style={{height:45,resizeMode:'contain',marginRight:-35}}
                                source={IMAGES.background}
                            />
                            <Image
                                style={{position:'absolute',height:28,width:28,top:10,right:15}}
                                source={IMAGES.gift}
                            />
                        </View>
                    </View>
                </View>
                :
                null
            } */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
          {cart.map((data: any, index: any) => {
            const totalPricePerProduct =
              parseFloat(
                data.price.replace(/[^0-9.-]+/g, "").replace(",", ".")
              ) * data.quantity;

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
                  quantity={data.quantity} // Pasar la cantidad
                  productId={data.id} // Pasar el ID del producto
                  onPress={() => navigateToProductDetails(data)}
                  removeItemFromCart={(itemId) => removeItemFromCart(itemId)} // Pasar la función
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View
        style={[
          GlobalStyleSheet.container,
          {
            paddingTop: 10,
            backgroundColor: theme.dark ? "rgba(255,255,255,.1)" : colors.card,
            marginTop: 15,
          },
        ]}>
        <View>
          <View>
            <View
              style={{
                marginHorizontal: -0,
                paddingHorizontal: 15,
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
                  { fontSize: 16, color: COLORS.success },
                ]}>
                {calculateTotal()}€
              </Text>
            </View>
          </View>
        </View>
      </View>
      {cart.length > 0 ? (
        <View
          style={[
            GlobalStyleSheet.container,
            {
              backgroundColor: theme.dark
                ? "rgba(255,255,255,.1)"
                : colors.card,
            },
          ]}>
          <Button
            title="REALIZAR PEDIDO"
            color={COLORS.primary}
            text={COLORS.white}
            onPress={() => navigation.navigate("Checkout")}
          />
        </View>
      ) : (
        <View
          style={[
            GlobalStyleSheet.container,
            {
              padding: 0,
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              top: 20,
            },
          ]}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <View
              style={{
                height: 60,
                width: 60,
                borderRadius: 60,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.primaryLight,
                marginBottom: 20,
              }}>
              <Feather color={COLORS.primary} size={24} name="shopping-cart" />
            </View>
            <Text style={{ ...FONTS.h5, color: colors.title, marginBottom: 8 }}>
              {" "}
              ¡Tu carrito de compras está vacío!
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default MyCart;
