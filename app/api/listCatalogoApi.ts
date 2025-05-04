import axios from "axios";
import { BASE_URL } from "./globalUrlApi"; // Importar la URL base

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
  video?: string;
  ficha_tecnica?: string;
}

export const fetchArticles = async (
  clienteId: number,
  page: number = 1,
  mostSold: boolean = false,
  orderBy: string = "fecha", // Nuevo parámetro opcional con valor predeterminado "fecha"
  offer: boolean = false // Nuevo parámetro para filtrar por ofertas
) => {
  try {
    const params: any = { co_cli: clienteId, page, page_size: 10 };
    if (mostSold) {
      params.most_sold = true;
    }
    if (orderBy === "alfabetico") {
      params.order_by_name = true; // Agrega este parámetro para ordenar alfabéticamente
    } else if (orderBy === "fecha") {
      params.order_by_fecha = true; // Ordena por fecha (valor predeterminado)
    }
    if (offer) {
      params.oferta = true; // Filtrar por ofertas
    }

    const response = await axios.get(
      `${BASE_URL}api/core/articles/list-by-cliente`,
      {
        params,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { results, next } = response.data;

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
      brand: article.co_cat.cat_des?.trim() || "",
      volume: article.volumen?.trim() || "",
      weight: article.peso?.trim() || "",
      warranty: article.garantia?.trim() || "",
      category: article.co_cat.cat_des?.trim() || "",
      video: article.video?.trim() || "",
      fichaTecnica: article.ficha_tecnica?.trim() || "",
    }));

    return { articles, next };
  } catch (error) {
    console.error("Error al obtener los artículos:", error);
    throw error;
  }
};
