import React, {useEffect, useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from './BottomTabParamList';
import WishlistScreen from '../screens/Wishlist/Wishlist';
import MarcasScreen from '../screens/Marcas/Marcas';
import MyCartScreen from '../screens/MyCart/MyCart';
import HomeScreen from '../screens/Home/Home';
import CategoryScreen from '../screens/Category/Category';
import ProfileScreen from '../screens/Profile/Profile';
import BottomMenu from '../layout/BottomMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomNavigation = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
      const getUsername = async () => {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      };
  
      getUsername();
    }, []);
  
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                headerShown : false
            }}
            tabBar={(props:any) => <BottomMenu {...props}/>}
        >
            <Tab.Screen 
                name='Inicio'
                component={HomeScreen}
            />
            <Tab.Screen 
                name='Categorías'
                component={CategoryScreen}
            />
                <Tab.Screen 
                    name='Marcas'
                    component={MarcasScreen}
                />
            <Tab.Screen 
                name='Mi Carrito'
                component={MyCartScreen}
            />
            <Tab.Screen 
                name='Más'
                component={ProfileScreen}
            />
        </Tab.Navigator>
    )
}

export default BottomNavigation;