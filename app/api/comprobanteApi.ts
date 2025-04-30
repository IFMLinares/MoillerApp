import axios from "axios";
import { BASE_URL } from "./globalUrlApi";

export const uploadComprobantePagoApi = async (cartId: number, fileUri: string, fileType: string) => {
    const formData = new FormData();
    formData.append("cart_id", cartId.toString());
    formData.append("comprobante_pago", {
      uri: fileUri,
      name: `comprobante_pago.${fileType.split("/")[1]}`, // Nombre del archivo con extensión
      type: fileType, // Tipo MIME
    });
  
    console.log("FormData enviado:", formData);
  
    try {
      const response = await axios.post(
        `${BASE_URL}api/cart/shopping_cart/upload_comprobante_pago/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error al subir el comprobante de pago:", error.response?.data || error.message);
      throw error;
    }
  };