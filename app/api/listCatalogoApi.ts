import axios from "axios";
import { BASE_URL } from './globalUrlApi'; // Importar la URL base

interface ApiArticle {
  id: number;
  co_art: string;
  art_des: string;
  sa_art_precio: { monto: number }[];
  tipo: string;
  co_lin: { lin_des: string };
  co_subl: { subl_des: string };
  co_color: { co_color: string; des_color: string };
  co_ubicacion: { des_ubicacion: string };
  sa_stock_almacen: { stock: number }[];
  detail_url: string;
  low_images: { image: string }[];
  high_images: { image: string }[];
  modelo?: string;
  volumen?: string;
  peso?: string;
  garantia?: string;
  co_cat: { cat_des: string };
}

export const fetchArticles = async (clienteId: number, page: number = 1) => {
  try {
    const response = await axios.get(
      `${BASE_URL}api/core/articles/list-by-cliente`,
      {
        params: { co_cli: clienteId, page, page_size: 10 },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { results, next } = response.data;

    // Mapea los artículos
    const articles = results.map((article: ApiArticle) => ({
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
      stock: article.sa_stock_almacen[0]?.stock || 0,
      detailUrl: article.detail_url,
      lowImage: article.low_images[0]?.image || "",
      highImage: article.high_images[0]?.image || "",
      model: article.modelo?.trim() || "",
      volume: article.volumen?.trim() || "",
      weight: article.peso?.trim() || "",
      warranty: article.garantia?.trim() || "",
      category: article.co_cat.cat_des?.trim() || "",
    }));

    return { articles, next };
  } catch (error) {
    console.error("Error al obtener los artículos:", error);
    throw error;
  }
};