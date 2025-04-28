import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './globalUrlApi'; // Importar la URL base

export const cerrarSesion = async () => {
  try {
    // Obtener el token de acceso y el token de actualización
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      throw new Error('No se encontraron los tokens necesarios para cerrar sesión.');
    }

    // Realizar la solicitud a la API de cierre de sesión
    await axios.post(
      `${BASE_URL}api/users/logout/`,
      { refreshToken }, // Enviar el refreshToken en el cuerpo de la solicitud
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Enviar el token de acceso en los encabezados
        },
      }
    );

    // Eliminar los tokens almacenados localmente
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');

    console.log('Sesión cerrada exitosamente.');
  } catch (error: any) {
    console.error('Error al cerrar sesión:', error.message);
    throw new Error('No se pudo cerrar la sesión. Intente nuevamente.');
  }
};