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
import { RootState } from "../reducer"; // Ajusta la ruta según la ubicación de tu archivo reducer

export const setClienteId = (clienteId: number | null) => async (dispatch: Dispatch, getState: () => RootState) => {
  const currentClienteId = getState().user.clienteId;

  console.log('Intentando establecer clienteId:', clienteId);
  console.log('Estado actual de clienteId en Redux:', currentClienteId);

  if (!clienteId || clienteId === 1) {
    console.warn('Advertencia: clienteId inválido recibido:', clienteId);
    return;
  }

  if (currentClienteId && currentClienteId !== 1 && currentClienteId !== null) {
    console.log(
      'El clienteId ya está configurado en Redux y no será sobrescrito:',
      currentClienteId
    );
    return;
  }

  console.log('Estableciendo clienteId en Redux y AsyncStorage:', clienteId);
  await AsyncStorage.setItem('clienteId', clienteId.toString());
  dispatch({
    type: 'SET_CLIENTE_ID',
    payload: clienteId,
  });
};

export const syncClienteId = () => async (dispatch: Dispatch) => {
  try {
    const storedClienteId = await AsyncStorage.getItem('clienteId');
    const storedUserId = await AsyncStorage.getItem('userId');

    console.log('Datos leídos desde AsyncStorage:', {
      storedClienteId,
      storedUserId,
    });

    if (!storedClienteId || !storedUserId || storedClienteId === storedUserId) {
      console.warn(
        'Advertencia: clienteId y userId no son válidos o coinciden:',
        { storedClienteId, storedUserId }
      );
      return;
    }

    dispatch({
      type: 'SET_CLIENTE_ID',
      payload: parseInt(storedClienteId, 10),
    });
  } catch (error) {
    console.error('Error al sincronizar clienteId:', error);
  }
};