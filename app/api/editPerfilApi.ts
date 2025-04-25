import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshAccessToken } from './authLogin';
import { BASE_URL } from './globalUrlApi'; // Importar la URL base

export const getUserInfo = async () => {
  try {
    let token = await AsyncStorage.getItem('accessToken');
    console.log('Token de acceso inicial:', token); // Verificar el token

    // Si no hay token o el token ha expirado, intenta refrescarlo
    if (!token) {
      token = await refreshAccessToken();
    }

    // Realiza la solicitud con el token válido
    const response = await axios.get(`${BASE_URL}api/users/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Respuesta de la API:', response.data); // Verificar la respuesta
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener la información del usuario:', error.message);

    // Si el error es de autenticación (401), intenta refrescar el token
    if (error.response && error.response.status === 401) {
      try {
        console.log('Intentando refrescar el token...');
        const newToken = await refreshAccessToken();
        const retryResponse = await axios.get(`${BASE_URL}api/users/user/`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });
        return retryResponse.data;
      } catch (refreshError) {
        console.error('Error al refrescar el token:', refreshError.message);
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }
    }

    throw new Error('Error al obtener la información del usuario.');
  }
};