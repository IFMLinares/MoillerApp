import axios from "axios";
import { BASE_URL } from "./globalUrlApi";

export const fetchShoppingCartDetailsApi = async (cartId: number) => {
  try {
    const response = await axios.post(`${BASE_URL}api/cart/shopping_cart/`, {
      cart_id: cartId, // Envía el cart_id en el cuerpo de la solicitud
    });
    console.log("Datos obtenidos de la API (shoppingApi):", response.data);
    return response.data; // Devuelve los datos obtenidos
  } catch (error) {
    console.error(
      "Error al obtener los detalles del carrito (shoppingApi):",
      error.response?.data || error.message
    );
    throw error; // Lanza el error para manejarlo en el componente
  }
};