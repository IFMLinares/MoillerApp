import axios from "axios";
import { BASE_URL } from "./globalUrlApi";

export const deleteItemFromCartApi = async (clienteId: number, itemId: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}api/cart/delete/`, {
      data: {
        cliente_id: clienteId, // ID del cliente
        item_id: itemId, // Cambiado a item_id para coincidir con la API
      },
    });
    console.log("Producto eliminado del carrito:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error.response?.data || error.message);
    throw error;
  }
};