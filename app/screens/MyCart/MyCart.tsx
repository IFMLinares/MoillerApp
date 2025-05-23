import { useTheme } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, RefreshControl } from "react-native";
import Header from "../../layout/Header";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import { COLORS, FONTS } from "../../constants/theme";
import Cardstyle2 from "../../components/Card/Cardstyle2";
import Button from "../../components/Button/Button";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import {
  removeFromCart,
  initializeCart,
} from "../../redux/reducer/cartReducer";
import { Feather } from "@expo/vector-icons";
import { getCartItemsApi } from "../../api/cartApi"; // Importa la nueva función
import { deleteItemFromCartApi } from "../../api/deleteItemApi"; // Importa la función correctamente
import { BASE_URL } from "../../api/globalUrlApi"; // Importar la URL base
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage

type MyCartScreenProps = StackScreenProps<RootStackParamList, "Mi Carrito">;

type Product = {
  id: number;
  name: string;
  price: string;
  quantity: number;
  // Agrega más propiedades según sea necesario
};

const MyCart = ({ navigation }: MyCartScreenProps) => {
  const cart = useSelector((state: any) => state.cart.cart);
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const clienteId = useSelector((state: RootState) => state.user.clienteId); // Especifica el tipo del estado
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId
  const [cartId, setCartId] = useState<number | null>(null); // Estado para almacenar el cart_id
  console.log("Datos del carrito:", cart);
  const [refreshing, setRefreshing] = useState(false); // Estado para manejar la recarga

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartData = await getCartItemsApi(clienteId);
        setCartId(cartData.id); // Guarda el cart_id en el estado
        console.log("Cart ID obtenido:", cartData.id);
      } catch (error) {
        console.error("Error al obtener los productos del carrito:", error);
      }
    };

    fetchCartItems();
  }, [clienteId]);

  const navigateToProductDetails = (product: any) => {
    navigation.navigate("ProductsDetails", {
      product, // Pasa el objeto completo del producto
      productId: product.id, // Pasa el ID del producto
    });
  };

  // Función para normalizar URLs y evitar barras duplicadas
  const normalizeUrl = (baseUrl: string, path: string) => {
    if (!baseUrl.endsWith("/")) {
      baseUrl += "/";
    }
    if (path.startsWith("/")) {
      path = path.substring(1);
    }
    return baseUrl + path;
  };

  // Recuperar el carrito desde AsyncStorage al iniciar la pantalla
  // Mapeo de los datos del carrito
  const mapCartItems = (items: any[]) => {
    console.log("Datos del carrito antes de mapear:", items); // Verifica los datos originales

    return items.map((item: any) => {
      const highImage =
        item.articulo.images?.find((img: any) => img.quality === "high")
          ?.image || IMAGES.defaultImage;
      const lowImage =
        item.articulo.images?.find((img: any) => img.quality === "low")
          ?.image || IMAGES.defaultImage;
      console.log(
        "URL de la imagen de alta calidad:",
        normalizeUrl(BASE_URL, highImage)
      );
      console.log(
        "URL de la imagen de baja calidad:",
        normalizeUrl(BASE_URL, lowImage)
      );
      return {
        id: item.articulo.id,
        name: item.articulo.art_des?.trim() || "Sin nombre",
        code: item.articulo.co_art?.trim() || "Sin código",
        price: parseFloat(item.co_precio) || 0,
        quantity: parseInt(item.cantidad) || 0,
        highImage: normalizeUrl(BASE_URL, highImage), // Normaliza la URL de la imagen de alta calidad
        lowImage: normalizeUrl(BASE_URL, lowImage), // Normaliza la URL de la imagen de baja calidad
        line: item.articulo.co_lin?.lin_des?.trim() || "Sin línea",
        subline: item.articulo.co_subl?.subl_des?.trim() || "Sin sublínea",
        model: item.articulo.modelo?.trim() || "Sin modelo",
      };
    });
  };

  useEffect(() => {
    const loadCartFromStorage = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("cart");
        if (storedCart) {
          dispatch(initializeCart(JSON.parse(storedCart)));
        } else {
          const cartData = await getCartItemsApi(clienteId);
          const mappedCartItems = mapCartItems(cartData.items);
          dispatch(initializeCart(mappedCartItems));
          setCartId(cartData.id);
        }
      } catch (error) {
        console.error("Error al cargar el carrito desde AsyncStorage:", error);
      }
    };

    loadCartFromStorage();
  }, [clienteId, dispatch]);

  // Guardar el carrito en AsyncStorage cada vez que cambie
  useEffect(() => {
    const saveCartToStorage = async () => {
      try {
        await AsyncStorage.setItem("cart", JSON.stringify(cart));
      } catch (error) {
        console.error("Error al guardar el carrito en AsyncStorage:", error);
      }
    };

    saveCartToStorage();
  }, [cart]);

  const removeItemFromCart = async (itemId: number) => {
    try {
      await deleteItemFromCartApi(clienteId, itemId);
      dispatch(removeFromCart(itemId)); // Aquí se despacha la acción
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
        // Validar y asignar un valor predeterminado para item.price
        const price = parseFloat(
          (typeof item.price === "string"
            ? item.price
            : item.price?.toString() || "0"
          )
            .replace(/[^0-9.-]+/g, "")
            .replace(",", ".")
        );

        // Validar y asignar un valor predeterminado para item.quantity
        const quantity = item.quantity || 0;

        return total + price * quantity; // Multiplica el precio por la cantidad
      }, 0)
      .toFixed(2); // Redondear a 2 decimales
  };

  // Función para recargar el carrito
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const cartData = await getCartItemsApi(clienteId);
      const mappedCartItems = mapCartItems(cartData.items);
      dispatch(initializeCart(mappedCartItems));
      setCartId(cartData.id);
    } catch (error) {
      console.error("Error al recargar el carrito:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) {
      // Si la URL ya es absoluta, devuélvela tal cual
      return imagePath;
    }
    // Si la URL es relativa, concaténala con BASE_URL
    return `${BASE_URL}${imagePath}`;
  };

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title="Mi carrito"
        leftIcon="back"
        titleLeft
        righttitle2
        rightIcon5={"search"}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
          {cart.map((data: any, index: any) => {
            // Validar y asignar valores predeterminados si faltan datos
            const price =
              typeof data.price === "string"
                ? data.price
                : data.price?.toString() || "0"; // Asignar "0" si price es undefined
            const quantity = data.quantity || 0; // Asignar 0 si quantity es undefined

            if (!price || quantity === 0) {
              console.warn(
                `Producto con datos incompletos: ${JSON.stringify(data)}`
              );
              return null; // No renderiza productos con datos incompletos
            }

            // Calcular el precio total por producto
            const totalPricePerProduct =
              parseFloat(price.replace(/[^0-9.-]+/g, "").replace(",", ".")) *
              quantity;

            return (
              <View key={index} style={{ marginBottom: 10 }}>
                <Cardstyle2
                  title={data.name}
                  price={data.price}
                  discount={data.discount}
                  delevery={data.delevery}
                  image={{
                    uri: getImageUrl(data.lowImage), // Usa la función para construir la URL
                  }} // Imagen de baja calidad
                  offer={data.offer}
                  brand={data.line} // Línea del producto
                  marca={data.code} // Código del artículo
                  modelo={data.model} // Modelo del producto
                  quantity={data.quantity}
                  productId={data.id}
                  clienteId={clienteId}
                  onPress={() => navigateToProductDetails(data)}
                  removeItemFromCart={() => removeItemFromCart(data.id)}
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
            backgroundColor: theme.dark ? "rgba(255,255,255,.1)" : colors.card,
            padding: 0,
            paddingTop: 3,
            margin: 0,
          },
        ]}>
        <View>
          <View>
            <View
              style={{
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
                  FONTS.fontJostMediumItalic, // Cambia a la propiedad correcta
                  { fontSize: 20, color: COLORS.success, fontWeight: "bold" },
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
            size="md" // Cambia el tamaño del botón a grande
            onPress={() => {
              if (cartId) {
                navigation.navigate("Checkout", { clienteId, cartId }); // Pasa el cartId
              } else {
                console.error("Cart ID no está definido.");
              }
            }}
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
