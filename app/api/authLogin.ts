import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './globalUrlApi'; // Importar la URL base

// Función para iniciar sesión
export const authLogin = async (username: string, password: string) => {
  try {
    console.log('Iniciando sesión con:', username, password);
    const response = await axios.post(`${BASE_URL}api/users/login/`, {
      username,
      password
    });
    console.log('Respuesta del servidor:', response.data);
    const { access, refresh } = response.data;
    await AsyncStorage.setItem('accessToken', access); // Guardar el token de acceso
    await AsyncStorage.setItem('refreshToken', refresh); // Guardar el token de actualización
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al iniciar sesión:', error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error('Error inesperado:', error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    throw new Error("Error al iniciar sesión. Por favor, inténtelo de nuevo.");
  }
};

// Función para refrescar el token de acceso
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No se encontró el token de actualización.');
    }

    const response = await axios.post(`${BASE_URL}api/users/token/refresh/`, {
      refresh: refreshToken,
    });

    const { access } = response.data;
    await AsyncStorage.setItem('accessToken', access); // Actualiza el token de acceso
    return access;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error al refrescar el token:', error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error('Error inesperado:', error.message);
    } else {
      console.error('Error desconocido:', error);
    }
    throw new Error('Error al refrescar el token. Por favor, inicie sesión nuevamente.');
  }
};