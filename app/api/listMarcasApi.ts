import axios from "axios";
import { BASE_URL } from './globalUrlApi'; // Importar la URL base
export const fetchArticles = async (brandName?: string, page = 1, limit = 6) => {
  try {
    const response = await axios.get(
      `${BASE_URL}api/core/articles/list`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const articles = response.data
      .map((article) => ({
        id: article.id,
        code: article.co_art.trim(),
        name: article.art_des.trim(),
        price: article.sa_art_precio[0]?.monto || 0,
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
        brand: article.co_cat.cat_des?.trim() || "", // Campo que identifica la marca
      }))
      .filter((article) => article.stock > 0); // Filtrar productos con stock > 0

    // Si se proporciona `brandName`, filtrar los artículos por marca
    const filteredArticles = brandName
      ? articles.filter((article) => article.brand === brandName)
      : articles;

    // Implementar paginación
    const startIndex = (page - 1) * limit;
    const paginatedArticles = filteredArticles.slice(startIndex, startIndex + limit);

    return paginatedArticles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};