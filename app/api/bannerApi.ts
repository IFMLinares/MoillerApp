import axios from "axios";
import { BASE_URL } from "./globalUrlApi"; // Importar la URL base



export const fetchBanners = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/banners/active-banners/`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los banners:", error);
    return []; // Retorna un array vacío en caso de error
  }
};