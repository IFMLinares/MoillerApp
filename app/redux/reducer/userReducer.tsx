const initialState = {
  clienteId: null, // Valor inicial
};

const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_CLIENTE_ID':
      if (!action.payload || action.payload === 1) {
        console.warn('Advertencia: clienteId inválido recibido en el reducer:', action.payload);
        return state;
      }
      if (state.clienteId && state.clienteId !== 1 && state.clienteId !== null) {
        console.log(
          'El clienteId ya está configurado en el estado y no será sobrescrito:',
          state.clienteId
        );
        return state;
      }
      console.log('Actualizando clienteId en el reducer:', action.payload);
      return {
        ...state,
        clienteId: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;