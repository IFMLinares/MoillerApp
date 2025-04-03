import axios from "axios";

export const fetchCategories = async () => {
  try {
    const response = await axios.get(
      "http://10.0.2.2:8000/api/core/articles/list",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extraer y mapear las categorías únicas directamente
    const categories = Array.from(
      new Map(
        response.data.map((article) => [
          article.co_lin.co_lin.trim(),
          {
            id: article.co_lin.co_lin.trim(),
            name: article.co_lin.lin_des.trim(),
          },
        ])
      ).values()
    );

    return categories.sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente
  } catch (error) {
    console.error("Error al obtener las categorías:", error.message);
    throw error;
  }
};

export const fetchSubcategories = async (categoryId) => {
  try {
    const response = await axios.get(
      "http://10.0.2.2:8000/api/core/articles/list",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Filtrar por categoría y mapear las subcategorías únicas directamente
    const subcategories = Array.from(
      new Map(
        response.data
          .filter((article) => article.co_lin.co_lin.trim() === categoryId)
          .map((article) => [
            article.co_subl.co_subl.trim(),
            {
              id: article.co_subl.co_subl.trim(),
              name: article.co_subl.subl_des.trim(),
            },
          ])
      ).values()
    );

    return subcategories;
  } catch (error) {
    console.error("Error al obtener las subcategorías:", error.message);
    throw error;
  }
};

export const fetchBrands = async () => {
  try {
    const response = await axios.get(
      "http://10.0.2.2:8000/api/core/articles/list",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Filtrar y mapear las marcas únicas basadas en "co_cat"
    const brands = Array.from(
      new Map(
        response.data
          .filter(
            (article) =>
              article.co_cat &&
              article.co_cat.cat_des &&
              article.sa_stock_almacen[0]?.stock > 0
          ) // Filtrar artículos con "co_cat" y stock > 0
          .map((article) => [
            article.co_cat.cat_des.trim(), // Usar "cat_des" como clave única
            {
              id: article.co_cat.cat_des.trim(), // ID único basado en "cat_des"
              name: article.co_cat.cat_des.trim(), // Nombre de la marca
            },
          ])
      ).values()
    );

    return brands.sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente
  } catch (error) {
    console.error("Error al obtener las marcas:", error.message);
    throw error;
  }
};
