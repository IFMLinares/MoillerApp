import axios from "axios";
import { BASE_URL } from "./globalUrlApi"; 

export const getCartItemsApi = async (clienteId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}api/cart/`, {
      params: { cliente_id: clienteId },
    });

    if (response.data.items && response.data.items.length > 0) {
      console.log("Productos en el carrito:", response.data.items);
      return response.data;
    } else {
      console.warn("No existe un carrito de compras o está vacío.");
      return { items: [] };
    }
  } catch (error: any) {
    // Maneja el error 404 como carrito vacío
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn("No existe un carrito de compras o está vacío (404).");
      return { items: [] };
    }
    // Otros errores sí los lanzamos
    if (axios.isAxiosError(error)) {
      console.error(
        "Error al obtener los productos del carrito:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error desconocido:", error);
    }
    throw error;
  }
};