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
    const response = await axios.get(`${BASE_URL}api/core/categories/list`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verificar que los datos de la API sean un array
    if (!Array.isArray(response.data)) {
      throw new Error("La respuesta de la API no es un array.");
    }

    // Mapear las marcas correctamente
    const brands = response.data.map((brand: { co_cat: string; cat_des: string }) => {
      return {
        id: brand.co_cat?.trim() || "", // Usar "co_cat" como ID único
        name: brand.cat_des?.trim() || "Sin nombre", // Usar "cat_des" como nombre de la marca
      };
    });

    console.log("Marcas mapeadas correctamente:", brands);

    return brands.sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente
  } catch (error) {
    console.error("Error al obtener las marcas:", error);
    throw error;
  }
};
