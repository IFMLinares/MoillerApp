import 'react-native-gesture-handler';
import Route from './app/navigation/Route';
import { useFonts } from 'expo-font';
import { useTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux'
import store from './app/redux/store';
import React, { useEffect } from "react";  
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() { 
  const theme = useTheme();
  const { colors } : {colors : any} = theme;


  const [loaded] = useFonts({
    RalewayBold: require('./app/assets/fonts/Raleway-Bold.ttf'),
    RalewaySemiBold: require('./app/assets/fonts/Raleway-SemiBold.ttf'),
    RalewayLight: require('./app/assets/fonts/Raleway-Light.ttf'),
    RalewayMedium: require('./app/assets/fonts/Raleway-Medium.ttf'),
    RalewayRegular: require('./app/assets/fonts/Raleway-Regular.ttf'),
    RalewayExtraLight: require('./app/assets/fonts/Raleway-ExtraLight.ttf'),
    RalewayItalic: require('./app/assets/fonts/Raleway-Italic.ttf'),
    RalewayBlack: require('./app/assets/fonts/Raleway-Black.ttf'),
    RalewayExtraBold: require('./app/assets/fonts/Raleway-ExtraBold.ttf'),
  });  

  

  // useEffect(() => {
  //   const clearStorage = async () => {
  //     try {
  //       await AsyncStorage.clear();
  //       console.log("AsyncStorage limpiado correctamente.");
  //     } catch (error) {
  //       console.error("Error al limpiar AsyncStorage:", error);
  //     }
  //   };

  //   clearStorage();
  // }, []);
  
    // Mueve la lógica condicional aquí, después de que todos los hooks hayan sido llamados
    if (!loaded) {
      return null;
    }
  return (
    <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            //paddingTop: Platform.OS === 'android' ? 25 : 0,
            //backgroundColor:COLORS.primary ,
          }}>
            <StatusBar style="dark" />
            <Provider store={store}>
              <Route/>
              <Toast/>
            </Provider>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}
