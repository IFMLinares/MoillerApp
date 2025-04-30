import axios from "axios";
import { BASE_URL } from "./globalUrlApi";

export const convertCartToCotizacion = async (
  clienteId: number,
  cartId: number,
  additionalNotes: string // Nuevo parámetro para las notas adicionales
) => {
  try {
    console.log("Datos enviados a la API:", { cliente_id: clienteId, cart_id: cartId });
    const response = await axios.post(`${BASE_URL}api/cart/convert_to_cotizacion/`, {
      cliente_id: clienteId,
      cart_id: cartId,
      comentario: additionalNotes, // Incluye las notas adicionales
    });
    return response.data;
  } catch (error) {
    console.error("Error al convertir el carrito a cotización:", error.response?.data || error.message);
    throw error;
  }
};