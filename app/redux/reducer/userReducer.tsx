import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clienteId: null, // Valor inicial
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CLIENTE_ID":
      if (!action.payload || action.payload === 1) {
        console.error("Cliente ID inválido en el reducer:", action.payload);
        return state;
      }
      console.log("Cliente ID en el reducer:", action.payload);
      return {
        ...state,
        clienteId: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;