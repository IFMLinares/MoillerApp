import React, {useEffect, useRef, useState} from 'react';
import { 
    View, 
    Animated,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    Dimensions
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { GlobalStyleSheet } from '../constants/StyleSheet';
import { SIZES, FONTS, COLORS } from '../constants/theme';
import { IMAGES } from '../constants/Images';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'; 
import { useSelector } from "react-redux"; // Importa useSelector
type Props = {
    state : any,
    navigation : any,
    descriptors : any
}


const BottomMenu = ({state, navigation, descriptors}: Props) => {

    const theme = useTheme();
    const {colors} : {colors : any} = theme;
    const cart = useSelector((state: any) => state.cart.cart); // Obtén el carrito desde Redux
    const [tabWidth, setWidth] = useState(wp('100%'));

    const tabWD =
        tabWidth < SIZES.container ? tabWidth / 5 : SIZES.container / 5;

    const circlePosition = useRef(
        new Animated.Value(0),
    ).current;

    Dimensions.addEventListener('change', val => {
        setWidth(val.window.width);
    });

 

    useEffect(() => {
        Animated.spring(circlePosition, {
            toValue: state.index * tabWD,
            useNativeDriver: true,
        }).start();
    },[state.index,tabWidth])


    const onTabPress = (index:any) => {
        const tabW =
            tabWidth < SIZES.container ? tabWidth / 5 : SIZES.container / 5; // Adjust this according to your tab width

        Animated.spring(circlePosition, {
            toValue: index * tabW,
            useNativeDriver: true,
        }).start();
    };




    return (
        <View style={{
            backgroundColor:theme.dark ? 'rgba(0,3,3,1)' : colors.card,
        }}>
            
                <View
                    style={[styles.tabBar,
                    {
                        borderTopColor:colors.border,
                    }]}
                >
                    <View
                        style={[GlobalStyleSheet.container,{
                            flexDirection: 'row',
                            paddingHorizontal: 0,
                            paddingTop: 0,
                            paddingBottom: 0,
                        }]}
                    >
 
                        {state.routes.map((route:any , index:string) => {

                            const {options} = descriptors[route.key];
                            const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                ? options.title
                                : route.name;

                            const isFocused = state.index === index;

                            const iconTranslateY = useRef(new Animated.Value(0)).current;
                            Animated.timing(iconTranslateY, {
                                toValue: isFocused ? -20 : 0,
                                duration: 200,
                                useNativeDriver: true,
                            }).start();

                            const onPress = () => {
                                const event = navigation.emit({
                                  type: 'tabPress',
                                  target: route.key,
                                  canPreventDefault: true,
                                });
                
                                if (!isFocused && !event.defaultPrevented) {
                                  navigation.navigate({name: route.name, merge: true});
                                  onTabPress(index);
                                }
                            };

                            return(
                                <View
                                    key={index}
                                    style={styles.tabItem}
                                >   
                                    <TouchableOpacity
                                        onPress={onPress}
                                        style={styles.tabLink}
                                    >
                                        {/* <Animated.View
                                            style={{
                                                transform: [{translateY: iconTranslateY}],
                                        }}> */}
                                            <Image 
                                                style={label == 'Profile' ?
                                                {
                                                    height:24,
                                                    width:24,
                                                    borderRadius:50,
                                                    marginBottom:2,
                                                    resizeMode:'contain'
                                                }
                                                    :
                                                {
                                                    height:24,
                                                    width:24,
                                                    marginBottom:2,
                                                    resizeMode:'contain',
                                                    tintColor: isFocused ? COLORS.primary : colors.title ,
                                                    //tintColor:colors.title
                                                }}
                                                source={
                                                    label === 'Inicio'    ?  IMAGES.Home:
                                                    label === 'Categorías' ?  IMAGES.grid:
                                                    label === 'Marcas'   ?  IMAGES.brand:
                                                    label === 'Mi Carrito'     ?  IMAGES.mycart:
                                                    label === 'Más' ? IMAGES.grid5 : IMAGES.Home
                                                }
                                            />
                                        {/* </Animated.View> */}
                                        {label === 'Mi Carrito' && cart.length > 0 && (
                                        <View
                                            style={[
                                                GlobalStyleSheet.notification,
                                                {
                                                    position: "absolute",
                                                    right: 5,
                                                    top: -5,
                                                    backgroundColor: "#FFE019",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    ...FONTS.fontRegular,
                                                    fontSize: 10,
                                                    color: COLORS.title,
                                                }}
                                            >
                                                {cart.length}
                                            </Text>
                                        </View>
                                    )}
                                        <Text style={[styles.navText,{color:isFocused ? COLORS.primary : colors.title}]}>{label}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    tabBar : {
        height : 60,
        //borderTopWidth:1,
    },
    tabItem : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        paddingTop:10
    },
    tabLink : {
        alignItems: 'center',
    },
    navText : {
        ...FONTS.fontRegular,
        fontSize:13
    }
});
 
export default BottomMenu;