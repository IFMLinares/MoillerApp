import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    addToCart: (state: any, action: any) => {
      const itemInCart = state.cart.find((item: any) => item.id === action.payload.id);
      if (itemInCart) {
        // Si el producto ya está en el carrito, suma las cantidades
        itemInCart.quantity += action.payload.quantity;
      } else {
        // Si el producto no está en el carrito, añádelo con la cantidad inicial
        state.cart.push({ ...action.payload });
      }
    },
    removeFromCart: (state: any, action: any) => {
      // Filtra los productos que no coincidan con el ID proporcionado
      state.cart = state.cart.filter((item: any) => item.id !== action.payload);
    },
    incrementQuantity: (state: any, action: any) => {
      const itemInCart = state.cart.find((item: any) => item.id === action.payload.id);
      if (itemInCart) {
        itemInCart.quantity++;
      }
    },
    decrementQuantity: (state: any, action: any) => {
      const itemInCart = state.cart.find((item: any) => item.id === action.payload.id);
      if (itemInCart) {
        if (itemInCart.quantity === 1) {
          state.cart = state.cart.filter((item: any) => item.id !== action.payload.id);
        } else {
          itemInCart.quantity--;
        }
      }
    },
    clearCart: (state: any) => {
      // Vaciar el carrito
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;