import axios from 'axios';

export const authLogin = async (username: string, password: string) => {
  try {
    const response = await axios.post('http://10.0.2.2:8000/api/users/login/', {
      username,
      password
    });
    return response.data;
  } catch (error) {
    throw new Error("Error al iniciar sesión. Por favor, inténtelo de nuevo.");
  }
};