import { NavigatorScreenParams } from "@react-navigation/native";
import { BottomTabParamList } from "./BottomTabParamList";

export type RootStackParamList = {
  DrawerNavigation: NavigatorScreenParams<BottomTabParamList>;
  Demo: undefined;
  ChooseLanguage: undefined;
  SplashScreen: undefined;
  SignUp: undefined;
  SingIn: undefined;
  OnBoarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPAuthentication: undefined;
  ResetPassword: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  TwoStepAuthentication: undefined;
  BottomNavigation: undefined;
  Singlechat: undefined;
  Chat: undefined;
  Support: undefined;
  History: undefined;
  Verification: undefined;
  Call: undefined;
  EditProfile: undefined;
  Trackorder: undefined;
  Language: undefined;
  MyCart: undefined;
  Category: undefined;
  Marcas: undefined;
  Notifications: undefined;
  Questions: undefined;
  Writereview: undefined;
  Profile: undefined;
  Wishlist: undefined;
  Search: undefined;
  SearchArticles: undefined;
  Components: undefined;
  Coupons: undefined;
  DeliveryAddress: undefined;
  Checkout: undefined;
  Pedido: undefined;
  Addcard: undefined;
  Payment: undefined;
  AddDeliveryAddress: undefined;
  Myorder: undefined;
  Notification: undefined;
  Accordion: undefined;
  BottomSheet: undefined;
  ModalBox: undefined;
  Buttons: undefined;
  Badges: undefined;
  Charts: undefined;
  Headers: undefined;
  lists: undefined;
  Pricings: undefined;
  DividerElements: undefined;
  Snackbars: undefined;
  Socials: undefined;
  Swipeable: undefined;
  Tabs: undefined;
  Tables: undefined;
  Toggles: undefined;
  Inputs: undefined;
  Footers: undefined;
  TabStyle1: undefined;
  TabStyle2: undefined;
  TabStyle3: undefined;
  TabStyle4: undefined;

  // prueba
  Catalogo: {
    subcategoryId: string; // Agrega esta propiedad
    subcategoryName: string;
  };
  ProductsDetails: {
    product: any; // O define un tipo específico para el producto
    productId: number; // Agrega productId aquí
  };
  Products: {
    subcategoryId: number;
    subcategoryName: string;
    clienteId: number;
  };
  ProductsMarcas: {
    brandId: string;
    brandName: string;
    clienteId: number; // Asegúrate de que clienteId sea un número
  };
  // home
  Home: undefined;
};
