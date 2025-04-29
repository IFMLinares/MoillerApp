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

const Route = () => {
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();

  useEffect(() => {
    const loadClienteId = async () => {
      try {
        const storedClienteId = await AsyncStorage.getItem("clienteId");
        if (storedClienteId && parseInt(storedClienteId, 10) !== 1) {
          dispatch(setClienteId(parseInt(storedClienteId, 10))); // Actualiza Redux
          console.log(
            "Cliente ID cargado desde AsyncStorage:",
            storedClienteId
          );
        } else {
          console.error(
            "Cliente ID inválido en AsyncStorage:",
            storedClienteId
          );
        }
      } catch (error) {
        console.error("Error al cargar clienteId desde AsyncStorage:", error);
      }
    };

    loadClienteId();
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
