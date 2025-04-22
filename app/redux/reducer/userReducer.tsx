const initialState = {
  clienteId: null, // Valor inicial
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CLIENTE_ID":
      console.log("Cliente ID en el reducer:", action.payload); // Verifica el valor aquí
      return {
        ...state,
        clienteId: action.payload, // Actualiza el clienteId en el estado
      };
    default:
      return state;
  }
};

export default userReducer;