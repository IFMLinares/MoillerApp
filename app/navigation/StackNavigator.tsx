import React, {useEffect, useState} from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../redux/store"; // Asegúrate de que este sea el path correcto a tu store
import { RootStackParamList } from "./RootStackParamList";
import { StatusBar, View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChooseLanguage from "../screens/Auth/ChooseLanguage";
import SplashScreen from '../screens/splashScreen/splashScreen';
import SignUp from "../screens/Auth/SignUp";
import SingIn from "../screens/Auth/SingIn";
import OTPAuthentication from "../screens/Auth/OTPAuthentication";
import BottomNavigation from "./BottomNavigation";
import DrawerNavigation from "./DrawerNavigation";
import Search from "../screens/Search/Search";
import Notification from "../screens/Notification/Notification";
import DeliveryAddress from "../screens/Payment/DeliveryAddress";
import AddDeliveryAddress from "../screens/Payment/AddDeliveryAddress";
import Payment from "../screens/Payment/Payment";
import Addcard from "../screens/Payment/Addcard";
import Checkout from "../screens/Payment/Checkout";
import Myorder from "../screens/Myorder/Myorder";
import Trackorder from "../screens/Myorder/Trackorder";
import Writereview from "../screens/Myorder/Writereview";
import Products from "../screens/Category/Products";
import ProductsMarcas from "../screens/Category/ProductsMarcas";
import ProductsDetails from "../screens/Category/ProductsDetails";
import Coupons from "../screens/Profile/Coupons";
import EditProfile from "../screens/Profile/EditProfile";
import Language from "../screens/Language/Language";
import Questions from "../screens/Profile/Questions";
import Components from "../screens/Components/Components";
import Chat from "../screens/Chat/Chat";
import Singlechat from "../screens/Chat/Singlechat";
import Call from "../screens/Chat/Call";
import AccordionScreen from "../screens/Components/Accordion";
import BottomSheet from "../screens/Components/BottomSheet";
import ModalBox from "../screens/Components/ModalBox";
import Buttons from "../screens/Components/Buttons";
import Badges from "../screens/Components/Badges";
import Charts from "../screens/Components/Charts";
import Headers from "../screens/Components/Headers";
import Footers from "../screens/Components/Footers";
import TabStyle1 from "../components/Footers/FooterStyle1";
import TabStyle2 from "../components/Footers/FooterStyle2";
import TabStyle3 from "../components/Footers/FooterStyle3";
import TabStyle4 from "../components/Footers/FooterStyle4"; 
import Pricings from "../screens/Components/Pricings";
import DividerElements from "../screens/Components/DividerElements";
import Snackbars from "../screens/Components/Snackbars";
import Socials from "../screens/Components/Socials";
import SwipeableScreen from "../screens/Components/Swipeable";
import Tabs from "../screens/Components/Tabs";
import Tables from "../screens/Components/Tables";
import Toggles from "../screens/Components/Toggles";
import Demo from "../screens/Home/Demo";
import Inputs from "../screens/Components/Inputs";
import Category from "../screens/Category/Category"; // Importa la pantalla Category
import SearchArticles from "../screens/Components/SearchArticles";
import ProductDetail from "../screens/Components/ProductDetail";
import CatalogoScreen from "../screens/Category/Catalogo";
import NuevoScreen from "../screens/Category/Nuevo";
import PedidoScreen from "../screens/Payment/Pedido";
import MasVendidoScreen from "../screens/Category/MasVendido";
import OfertasScreen from "../screens/Category/Ofertas";
import { useDispatch } from "react-redux";
import { getUserInfo } from "../api/editPerfilApi";
import { setClienteId } from "../redux/actions/drawerAction";
// import OfferScreen from "../components/Notificaciones/OffertNotification";
import ForgetPasswordScreen from "../screens/Auth/ForgetPassword";
import NewPasswordScreen from "../screens/Auth/NewPassword";
const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  const theme = useTheme();
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        console.log("Información del usuario:", userInfo); // Verifica la respuesta de la API
        dispatch(setClienteId(userInfo.id)); // Cambia `cliente_id` por `id`
      } catch (error) {
        console.error("Error al obtener la información del usuario:", error);
      }
    };
  
    fetchUserInfo();
  }, [dispatch]);

  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);


  useEffect(() => {
    const checkIfFirstLaunch = async () => {
      const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
      if (isFirstLaunch === null) {
        setInitialRoute('SplashScreen');
      } else {
        setInitialRoute('SingIn');
      }
    };

    checkIfFirstLaunch();
  }, []);

  if (initialRoute === null) {
    return null; // O muestra un indicador de carga mientras se determina la ruta inicial
  }

  return (
    <View style={{ width: "100%", flex: 1 }}>
      {/* <Stack.Navigator
        initialRouteName="ChooseLanguage"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}> */}
        <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}> 
		{/* <Stack.Screen name="Demo" component={Demo} /> */}
        {/* <Stack.Screen name="ChooseLanguage" component={ChooseLanguage} /> */}
		    <Stack.Screen name="SplashScreen" component={SplashScreen}   />
        <Stack.Screen name="SingIn" component={SingIn} />

        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} /> 
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} /> 

        <Stack.Screen name="OTPAuthentication" component={OTPAuthentication} />
        <Stack.Screen name="BottomNavigation" component={BottomNavigation} />
        <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="DeliveryAddress" component={DeliveryAddress} />
        <Stack.Screen name="Catalogo" component={CatalogoScreen} />
        <Stack.Screen name="Nuevo" component={NuevoScreen} />
        <Stack.Screen name="MasVendido" component={MasVendidoScreen} />
        <Stack.Screen name="Ofertas" component={OfertasScreen} />
        <Stack.Screen name="Products" component={Products} />
        <Stack.Screen name="Pedido" component={PedidoScreen} />
        <Stack.Screen name="ProductsDetails" component={ProductsDetails} />
        <Stack.Screen name="ProductsMarcas" component={ProductsMarcas} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Myorder" component={Myorder} />
        <Stack.Screen name="Category" component={Category} />
        
        <Stack.Screen
          name="AddDeliveryAddress"
          component={AddDeliveryAddress}
        />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Addcard" component={Addcard} />
        <Stack.Screen name="Trackorder" component={Trackorder} />
        <Stack.Screen name="Writereview" component={Writereview} />
        <Stack.Screen name="Coupons" component={Coupons} />
        <Stack.Screen name="Language" component={Language} />
        <Stack.Screen name="Questions" component={Questions} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Singlechat" component={Singlechat} />
        <Stack.Screen name="Call" component={Call} />
        <Stack.Screen name="SearchArticles" component={SearchArticles} /> 
        <Stack.Screen name="Components" component={Components} />
        <Stack.Screen name="Accordion" component={AccordionScreen} />
        <Stack.Screen name="BottomSheet" component={BottomSheet} />
        <Stack.Screen name="ModalBox" component={ModalBox} />
        <Stack.Screen name="Buttons" component={Buttons} />
        <Stack.Screen name="Badges" component={Badges} />
        <Stack.Screen name="Charts" component={Charts} />
        <Stack.Screen name="Headers" component={Headers} />
        <Stack.Screen name="Footers" component={Footers} />
        <Stack.Screen name="TabStyle1" component={TabStyle1} />
        <Stack.Screen name="TabStyle2" component={TabStyle2} />
        <Stack.Screen name="TabStyle3" component={TabStyle3} />
        <Stack.Screen name="TabStyle4" component={TabStyle4} />
        <Stack.Screen name="Inputs" component={Inputs} />
        {/* <Stack.Screen name="lists" component={ListScreen} /> */}
        <Stack.Screen name="Pricings" component={Pricings} />
        <Stack.Screen name="DividerElements" component={DividerElements} />
        <Stack.Screen name="Snackbars" component={Snackbars} />
        <Stack.Screen name="Socials" component={Socials} />
        <Stack.Screen name="Swipeable" component={SwipeableScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Tables" component={Tables} />
        <Stack.Screen name="Toggles" component={Toggles} />

        {/* notificaciones */}
        {/* <Stack.Screen name="OffertNotification" component={OfferScreen} /> */}
      </Stack.Navigator>
    </View>
  );
};

export default StackNavigator;
