const initialState = {
  clienteId: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CLIENTE_ID":
      return {
        ...state,
        clienteId: action.payload, // Guarda el clienteId en el estado
      };
    default:
      return state;
  }
};

export default userReducer;