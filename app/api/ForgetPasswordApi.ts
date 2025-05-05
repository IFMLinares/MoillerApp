import axios from "axios";
import { BASE_URL } from "./globalUrlApi";

export const sendResetCodeApi = async (email: string) => {
  try {
    const response = await axios.post(`${BASE_URL}api/users/send-reset-code/`, {
      email,
    });
    return response.data; // Devuelve la respuesta de la API
  } catch (error: any) {
    throw error.response?.data || error.message; // Lanza el error para manejarlo en el componente
  }
};