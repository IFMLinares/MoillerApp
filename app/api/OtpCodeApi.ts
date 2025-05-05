import axios from "axios";
import { BASE_URL } from "./globalUrlApi";

export const validateResetCodeApi = async (
    email: string,
    reset_code: string,
    new_password: string
  ) => {
    try {
      console.log("Datos enviados a la API:", { email, reset_code, new_password });
      const response = await axios.post(`${BASE_URL}api/users/validate-reset-code/`, {
        email,
        reset_code,
        new_password,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error en la API:", error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  };