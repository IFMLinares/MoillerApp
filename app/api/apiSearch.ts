import axios from "axios";
import { BASE_URL } from './globalUrlApi'; // Importar la URL base

// filepath: c:\xampp\htdocs\app\MollierApp\MoillerApp\app\api\apiSearch.ts
export interface Article {
  id: number;
  co_art: string;
  name?: string; // Agrega esta propiedad opcional
  art_des: string;
  sa_art_precio: { monto: number }[];
  tipo: string;
  co_lin: { lin_des: string };
  co_subl: { subl_des: string };
  co_color: { co_color: string; des_color: string };
  co_ubicacion: { des_ubicacion: string };
  sa_stock_almacen: { stock: number }[];
  detail_url: string;
  low_images: { image: string }[]; // Mantén la propiedad original
  lowImage?: string; // Agrega esta propiedad para reflejar el mapeo
  high_images: { image: string }[];
  modelo?: string;
  volumen?: string;
  peso?: string;
  garantia?: string;
  co_cat: { cat_des: string };
}

export const searchArticles = async (query: string): Promise<Article[]> => {
  console.log("Iniciando búsqueda de artículos con query:", query); // Log inicial

  try {
    const response = await axios.get(`${BASE_URL}api/core/articles/search/`, {
      params: { q: query },
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Respuesta completa de la API:", response.data); // Log de la respuesta completa
    console.log("Resultados obtenidos:", response.data.results); // Log de los resultados específicos

    return response.data.results.map((article: Article) => ({
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
      brand: article.co_cat.cat_des?.trim() || "",
    }));
  } catch (error) {
    console.error("Error al buscar artículos por query:", error); // Log de error
    return [];
  }
};