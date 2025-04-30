import axios from "axios";
import { BASE_URL } from "./globalUrlApi";

export const addItemToCartApi = async (clienteId: number, articulo: number, cantidad: number) => {
    const payload = {
      cliente_id: clienteId, // Asegúrate de que este campo coincida con lo que espera la API
      articulo,
      cantidad,
    };
  
    console.log("Datos enviados a la API de carrito:", payload); // Verifica los datos enviados
  
    try {
      const response = await axios.post(`${BASE_URL}api/cart/add/`, payload);
      return response.data;
    } catch (error: any) { // Cambiar el tipo de error a `any`
      console.error("Error al añadir el producto al carrito:", error.response?.data || error.message);
      throw error;
    }
  };