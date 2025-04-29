import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import rootReducer from "../reducer";

const store = configureStore({
  reducer: rootReducer,
  // No es necesario agregar thunk manualmente, ya está incluido por defecto
});

export type RootState = ReturnType<typeof store.getState>; // Define y exporta RootState
export default store;
