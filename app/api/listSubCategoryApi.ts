import axios from "axios";
import { BASE_URL } from "./globalUrlApi"; // Importar la URL base

export const fetchProductsBySubcategory = async (
  co_subl: string,
  co_cli: string,
  page: number = 1,
  orderBy: string = "name"
) => {
  try {
    console.log("Llamando a la API con:", { co_subl, co_cli, page, orderBy }); // Depuración
    const response = await axios.get(
      `${BASE_URL}api/core/articles/list-by-cliente`,
      {
        params: {
          co_cli: co_cli, // Cliente ID
          co_subl: co_subl, // Subcategoría ID (actualizado)
          page: page, // Página para la paginación
          order_by: orderBy, // Ordenar por nombre
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
      results: response.data.results.map((article: any) => ({
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
        video: article.video?.trim() || "",
        fichaTecnica: article.ficha_tecnica?.trim() || "",
        precio_cliente: article.precio_cliente || 0,
      })),
    };
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    throw error;
  }
};
