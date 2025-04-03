import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Token de acceso:', token); // Verificar el token
      if (!token) throw new Error('Token no disponible');
  
      const response = await axios.get('http://10.0.2.2:8000/api/users/user/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Respuesta de la API:', response.data); // Verificar la respuesta
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener la información del usuario:', error.message);
      throw new Error('Error al obtener la información del usuario.');
    }
  };