import axios from "axios";
import { BASE_URL } from "./globalUrlApi"; 

export const getCartItemsApi = async (clienteId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}api/cart/`, {
      params: { cliente_id: clienteId }, // Envía el clienteId como parámetro
    });
    console.log("Productos en el carrito:", response.data); // Muestra los datos en la consola
    return response.data;
  } catch (error: unknown) { // Declara el tipo de error como "unknown"
    if (axios.isAxiosError(error)) { // Verifica si el error es de Axios
      console.error("Error al obtener los productos del carrito:", error.response?.data || error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    throw error;
  }
};