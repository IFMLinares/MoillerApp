import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [activeDot, setActiveDot] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(
    require('../../assets/images/background-image/splash.jpg'),
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const checkIfFirstLaunch = async () => {
      const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
      if (isFirstLaunch === null) {
        await AsyncStorage.setItem('isFirstLaunch', 'false');
      } else {
        navigation.navigate('SingIn');
      }
    };

    checkIfFirstLaunch();
  }, [navigation]);

  const handlePress = () => {
    setShowInfo(true);
    setActiveDot(true);
    setBackgroundImage(
      require('../../assets/images/background-image/splash2.jpg'),
    );
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: (evt, gestureState) => {
        slideAnim.setValue(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) { // Ajusta el umbral a -50
          Animated.timing(slideAnim, {
            toValue: -1000,
            duration: 300,
            useNativeDriver: true,
          }).start(() => { 
            navigation.navigate('SingIn'); // Asegúrate de que el nombre de la pantalla sea correcto
          });
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.imageSplash}>
        {!showInfo && (
          <View style={styles.blockBrackground}>
            <Text style={styles.textTittle }>
              Encuentra la mejor calidad en repuestos y herramientas de{' '}
            </Text>
            <Text style={styles.textSubtittle}>
              linea blanca y refrigeración.
            </Text>
  
            <TouchableOpacity style={styles.buttonSplash} onPress={handlePress}>
              <Text style={styles.buttonText}>Comienza</Text>
            </TouchableOpacity>
          </View>
        )}
  
        {showInfo && (
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.blockSecondBrackground,
              { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
            ]}
          >
            <Text style={styles.textSecondTittle}>
              La única app en el rubro
            </Text>
            <Text style={styles.textSecondSubtittle}>
              Desarrollada pensando en la comodidad de nuestros clientes, mollier
              lidera el mercado en atención al cliente:
            </Text>
            <Text style={styles.textSecondSpan}>
              Rapidez, innovación y precisión
            </Text>
            <View style={styles.dotsContainer}>
              <View style={styles.dot} />
              <View style={[styles.dot, activeDot && styles.activeDot]} />
              <View style={styles.dot} />
            </View>
          </Animated.View>
        )}
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSplash: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blockBrackground: {
    width: '100%',
    height: 400,
    backgroundColor: '#1A4881',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  //   Contenido  principal
  textTittle: {
    width: '100%',
    color: 'white',
    marginHorizontal: 20,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'RalewayLight',
    textTransform: 'uppercase',
  },
  textSubtittle: {
    width: '100%',
    color: 'white',
    marginHorizontal: 20,
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 30,
    textTransform: 'uppercase',
    fontFamily: 'RalewayBold',
  },
  buttonSplash: {
    backgroundColor: 'white',
    width: '70%',
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#1A4881',
    fontSize: 30,
    fontFamily: 'RalewayBlack',
    textTransform: 'uppercase',
  },
  //   Contenido  principal
  // Contenido  secundario

  blockSecondBrackground: {
    width: '100%',
    height: 400,
    backgroundColor: '#1A4881',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60, 
    alignItems: 'center',
    padding: 20, 
  },

  textSecondTittle: {
    width: '100%',
    color: 'white',
    marginTop: 50, 
    fontSize: 20,
    fontFamily: 'RalewayBold',
    textTransform: 'uppercase',
  },
  textSecondSubtittle: {
    width: '100%',
    color: 'white',
    marginHorizontal: 20,
    marginVertical: 20, 
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: 'RalewayMedium',
  },
  textSecondSpan: {
    width: '100%',
    color: 'white',
    marginHorizontal: 20, 
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: 'RalewayBold',
  },

  // Contenido  secundario

  // animacion contador

  dotsContainer: {
    flexDirection: 'row',
    marginTop: 60,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 30,
    backgroundColor: 'white',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'orange',
  },
  // animacion contador
});
