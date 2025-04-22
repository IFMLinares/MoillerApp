import { useTheme } from "@react-navigation/native";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  StyleSheet,
} from "react-native";
import Header from "../../layout/Header";
import { COLORS, SIZES, FONTS } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { IMAGES } from "../../constants/Images";
import { Feather } from "@expo/vector-icons";
import Cardstyle2 from "../../components/Card/Cardstyle2";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchShoppingCartsApi } from "../../api/shoppingListApi";
import { useSelector } from "react-redux";

type MyorderScreenProps = StackScreenProps<RootStackParamList, "Myorder">;

const Myorder = ({ navigation, route }: MyorderScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [activeFilter, setActiveFilter] = useState("all"); // Track active filter
  const [orders, setOrders] = useState([]); // Estado inicial vacío
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const clienteId = useSelector((state) => state.user.clienteId); // Obtén el clienteId desde Redux

  const saveOrders = async (newOrders) => {
    try {
      await AsyncStorage.setItem("orders", JSON.stringify(newOrders));
    } catch (error) {
      console.error("Error al guardar los pedidos:", error);
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem("orders");
        if (storedOrders) {
          const parsedOrders = JSON.parse(storedOrders);
          setOrders(parsedOrders);
          setFilteredOrders(parsedOrders);
        }
      } catch (error) {
        console.error("Error al cargar los pedidos:", error);
      }
    };

    loadOrders();
  }, []);

  // Nuevo useEffect para manejar pedidos recibidos desde la navegación
  useEffect(() => {
    if (route.params?.order) {
      const newOrder = route.params.order;
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      setFilteredOrders((prevOrders) => [newOrder, ...prevOrders]); // Actualiza también los pedidos filtrados
    }
  }, [route.params?.order]);

  useEffect(() => {
    const addOrUpdateOrder = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem("orders");
        const existingOrders = storedOrders ? JSON.parse(storedOrders) : [];

        if (route.params?.order) {
          const newOrders = [route.params.order, ...existingOrders];
          setOrders(newOrders);
          setFilteredOrders(newOrders);
          saveOrders(newOrders);
        } else if (route.params?.updatedOrder) {
          const updatedOrders = existingOrders.map((order) =>
            order.id === route.params.updatedOrder.id
              ? {
                  ...order,
                  paid: route.params.updatedOrder.paid,
                  status:
                    route.params.updatedOrder.paid >=
                    route.params.updatedOrder.total
                      ? "Completado"
                      : "Pendiente",
                }
              : order
          );
          setOrders(updatedOrders);
          setFilteredOrders(updatedOrders);
          saveOrders(updatedOrders);
        }
      } catch (error) {
        console.error("Error al manejar los pedidos:", error);
      }
    };

    addOrUpdateOrder();
  }, [route.params?.order, route.params?.updatedOrder]);

  const filterData = (filter: string) => {
    setActiveFilter(filter);
  
    if (filter === "Cotizaciones") {
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.is_cotizacion === true &&
            order.is_order === false &&
            order.is_invoice === false
        )
      );
    } else if (filter === "Órdenes") {
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.is_order === true &&
            order.is_cotizacion === true &&
            order.is_invoice === false
        )
      );
    } else if (filter === "Facturado") {
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.is_invoice === true &&
            order.is_cotizacion === true &&
            order.is_order === true
        )
      );
    }
  };

  // api
  useEffect(() => {
    const fetchShoppingCarts = async () => {
      try {
        const storedClienteId = await AsyncStorage.getItem("clienteId"); // Recupera clienteId de AsyncStorage
        if (!storedClienteId) {
          console.error("Cliente ID no encontrado");
          return;
        }
        const clienteId = parseInt(storedClienteId, 10); // Convierte a número
        const data = await fetchShoppingCartsApi(clienteId); // Llama a la API con clienteId dinámico
        setOrders(data); // Almacena los datos en el estado
        setFilteredOrders(data); // Inicializa los datos filtrados
      } catch (error) {
        console.error("Error al obtener los datos del carrito:", error);
      }
    };
  
    fetchShoppingCarts();
  }, []);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title="Mis ordenes"
        leftIcon="back"
        titleLeft
        rightIcon3={"home"}
      />
      <View
        style={[
          {
            padding: 0,
            //paddingHorizontal:15,
            backgroundColor: theme.dark ? "rgba(255,255,255,.1)" : colors.card,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.35,
            shadowRadius: 6.27,
            elevation: 5,
            height: 40,
            width: "100%",
          },
        ]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <View
            style={{
              width: 1,
              height: 40,
              backgroundColor: COLORS.primaryLight,
            }}
          />
          <TouchableOpacity
            onPress={() => filterData("Cotizaciones")}
            activeOpacity={0.5}
            style={styles.TopbarCenterLine}>
            <Image
              style={{
                height: 16,
                width: 16,
                resizeMode: "contain",
                tintColor:
                  activeFilter === "Pendiente" ? COLORS.primary : colors.title,
              }}
              source={IMAGES.budget}
            />
            <Text
              style={[
                FONTS.fontRegular,
                {
                  fontSize: 15,
                  color:
                    activeFilter === "Cotizaciones"
                      ? COLORS.primary
                      : colors.title,
                },
              ]}>
              Cotizaciones
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: 1,
              height: 40,
              backgroundColor: COLORS.primaryLight,
            }}
          />
          <TouchableOpacity
            onPress={() => filterData("Órdenes")}
            activeOpacity={0.5}
            style={styles.TopbarCenterLine}>
            <Image
              style={{
                height: 16,
                width: 16,
                resizeMode: "contain",
                tintColor:
                  activeFilter === "Completado" ? COLORS.primary : colors.title,
              }}
              source={IMAGES.savecheck}
            />
            <Text
              style={[
                FONTS.fontRegular,
                {
                  fontSize: 15,
                  color:
                    activeFilter === "Órdenes" ? COLORS.primary : colors.title,
                },
              ]}>
              Órdenes
            </Text>
          </TouchableOpacity>
          <View
            style={{
              width: 1,
              height: 40,
              backgroundColor: COLORS.primaryLight,
            }}
          />
          <TouchableOpacity
            onPress={() => filterData("Facturado")}
            activeOpacity={0.5}
            style={styles.TopbarCenterLine}>
            <Image
              style={{
                height: 16,
                width: 16,
                resizeMode: "contain",
                tintColor:
                  activeFilter === "Completado" ? COLORS.primary : colors.title,
              }}
              source={IMAGES.savecheck}
            />
            <Text
              style={[
                FONTS.fontRegular,
                {
                  fontSize: 15,
                  color:
                    activeFilter === "Facturado"
                      ? COLORS.primary
                      : colors.title,
                },
              ]}>
              Facturado
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            marginTop: 10,
            padding: 15,
            backgroundColor: theme.dark ? "rgba(255,255,255,.1)" : colors.card,
          }}>
          {/* Cuadro blanco con detalles del pedido */}
          {filteredOrders.map((order, index) => {
            // Determinar el color según el estado
            const textColor = order.is_invoice
              ? COLORS.success // Verde para facturado
              : order.is_order
              ? COLORS.blue // Azul para órdenes
              : COLORS.warning; // Amarillo para cotizaciones

            return (
              <View
                key={index}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 10,
                  padding: 15,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 5,
                  marginBottom: 15,
                  borderWidth: 1,
                  borderColor: textColor, // Color del borde según el estado
                }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Pedido", { order })}>
                  {/* ID del carrito */}
                  <Text
                    style={{
                      ...FONTS.fontRegular,
                      fontSize: 16,
                      color: colors.title,
                    }}>
                    Nro° de carrito:{" "}
                    <Text style={{ fontWeight: "bold", ...FONTS.fontRegular }}>
                      {order.id}
                    </Text>
                  </Text>

                  {/* Fecha de creación */}
                  <Text
                    style={{
                      ...FONTS.fontRegular,
                      fontSize: 16,
                      color: colors.title,
                      marginBottom: 10,
                    }}>
                    Fecha de creación:{" "}
                    <Text style={{ fontWeight: "bold", ...FONTS.fontRegular }}>
                      {order.created_at}
                    </Text>
                  </Text>

                  {/* Total */}
                  <Text
                    style={{
                      ...FONTS.fontRegular,
                      fontSize: 16,
                      color: textColor, // Color del texto según el estado
                      marginBottom: 10,
                    }}>
                    Total a pagar:{" "}
                    <Text style={{ fontWeight: "bold", ...FONTS.fontRegular }}>
                      {parseFloat(order.total).toFixed(2)}€{" "}
                      {/* Formatear a dos decimales */}
                    </Text>
                  </Text>

                  {/* Cantidad pedida (tip_cli) */}
                  <Text
                    style={{
                      ...FONTS.fontRegular,
                      fontSize: 16,
                      color: colors.title,
                      marginBottom: 10,
                    }}>
                    Cantidad pedida:{" "}
                    <Text style={{ fontWeight: "bold", ...FONTS.fontRegular }}>
                      {order.cliente?.tip_cli || "No disponible"}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  TopbarCenterLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: "30%",
    justifyContent: "center",
  },
});

export default Myorder;
