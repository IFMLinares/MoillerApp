export const openDrawer = () => {
    return {
        type: 'OPEN_DRAWER',
    };
};
export const closeDrawer = () => {
    return {
        type: 'CLOSE_DRAWER',
    };
};

import { Dispatch } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setClienteId = (clienteId: number | null) => async (dispatch: Dispatch) => {
  if (!clienteId || clienteId === 1) {
    console.error("Cliente ID inválido en la acción:", clienteId);
    return;
  }

  console.log("Cliente ID en la acción:", clienteId);
  await AsyncStorage.setItem("clienteId", clienteId.toString());
  dispatch({
    type: "SET_CLIENTE_ID",
    payload: clienteId,
  });
};