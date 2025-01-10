import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { View, Text,TouchableOpacity } from 'react-native'
import Header from '../../layout/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { COLORS,FONTS } from '../../constants/theme';
import Input from '../../components/Input/Input';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import Button from '../../components/Button/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AddDeliveryAddressScreenProps = StackScreenProps<RootStackParamList, 'AddDeliveryAddress'>;

const AddDeliveryAddress = ({navigation} : AddDeliveryAddressScreenProps) => {

    const theme = useTheme();
    const { colors } : {colors : any} = theme;

    const productSizes = ["Hogar", "Tienda", "Oficina"];

    const [activeSize, setActiveSize] = useState(productSizes[0]);

    const [inputValue, setInputValue] = useState("");

    const handleChange = (text:any) => { 
        const numericValue = text.replace(/[^0-9]/g, ""); 
        setInputValue(numericValue); 
    };

    const [inputValue1, setInputValue1] = useState("");

    const handleChange1 = (text:any) => { 
        const numericValue = text.replace(/[^0-9]/g, ""); 
        setInputValue1(numericValue); 
    };

    const [isFocused , setisFocused] = useState(false);
    const [isFocused1 , setisFocused1] = useState(false);
    const [isFocused2 , setisFocused2] = useState(false);
    const [isFocused3 , setisFocused3] = useState(false);
    const [isFocused4 , setisFocused4] = useState(false);
    const [isFocused5 , setisFocused5] = useState(false);
    const [isFocused6 , setisFocused6] = useState(false);

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
        <View style={{backgroundColor:colors.background,flex:1}}>
            <Header
                title='AGREGAR DIRECCIÓN '
                leftIcon='back'
                titleRight
            />
            <View 
                style={[GlobalStyleSheet.container,
                    { paddingHorizontal: 15,
                        backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        shadowOpacity: 0.35,
                        shadowRadius: 6.27,
                        elevation: 5, 
                    }
                 ]}
            >
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                        <View style={{height:18,width:18,borderRadius:30,backgroundColor:COLORS.primary,alignItems:'center',justifyContent:'center'}}>
                            <Text style={[FONTS.fontMedium,{fontSize:10,color:COLORS.card}]}>1</Text>
                        </View>
                        <Text style={[FONTS.fontMedium,{fontSize:13,color:colors.title}]}>MI CARRITO</Text>
                    </View>
                    <View style={{height:2,flex:1,backgroundColor:COLORS.primary,marginHorizontal:10}}/>
                    <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                    <View style={{height:18,width:18,borderRadius:30,backgroundColor:COLORS.primary,alignItems:'center',justifyContent:'center'}}>
                            <Text style={[FONTS.fontMedium,{fontSize:10,color:COLORS.card}]}>2</Text>
                        </View>
                        <Text style={[FONTS.fontMedium,{fontSize:13,color:colors.title}]}>DIRECCIÓN</Text>
                    </View>
                    <View style={{height:2,flex:1,backgroundColor:colors.title,opacity:.1,marginHorizontal:10}}/>
                    <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                        <View style={{height:18,width:18,borderRadius:30,backgroundColor:COLORS.primaryLight,alignItems:'center',justifyContent:'center'}}>
                            <Text style={[FONTS.fontMedium,{fontSize:10,color:COLORS.title}]}>3</Text>
                        </View>
                        <Text style={[FONTS.fontMedium,{fontSize:13,color:colors.text}]}>MÉTODOS DE PAGO</Text>
                    </View>
                </View>
            </View>
            <ScrollView contentContainerStyle={{flexGrow:1,paddingBottom:20}}>
                <View style={[GlobalStyleSheet.container,{backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,marginTop:15}]}>
                    <Text style={{ ...FONTS.fontMedium, fontSize: 18, color: colors.title,borderBottomWidth:1,borderBottomColor:COLORS.primaryLight,marginHorizontal:-15,paddingHorizontal:15,paddingBottom:15 }}>Detalles de contacto</Text>
                    <View style={{ marginBottom: 20, marginTop: 15 }}>
                        <Text style={{ ...FONTS.fontMedium, fontSize: 12, color:COLORS.primary, }}>Nombre y Apellido</Text>
                        <Input
                            onFocus={() => setisFocused(true)}
                            onBlur={() => setisFocused(false)}
                            isFocused={isFocused}
                            inputBorder
                            defaultValue={username}
                            onChangeText={(value) => console.log(value)}
                            style={{borderColor:COLORS.primaryLight,paddingLeft:0}}
                        />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        {/* <Text style={{ ...FONTS.fontRegular, fontSize: 15, color: colors.title, }}>Mobile No.</Text> */}
                        <Input
                             onFocus={() => setisFocused1(true)}
                             onBlur={() => setisFocused1(false)}
                             isFocused={isFocused1}
                            inputBorder
                            placeholder='Número de teléfono'
                            value={inputValue}
                            onChangeText={(value) => handleChange(value)}
                            style={{borderColor:COLORS.primaryLight, paddingLeft:0}}
                        />
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,marginTop:15}]}>
                    <Text style={{ ...FONTS.fontMedium, fontSize: 18, color: colors.title,borderBottomWidth:1,borderBottomColor:COLORS.primaryLight,marginHorizontal:-15,paddingHorizontal:15,paddingBottom:15 }}>Dirección</Text>
                    <View style={{ marginBottom: 20, marginTop: 10 }}>
                        <Text style={{ ...FONTS.fontMedium, fontSize: 12, color:COLORS.primary, }}>Código PIN</Text>
                        <Input
                            onFocus={() => setisFocused2(true)}
                            onBlur={() => setisFocused2(false)}
                            isFocused={isFocused2}
                            inputBorder
                            defaultValue="324010"
                            value={inputValue1}
                            onChangeText={(value) => handleChange1(value)}
                            style={{borderColor:COLORS.primaryLight, paddingLeft:0}}
                        />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Input
                            onFocus={() => setisFocused3(true)}
                            onBlur={() => setisFocused3(false)}
                            isFocused={isFocused3}
                            inputBorder
                            placeholder='Dirección de la calle'
                            onChangeText={(value) => console.log(value)}
                            style={{borderColor:COLORS.primaryLight, paddingLeft:0}}
                        />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Input
                            onFocus={() => setisFocused4(true)}
                            onBlur={() => setisFocused4(false)}
                            isFocused={isFocused4}
                            inputBorder
                            placeholder='Localidad/Pueblo'
                            onChangeText={(value) => console.log(value)}
                            style={{borderColor:COLORS.primaryLight, paddingLeft:0}}
                        />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Input
                            onFocus={() => setisFocused5(true)}
                            onBlur={() => setisFocused5(false)}
                            isFocused={isFocused5}
                            inputBorder
                            placeholder='Ciudad/Distrito'
                            onChangeText={(value) => console.log(value)}
                            style={{borderColor:COLORS.primaryLight, paddingLeft:0}}
                        />
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Input
                            onFocus={() => setisFocused6(true)}
                            onBlur={() => setisFocused6(false)}
                            isFocused={isFocused6}
                            inputBorder
                            placeholder='Estado'
                            onChangeText={(value) => console.log(value)}
                            style={{borderColor:COLORS.primaryLight, paddingLeft:0}}
                        />
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,marginTop:15}]}>
                    <Text style={{ ...FONTS.fontMedium, fontSize: 18, color: colors.title,borderBottomWidth:1,borderBottomColor:COLORS.primaryLight,marginHorizontal:-15,paddingHorizontal:15,paddingBottom:15 }}>Guardar dirección como</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingTop: 15,
                            paddingBottom: 10
                        }}
                    >
                        {productSizes.map((data, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => setActiveSize(data)}
                                    key={index}
                                    style={[{
                                        height: 40,
                                        width: 75,
                                        borderRadius: 4,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: COLORS.primaryLight,
                                        marginHorizontal: 4,
                                        //backgroundColor:theme.dark ? 'rgba(255,255,255,0.10)': colors.background
                                    }, activeSize === data && {
                                        backgroundColor:COLORS.primary,
                                        borderColor: COLORS.primary,
                                    }]}
                                >
                                    <Text style={[{ ...FONTS.fontMedium, fontSize: 14, color: colors.title }, activeSize === data && { color:theme.dark ? COLORS.white : colors.card }]}>{data}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>
            </ScrollView>
            <View style={[GlobalStyleSheet.container,{padding:0}]}>
                <View 
                    style={{
                        height:88,
                        width:'100%',
                        backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,
                        justifyContent:'center',
                        paddingHorizontal:15,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 2,
                            height: 2,
                        },
                        shadowOpacity: .1,
                        shadowRadius: 5,
                    }}
                >
                    <Button
                        title='Guardar Dirección'
                        color={COLORS.secondary}
                        text={COLORS.title }
                       onPress={() => navigation.navigate('DeliveryAddress')}
                    />
                </View>
            </View>
        </View>
    )
}

export default AddDeliveryAddress