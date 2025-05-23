import React, { useEffect, useState, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from "./BottomTabParamList";
import WishlistScreen from "../screens/Wishlist/Wishlist";
import MarcasScreen from "../screens/Marcas/Marcas";
import MyCartScreen from "../screens/MyCart/MyCart";
import HomeScreen from "../screens/Home/Home";
import CategoryScreen from "../screens/Category/Category";
import ProfileScreen from "../screens/Profile/Profile";
import BottomMenu from "../layout/BottomMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "../screens/Home/Home"; // Importación corregida

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomNavigation = () => {
  const [username, setUsername] = useState("");
  const homeScreenRef = useRef<{ scrollToTop: () => void } | null>(null);

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    getUsername();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props: any) => <BottomMenu {...props} />}>
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: "Inicio",
        }}
        listeners={{
          tabPress: () => {
            if (homeScreenRef.current) {
              homeScreenRef.current.scrollToTop(); // Llama a scrollToTop
            }
          },
        }}>
        {({ navigation, route }) => (
          <Home ref={homeScreenRef} navigation={navigation} route={route} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Categorías" component={CategoryScreen} />
      <Tab.Screen name="Marcas" component={MarcasScreen} />
      <Tab.Screen name="Mi Carrito" component={MyCartScreen} />
      <Tab.Screen name="Más" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
