export const openDrawer = () => {
    return {
        type: 'OPEN_DRAWER',
    };
};
export const closeDrawer = () => {
    return {
        type: 'CLOSE_DRAWER',
    };
};

export const setClienteId = (clienteId) => {
    console.log("Cliente ID en la acción:", clienteId); // Verifica el valor aquí
    return {
      type: "SET_CLIENTE_ID",
      payload: clienteId,
    };
  };