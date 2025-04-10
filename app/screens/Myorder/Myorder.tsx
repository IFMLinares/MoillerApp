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

type MyorderScreenProps = StackScreenProps<RootStackParamList, "Myorder">;

const Myorder = ({ navigation, route }: MyorderScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [activeFilter, setActiveFilter] = useState("all"); // Track active filter
  const [orders, setOrders] = useState([]); // Estado inicial vacío
  const [filteredOrders, setFilteredOrders] = useState(orders);

  // Cargar pedidos al iniciar
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

  const saveOrders = async (newOrders) => {
    try {
      await AsyncStorage.setItem("orders", JSON.stringify(newOrders));
    } catch (error) {
      console.error("Error al guardar los pedidos:", error);
    }
  };

  // Manejar nuevos pedidos o actualizaciones
  useEffect(() => {
    const addOrUpdateOrder = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem("orders");
        const existingOrders = storedOrders ? JSON.parse(storedOrders) : [];
  
        if (route.params?.order) {
          // Agregar una nueva orden al inicio del estado existente
          const newOrders = [route.params.order, ...existingOrders];
          setOrders(newOrders);
          setFilteredOrders(newOrders);
          saveOrders(newOrders); // Guardar en AsyncStorage
        } else if (route.params?.updatedOrder) {
          // Actualizar una orden existente
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
          saveOrders(updatedOrders); // Guardar en AsyncStorage
        }
      } catch (error) {
        console.error("Error al manejar los pedidos:", error);
      }
    };
  
    addOrUpdateOrder();
  }, [route.params?.order, route.params?.updatedOrder]);

  const filterData = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === filter));
    }
  };

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
            onPress={() => filterData("Pendiente")}
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
                    activeFilter === "Pendiente"
                      ? COLORS.primary
                      : colors.title,
                },
              ]}>
              Pendiente
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
            onPress={() => filterData("Completado")}
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
                    activeFilter === "Completado"
                      ? COLORS.primary
                      : colors.title,
                },
              ]}>
              Completado
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
        {filteredOrders.map((order, index) => (
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
              borderColor:
                order.status === "Completado" ? COLORS.success : COLORS.warning,
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Pedido", { order })}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    ...FONTS.fontRegular,
                    fontSize: 16,
                    color: colors.title,
                  }}>
                  Nro° de orden:{" "}
                  <Text style={{ fontWeight: "bold",...FONTS.fontRegular, }}>{order.id}</Text>
                </Text>
                <Text
                  style={{
                    ...FONTS.fontRegular,
                    fontSize: 16,
                    color:
                      order.status === "Completado"
                        ? COLORS.success
                        : COLORS.warning,
                  }}>
                  Status:{" "}
                  <Text style={{ fontWeight: "bold",...FONTS.fontRegular, }}>{order.status}</Text>
                </Text>
              </View>
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 16,
                  color: colors.title,
                  marginBottom: 10,
                }}>
                Cantidad de productos:{" "}
                <Text style={{ fontWeight: "bold",...FONTS.fontRegular, }}>{order.productCount}</Text>
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    ...FONTS.fontRegular,
                    fontSize: 16,
                    color: colors.title,
                  }}>
                  Total:{" "}
                  <Text style={{ fontWeight: "bold",...FONTS.fontRegular, }}>{order.total}€</Text>
                </Text>
                {/* <Text
                  style={{
                    ...FONTS.fontRegular,
                    fontSize: 16,
                    color: COLORS.success,
                  }}>
                  Abonado:{" "}
                  <Text style={{ fontWeight: "bold",...FONTS.fontRegular, }}>{order.paid}€</Text>
                </Text>
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 16,
                  color: COLORS.warning,
                }}>
                Restante:{" "}
                <Text style={{ fontWeight: "bold" ,...FONTS.fontRegular,}}>
                  {(order.total - order.paid).toFixed(2)}€
                </Text>
              </Text> */}
              </View>
            </TouchableOpacity>
          </View>
        ))}
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
    width: "40%",
    justifyContent: "center",
  },
});

export default Myorder;
