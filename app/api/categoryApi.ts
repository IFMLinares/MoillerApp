import axios from "axios";
import { BASE_URL } from "./globalUrlApi"; // Importar la URL base

// Definir la interfaz para los datos de categoría
interface CategoryApiResponse {
  co_lin: string;
  lin_des: string;
}

export const fetchCategories = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}api/core/lineas/list`, // Nueva URL para categorías
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Mapear las categorías directamente desde la nueva estructura de datos
    const categories = response.data.map((category: CategoryApiResponse) => ({
      id: category.co_lin.trim(),
      name: category.lin_des.trim(),
    }));

    // Tipar explícitamente los parámetros a y b en el método sort
    return categories.sort(
      (a: { id: string; name: string }, b: { id: string; name: string }) =>
        a.name.localeCompare(b.name)
    ); // Ordenar alfabéticamente
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al obtener las categorías:", error.message);
    } else {
      console.error("Error desconocido al obtener las categorías:", error);
    }
    throw error;
  }
};

// Definir la interfaz para los datos de subcategoría
interface SubcategoryApiResponse {
  co_subl: string | null;
  subl_des: string | null;
}
export const fetchSubcategories = async (categoryId: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}api/core/subl/list?co_lin=${categoryId}`, // Agregar el parámetro co_lin
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Mapear las subcategorías devueltas por la API
    const subcategories = response.data.map((subcategory: SubcategoryApiResponse) => ({
      id: subcategory.co_subl ? subcategory.co_subl.trim() : null,
      name: subcategory.subl_des ? subcategory.subl_des.trim() : "Sin nombre",
    }));

    return subcategories;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al obtener las subcategorías:", error.message);
    } else {
      console.error("Error desconocido al obtener las subcategorías:", error);
    }
    throw error;
  }

};

// Definir la interfaz para los datos de los artículos
interface ArticleApiResponse {
  co_cat: {
    cat_des: string;
  } | null;
  sa_stock_almacen: {
    stock: number;
  }[];
}

export const fetchBrands = async () => {
  try {
    const response = await axios.get(`${BASE_URL}api/core/articles/list`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Filtrar y mapear las marcas únicas basadas en "co_cat"
    const brands = Array.from(
      new Map(
        response.data
          .filter((article: ArticleApiResponse) =>
            article.co_cat &&
            article.co_cat.cat_des &&
            article.sa_stock_almacen[0]?.stock > 0
          ) // Filtrar artículos con "co_cat" y stock > 0
          .map((article: ArticleApiResponse) => [
            article.co_cat!.cat_des.trim(), // Usar "cat_des" como clave única
            {
              id: article.co_cat!.cat_des.trim(), // ID único basado en "cat_des"
              name: article.co_cat!.cat_des.trim(), // Nombre de la marca
            },
          ])
      ).values()
    );

    return brands.sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al obtener las marcas:", error.message);
    } else {
      console.error("Error desconocido al obtener las marcas:", error);
    }
    throw error;
  }
};
