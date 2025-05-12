import React, { useEffect } from "react";
import StackNavigator from "./StackNavigator";
import { ThemeContextProvider } from "../constants/ThemeContext";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../redux/store"; // Asegúrate de que este sea el path correcto a tu store
import { setClienteId } from "../redux/actions/drawerAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { initializeCart } from "../redux/reducer/cartReducer"; // Asegúrate de que este sea el path correcto a tu reducer
import { syncClienteId } from "../redux/actions/drawerAction";

const Route = () => {
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();

  useEffect(() => {
    dispatch(syncClienteId()); // Sincroniza el clienteId al iniciar la app
  }, []);

useEffect(() => {
  const loadClienteId = async () => {
    try {
      const storedClienteId = await AsyncStorage.getItem("clienteId");
      const parsedClienteId = storedClienteId ? parseInt(storedClienteId, 10) : null;

      if (parsedClienteId && parsedClienteId !== 1) {
        console.log("Cliente ID cargado desde AsyncStorage:", parsedClienteId);
        dispatch(setClienteId(parsedClienteId));
      } else {
        console.error("Cliente ID inválido en AsyncStorage:", storedClienteId);
      }
    } catch (error) {
      console.error("Error al cargar clienteId desde AsyncStorage:", error);
    }
  };

  loadClienteId();
}, [dispatch]);

  useEffect(() => {
    const loadCartFromStorage = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("cart");
        if (storedCart) {
          dispatch(initializeCart(JSON.parse(storedCart))); // Inicializa el carrito en Redux
        }
      } catch (error) {
        console.error("Error al cargar el carrito desde AsyncStorage:", error);
      }
    };

    loadCartFromStorage();
  }, [dispatch]);

  const checkClienteId = async () => {
    const storedClienteId = await AsyncStorage.getItem("clienteId");
    console.log("Cliente ID restaurado desde AsyncStorage:", storedClienteId);
  };

  useEffect(() => {
    checkClienteId();
  }, []);
  return (
    <ThemeContextProvider>
      <StackNavigator />
      <Toast />
    </ThemeContextProvider>
  );
};

export default Route;
