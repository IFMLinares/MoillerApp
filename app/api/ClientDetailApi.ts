import axios from "axios";
import { BASE_URL } from "./globalUrlApi";

export const getClientDetail = async (clienteId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}api/clients/detail/`, {
      params: { id: clienteId }, // Cambia 'clienteId' por 'id'
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error al obtener los detalles del cliente:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};