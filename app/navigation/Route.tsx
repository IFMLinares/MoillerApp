import React, {useEffect} from 'react';
import StackNavigator from './StackNavigator';
import { ThemeContextProvider } from '../constants/ThemeContext';
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setClienteId } from '../redux/actions/drawerAction';

const Route = () => {
   const dispatch = useDispatch();
   
   useEffect(() => {
	const loadClienteId = async () => {
	  try {
		const storedClienteId = await AsyncStorage.getItem("clienteId");
		if (storedClienteId && parseInt(storedClienteId, 10) !== 1) {
		  dispatch(setClienteId(parseInt(storedClienteId, 10))); // Actualiza Redux
		  console.log("Cliente ID cargado desde AsyncStorage:", storedClienteId);
		} else {
		  console.error("Cliente ID inválido en AsyncStorage:", storedClienteId);
		}
	  } catch (error) {
		console.error("Error al cargar clienteId desde AsyncStorage:", error);
	  }
	};
  
	loadClienteId();
  }, [dispatch]);

	  const checkClienteId = async () => {
		const storedClienteId = await AsyncStorage.getItem("clienteId");
		console.log("Cliente ID restaurado desde AsyncStorage:", storedClienteId);
	};
	
	useEffect(() => {
		checkClienteId();
	}, []);
	return (
		<ThemeContextProvider>
			<StackNavigator/> 
		</ThemeContextProvider>
	)
  
}

export default Route;