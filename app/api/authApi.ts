import axios from "axios";

export const fetchArticles = async () => {
  try {
    const response = await axios.get(
      "http://10.0.2.2:8000/api/core/articles/list",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const articles = response.data.map((article) => ({
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
      brand: article.co_cat.cat_des?.trim() || "", // Mapea "cat_des" como "brand"
    }));

    // Mezclar los artículos al azar
    const shuffledArticles = articles.sort(() => Math.random() - 0.5);

    return shuffledArticles.slice(0, 12); // Retorna solo los primeros 12 productos mezclados
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

