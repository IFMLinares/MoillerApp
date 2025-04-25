import axios from "axios";
import { BASE_URL } from './globalUrlApi'; // Importar la URL base

export const fetchArticles = async (clienteId: number) => {
  try {
    const response = await axios.get(
      `${BASE_URL}api/core/articles/random`,
      {
        params: { co_cli: clienteId  },
        headers: {
          "Content-Type": "application/json",
        },
      }
    ); 

const articles = response.data.map((article) => { 
  return {
    id: article.id,
    code: article.co_art.trim(),
    name: article.art_des.trim(),
    price: article.sa_art_precio?.[0]?.monto || 0,
    type: article.tipo.trim(),
    line: article.co_lin.lin_des.trim(),
    subline: article.co_subl.subl_des.trim(),
    color: article.co_color.co_color.trim(),
    subcolor: article.co_color.des_color.trim(),
    location: article.co_ubicacion.des_ubicacion.trim(),
    stock: article.sa_stock_almacen[0]?.stock || 0,
    detailUrl: article.detail_url,
    lowImage: article.low_images[0]?.image || "",
    highImage: article.high_images[0]?.image || "",
    model: article.modelo?.trim() || "",
    volume: article.volumen?.trim() || "",
    weight: article.peso?.trim() || "",
    warranty: article.garantia?.trim() || "",
    brand: article.co_cat.cat_des?.trim() || "",
  };
});

    return articles; // Retorna los artículos directamente
  } catch (error) {
    if (error.response) {
      console.error("Error en la respuesta del servidor:", error.response.data);
      console.error("Código de estado:", error.response.status);
      console.error("Encabezados:", error.response.headers);
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor:", error.request);
    } else {
      console.error("Error al configurar la solicitud:", error.message);
    }
    throw error;
  }
};