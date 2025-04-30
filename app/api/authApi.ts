import axios from "axios";
import { BASE_URL } from './globalUrlApi'; // Importar la URL base

interface ApiArticle {
  id: number;
  co_art: string;
  art_des: string;
  sa_art_precio?: { monto: number }[];
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

export interface Article {
  id: number;
  code: string;
  name: string;
  price: number;
  type: string;
  line: string;
  subline: string;
  color: string;
  subcolor: string;
  location: string;
  stock: number;
  detailUrl: string;
  lowImage: string;
  highImage: string;
  model: string;
  volume: string;
  weight: string;
  warranty: string;
  brand: string;
}

export const fetchArticles = async (clienteId: number, limit: number = 12): Promise<Article[]> => {
  try {
    const response = await axios.get<ApiArticle[]>(
      `${BASE_URL}api/core/articles/random`,
      {
        params: { co_cli: clienteId, limit },
        headers: { "Content-Type": "application/json" },
      }
    );

    // Mapeo de los datos de la API al formato de Article
    return response.data.map((article: ApiArticle) => ({
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
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error en la respuesta del servidor:", error.response.data);
        console.error("Código de estado:", error.response.status);
        console.error("Encabezados:", error.response.headers);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
      }
    } else if (error instanceof Error) {
      console.error("Error al configurar la solicitud:", error.message);
    } else {
      console.error("Error desconocido:", error);
    }
    throw error;
  }
};