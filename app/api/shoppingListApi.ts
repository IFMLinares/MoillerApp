import axios from "axios";
import { BASE_URL } from "./globalUrlApi";

export const fetchShoppingCartsApi = async (clienteId: number) => {
  try {
    const response = await axios.post(`${BASE_URL}api/cart/shopping_carts/`, {
      cliente_id: clienteId,
    });
    const ids = response.data.map((item: any) => item.id);
    console.log("IDs obtenidos de la API (shoppingListApi):", ids);
    return response.data;
  } catch (error: any) { // Cambiar el tipo de error a "any"
    console.error(
      "Error al obtener los datos del carrito (shoppingListApi):",
      error.response?.data || error.message
    );
    throw error;
  }
};