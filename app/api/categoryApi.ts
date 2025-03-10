import axios from 'axios';

export const fetchCategories = async () => {
  try {
    const response = await axios.get('http://10.0.2.2:8000/api/core/lineas/list', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const categories = response.data;
    return categories
      .map(category => ({
        id: category.co_lin?.trim() || '',
        name: category.lin_des?.trim() || '',
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente por nombre
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

export const fetchSubcategories = async () => {
  try {
    const response = await axios.get('http://10.0.2.2:8000/api/core/subl/list', {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const subcategories = response.data;
    return subcategories.map(subcategory => ({
      id: subcategory.co_subl?.trim() || '',
      name: subcategory.subl_des?.trim() || '',
      categoryId: subcategory.co_lin?.trim() || '',
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