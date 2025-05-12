import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './globalUrlApi'; // Importar la URL base

// Función para iniciar sesión
export const authLogin = async (username: string, password: string) => {
  try {
    console.log('Iniciando sesión con:', username, password);
    const response = await axios.post(`${BASE_URL}api/users/login/`, {
      username,
      password,
    });
    console.log('Respuesta del servidor:', response.data);

    const { access, refresh, cliente_id, user_id } = response.data;

    // Validar cliente_id
    if (!cliente_id) {
      console.warn('Advertencia: cliente_id no es válido:', cliente_id);
      throw new Error('Error: cliente_id no es válido.');
    }

    // Manejar la ausencia de user_id
    if (!user_id) {
      console.warn('Advertencia: user_id no está presente en la respuesta.');
    }

    // Almacenar en AsyncStorage
    await AsyncStorage.setItem('accessToken', access);
    await AsyncStorage.setItem('refreshToken', refresh);
    await AsyncStorage.setItem('clienteId', cliente_id.toString());
    if (user_id) {
      await AsyncStorage.setItem('userId', user_id.toString());
    }

    console.log('Datos almacenados en AsyncStorage:', {
      cliente_id,
      user_id: user_id || 'No disponible',
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al iniciar sesión:', error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error('Error inesperado:', error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    throw new Error('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
  }
};

// Función para refrescar el token de accesoen 
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.warn("No se encontró el token de actualización. No se puede refrescar el token.");
      return null; // Retorna null en lugar de arrojar un error
    }

    const response = await axios.post(`${BASE_URL}api/users/token/refresh/`, {
      refresh: refreshToken,
    });

    const { access } = response.data;
    await AsyncStorage.setItem("accessToken", access); // Actualiza el token de acceso
    return access;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al refrescar el token:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error inesperado:", error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    throw new Error("Error al refrescar los datos del usuario. Por favor, inicie sesión nuevamente.");
  }
};
 