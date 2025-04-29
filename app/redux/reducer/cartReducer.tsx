import { createSlice } from "@reduxjs/toolkit";

// Define el tipo CartItem
type CartItem = {
  id: number;
  name: string;
  price: number;
  highImage: string;
  code: string;
  quantity: number;
};
export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [] as CartItem[], // Define el tipo del estado inicial
  },
  reducers: {
    addToCart: (state, action: { payload: CartItem }) => {
      const itemInCart = state.cart.find((item) => item.id === action.payload.id);
      if (itemInCart) {
        itemInCart.quantity += action.payload.quantity;
      } else {
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