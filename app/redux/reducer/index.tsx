import { combineReducers } from 'redux';
import drawerReducer from './drawerReducer';
import userReducer from "./userReducer";
import cartReducer from './cartReducer';
import wishListReducer from './wishListReducer';

const rootReducer = combineReducers({
    drawer: drawerReducer,
    user: userReducer,
    cart: cartReducer,
    wishList : wishListReducer
});

export default rootReducer;