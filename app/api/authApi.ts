import axios from 'axios';

export const fetchArticles = async () => {
  try {
    const response = await axios.get('http://10.0.2.2:8000/api/core/articles/list', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const articles = response.data.slice(0, 12); // Obtener solo los primeros 12 artículos
    return articles.map(article => ({
        id: article.id,
        code: article.co_art.trim(),
        name: article.art_des.trim(),
        price: article.sa_art_precio[0].monto,
        type: article.tipo.trim(),
        line: article.co_lin.lin_des.trim(),
        subline: article.co_subl.subl_des.trim(), // Añadir subcategoría
        color: article.co_color.co_color.trim(),
        subcolor: article.co_color.des_color.trim(),
        location: article.co_ubicacion.des_ubicacion.trim(),
        stock: article.sa_stock_almacen[0].stock,
        detailUrl: article.detail_url,
    }));
  } catch (error) {
    if (error.response) {
      console.error('Error en la respuesta del servidor:', error.response.data);
      console.error('Código de estado:', error.response.status);
      console.error('Encabezados:', error.response.headers);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      console.error('Error al configurar la solicitud:', error.message);
    }
    throw error;
  }
};