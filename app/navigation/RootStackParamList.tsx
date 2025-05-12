import { NavigatorScreenParams } from "@react-navigation/native";
import { BottomTabParamList } from "./BottomTabParamList";

export type RootStackParamList = {
  DrawerNavigation: NavigatorScreenParams<BottomTabParamList>;
  Demo: undefined;
  ChooseLanguage: undefined;
  SplashScreen: undefined;
  SignUp: undefined;
  ForgetPassword: undefined;
  SingIn: undefined;
  OnBoarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  NewPassword: undefined;
  OTPAuthentication: { email: string; otpCode: string }; // Define que OTPAuthentication recibe un parámetro email
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
  Addcard: undefined;
  Payment: undefined;
  AddDeliveryAddress: undefined;
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
  // mis ordenes
  Myorder: {
    Order: { orderId: string }; // Agregar esta línea si Order es una pantalla válida
    updatedOrder?: { orderId: string }; // Agregar esta línea si Order es una pantalla válida
  };
  Pedido: { orderId: string }; // Agregar esta línea si Order es una pantalla válida
  // mi carrito
  "Mi Carrito": undefined; // Asegúrate de que este valor exista
  Checkout: { clienteId: any; cartId: number };

  Ofertas: { subcategoryId: string; subcategoryName: string }; // Agregar esta línea

  MasVendido: { subcategoryId: string; subcategoryName: string }; // Agregar esta línea

  Nuevo: { subcategoryId: string; subcategoryName: string }; // Agregar esta línea
};
