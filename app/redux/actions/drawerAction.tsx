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

export const setClienteId = (clienteId) => ({
    type: "SET_CLIENTE_ID",
    payload: clienteId,
  });