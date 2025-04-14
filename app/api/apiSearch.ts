import axios from "axios";
import { BASE_URL } from './globalUrlApi'; // Importar la URL base

export const fetchArticles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}api/core/articles/list`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.map((article) => ({
      id: article.id,
      code: article.co_art.trim(),
      name: article.art_des.trim(),
      price: article.sa_art_precio[0].monto,
      type: article.tipo.trim(),
      line: article.co_lin.lin_des.trim(),
      subline: article.co_subl.subl_des.trim(),
      color: article.co_color.co_color.trim(),
      subcolor: article.co_color.des_color.trim(),
      location: article.co_ubicacion.des_ubicacion.trim(),
      stock: article.sa_stock_almacen[0].stock,
      detailUrl: article.detail_url,
      lowImage: article.low_images[0]?.image || "",
      highImage: article.high_images[0]?.image || "",
      // Nuevos datos añadidos
      model: article.modelo?.trim() || "",
      volume: article.volumen?.trim() || "",
      weight: article.peso?.trim() || "",
      warranty: article.garantia?.trim() || "",
      brand: article.co_cat.cat_des?.trim() || "",
    }));
  } catch (error) {
    console.error("Error al buscar artículos:", error);
    return [];
  }
};