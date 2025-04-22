import axios from "axios";
import { BASE_URL } from "./globalUrlApi";

export const fetchShoppingCartsApi = async (clienteId: number) => {
  try {
    const response = await axios.post(`${BASE_URL}api/cart/shopping_carts/`, {
      cliente_id: clienteId, // Envía el cliente_id en el cuerpo de la solicitud
    });
    console.log("Datos obtenidos de la API (shoppingListApi):", response.data);
    return response.data; // Devuelve los datos obtenidos
  } catch (error) {
    console.error("Error al obtener los datos del carrito (shoppingListApi):", error.response?.data || error.message);
    throw error; // Lanza el error para manejarlo en el componente
  }
};