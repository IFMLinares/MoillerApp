import { useNavigation, useTheme } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Share,
  SectionList,
  Platform,
  Modal,
  Dimensions,
} from "react-native";
import Header from "../../layout/Header";
import { IMAGES } from "../../constants/Images";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import Swiper from "react-native-swiper/src";
import { Feather } from "@expo/vector-icons";
import Button from "../../components/Button/Button";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { ScrollView } from "react-native-gesture-handler";
import Cardstyle1 from "../../components/Card/Cardstyle1";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducer/cartReducer";
import { addTowishList } from "../../redux/reducer/wishListReducer";
import data from "../../data/data.json";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import Toast from "react-native-toast-message";
import ImageViewer from "react-native-image-zoom-viewer";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// api articulos
import { fetchArticles } from '../../api/authApi';
// api articulos

// Importa las imágenes
import producto1 from "../../assets/images/producto/item.webp";
import producto2 from "../../assets/images/producto/item1.webp";
import producto3 from "../../assets/images/producto/item2.png";
import producto5 from "../../assets/images/producto/item3.jpg";
import producto6 from "../../assets/images/producto/item4.webp";
import producto7 from "../../assets/images/producto/item5.webp";
import producto8 from "../../assets/images/producto/item6.webp";
import producto9 from "../../assets/images/producto/item7.webp";
import producto10 from "../../assets/images/producto/item8.jpg";
import producto11 from "../../assets/images/producto/item9.webp";
import producto12 from "../../assets/images/producto/item11.webp";
import producto13 from "../../assets/images/producto/item12.webp";
import producto14 from "../../assets/images/producto/item13.jpg";
import producto15 from "../../assets/images/producto/item14.webp";
import producto16 from "../../assets/images/producto/item15.png";
import producto17 from "../../assets/images/producto/item16.webp";
import producto18 from "../../assets/images/producto/item17.webp";
import producto19 from "../../assets/images/producto/item18.jpg";

// Mapea las rutas de las imágenes a las importaciones
const images = {
  "IMAGES.producto1": producto1,
  "IMAGES.producto2": producto2,
  "IMAGES.producto3": producto3,
  "IMAGES.producto5": producto5,
  "IMAGES.producto6": producto6,
  "IMAGES.producto7": producto7,
  "IMAGES.producto8": producto8,
  "IMAGES.producto9": producto9,
  "IMAGES.producto10": producto10,
  "IMAGES.producto11": producto11,
  "IMAGES.producto12": producto12,
  "IMAGES.producto13": producto13,
  "IMAGES.producto14": producto14,
  "IMAGES.producto15": producto15,
  "IMAGES.producto16": producto16,
  "IMAGES.producto17": producto17,
  "IMAGES.producto18": producto18,
  "IMAGES.producto19": producto19,
};

const SelectData = [
  {
    title: "Color",
    text: "Blue",
  },
  {
    title: "Storage",
    text: "128GB Storage",
  },
  {
    title: "RAM",
    text: "6GB RAM",
  },
  {
    title: "Size",
    text: "Medium",
  },
];

const offerData = [
  {
    image: IMAGES.deliverytruck,
    title: "Envío gratis",
    text: "Para todos los pedidos superiores a $99",
  },
  {
    image: IMAGES.check3,
    title: "Pago Seguro",
    text: "Nosotros aseguramos el pago seguro",
  },
  {
    image: IMAGES.savemoney,
    title: "Garantía de devolución de dinero",
    text: "Cualquier devolución dentro de los 30 días",
  },
  {
    image: IMAGES.technicalsupport,
    title: "Atención al cliente",
    text: "Llámanos o envíanos un correo electrónico 24 horas al día, 7 días a la semana",
  },
  // {
  //     image:IMAGES.wallet2,
  //     title:"Pago Flexible",
  //     text:"Pague con varias tarjetas de crédito",
  // },
];

const card2Data = [
  {
    id: "20",
    image: IMAGES.item1,
    title: "APPLE iPhone 14 (Bluetooth)",
    price: "$199",
    discount: "$112",
    offer: "70% OFF",
    brand: "Apple",
    color: false,
    //hascolor:false
  },
  {
    id: "21",
    image: IMAGES.item2,
    title: "APPLE iPhone 11 (Bluetooth)",
    price: "$149",
    discount: "$114",
    offer: "50% OFF",
    brand: "Apple",
    color: false,
    // hascolor:true
  },
  {
    id: "22",
    image: IMAGES.item1,
    title: "APPLE iPhone 13 (Bluetooth)",
    price: "$299",
    discount: "$116",
    offer: "70% OFF",
    color: false,
    brand: "Apple",
    //hascolor:true
  },
  {
    id: "23",
    image: IMAGES.item2,
    title: "APPLE iPhone 15 (Bluetooth)",
    price: "$99",
    discount: "$118",
    offer: "70% OFF",
    color: true,
    brand: "Apple",
    //hascolor:false
  },
];

const ItemImages = [
  IMAGES.product12,
  IMAGES.product13,
  IMAGES.product14,
  IMAGES.product15,
];

type ProductsDetailsScreenProps = StackScreenProps<
  RootStackParamList,
  "ProductsDetails"
>;

const ProductsDetails = ({ route, navigation }: ProductsDetailsScreenProps) => {
  // api

  const { product } = route.params;
  // const [product, setProduct] = useState(null);

  // useEffect(() => {
  //   const getProductDetails = async () => {
  //     try {
  //       const articles = await fetchArticles();
  //       const selectedProduct = articles.find((item) => item.id === productId);
  //       setProduct(selectedProduct);
  //     } catch (error) {
  //       console.error('Error al obtener los detalles del producto:', error);
  //     }
  //   };

  //   getProductDetails();
  // }, [productId]);
  // api

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [Select, setSelect] = useState(offerData[0]);

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "Share Product link here.",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      //alert(error.message);
    }
  };

  const dispatch = useDispatch();

  const addItemToCart = () => {
    dispatch(addToCart(product));
    Toast.show({
      type: "success",
      text1: "¡Producto/s añadido a su carrito exitosamente!",
    });
  };

  const addItemToWishList = (data: any) => {
    dispatch(addTowishList(data));
  };

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Producto no encontrado</Text>
      </View>
    );
  }
  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // const addItemToCart = () => {
  //     dispatch(addToCart({
  //         id:"0",
  //         image:IMAGES.item1,
  //         title:"APPLE iPhone 14 (Bluetooth)",
  //         price:"$199",
  //         discount:"$112",
  //         offer:"70% OFF",
  //         brand:"Apple",
  //         color:false,
  //         hascolor:true
  //     } as any ));
  // }

  // const addItemToWishList = (data: any) => {
  //     dispatch(addTowishList(data));
  //     }

  const ListwithiconData = [
    {
      title: "GENERAL",
      data: [
        {
          title: "Marca",
          text: product.color,
        },
        {
          title: "Modelo",
          text: product.subcolor,
        },
        {
          title: "Categoría",
          text: product.line,
        },
        {
          title: "Sub-Categoría",
          text: product.subline,
        },
      ],
    },
    {
      title: "DISEÑO",
      data: [
        {
          title: "Dimensiones",
          // text: '71.5 x 146.7 x 7.8 mm'
        },
        {
          title: "Peso",
          // text: '172 g'
        },
        {
          title: "Color",
          // text: 'Negro, blanco,'
        },
      ],
    },
  ];
  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title="Detalles del producto"
        leftIcon="back"
        rightIcon2={"cart"}
        // rightIcon1={"search"}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <View
          style={[
            GlobalStyleSheet.container,
            {
              width: "100%",
              height: SIZES.height / 3,
              // paddingTop: 40,
              backgroundColor: theme.dark
                ? "rgba(255,255,255,.1)"
                : colors.card,
              paddingBottom: 30,
              padding: 0,
            },
          ]}>
          <Swiper
            showsPagination={Platform.OS === "android" ? true : false}
            loop={false}
            paginationStyle={{
              bottom: -20,
            }}
            dotStyle={{
              height: 8,
              width: 8,
              backgroundColor: COLORS.primary,
              opacity: 0.2,
            }}
            activeDotStyle={{
              height: 8,
              width: 8,
              backgroundColor: COLORS.primary,
            }}>
            {ItemImages.map((data: any, index: any) => (
              <TouchableOpacity key={index} onPress={() => openModal(index)}>
                <Image
                  style={{
                    height: 300,
                    width: "100%",
                    resizeMode: "contain",
                    // marginTop: 50,
                  }}
                  source={images[product.image]}
                />
              </TouchableOpacity>
            ))}
          </Swiper>
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              paddingHorizontal: 0,
              paddingLeft: 10,
              paddingVertical: 10,
              flexDirection: "row",
              //alignItems:'center',
              justifyContent: "space-between",
            }}>
            <View style={{}}>
              {/* <View
                                style={{
                                    marginTop:10,
                                    backgroundColor:COLORS.success,
                                    paddingHorizontal:5,
                                    paddingVertical:2
                                }}
                            >
                                <Text style={[FONTS.fontSemiBold,{fontSize:12,color:COLORS.card}]}>70% OFF</Text>
                            </View> */}
            </View>
            <View>
              <TouchableOpacity
                style={{
                  height: 38,
                  width: 38,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                }}
                onPress={onShare}>
                <Feather size={22} color={colors.text} name={"share-2"} />
                {/* <FeatherIcon size={20} color={COLORS.white} name="share-2" /> */}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <View style={[GlobalStyleSheet.container,{padding:0}]}>
                    <View style={{height:45,backgroundColor:'#87E8FF',marginVertical:10,flexDirection:'row',alignItems:'center',width:'100%',justifyContent:'space-between',paddingLeft:15}}>
                        <View>
                            <Text style={[FONTS.fontRegular,{fontSize:15,color:COLORS.title}]} >You're saving<Text style={[FONTS.fontSemiBold,{color:'#07A3C5'}]}> $5,565 </Text>on this time</Text>
                        </View>
                        <View>
                            <Image
                                style={{height:45,resizeMode:'contain',marginRight:Platform.OS === 'android' ? -35 : 0}}
                                source={IMAGES.background}
                            />
                            <Image
                                style={{position:'absolute',height:28,width:28,top:10,right:15}}
                                source={IMAGES.gift}
                            />
                        </View>
                    </View>
                </View> */}
        <View
          style={[
            GlobalStyleSheet.container,
            {
              backgroundColor: theme.dark
                ? "rgba(255,255,255,.1)"
                : colors.card,
              marginVertical: 10,
            },
          ]}>
          <Text
            numberOfLines={0}
            style={[FONTS.fontMedium, { fontSize: 18, color: colors.title }]}>
            {product.name}
          </Text>
          {/* <View style={{flexDirection:'row',alignItems:'center',gap:10,marginTop:2}}>
                        <Image
                            style={{height:14,width:74}}
                            source={IMAGES.star7}
                        />
                        <Text style={[FONTS.fontRegular,{fontSize:14,color:colors.title,opacity:.5}]}>(270 Review)</Text>
                    </View> */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 2,
              gap: 5,
            }}>
            {/* <Text style={[FONTS.fontMedium,{fontSize:20,color:colors.title,textDecorationLine:'line-through',opacity:.6}]}>$7,000(precio de oferta)</Text>     */}
            {/* <Text style={[FONTS.fontMedium,{fontSize:14,color:COLORS.danger}]}>  70% OFF(porcentaje de la oferta)</Text>     */}
            <Text
              style={[
                FONTS.fontMedium,
                { fontSize: 15, color: COLORS.success },
              ]}>
              {" "}
              En Stock{" "}
            </Text>
            <Text
              style={[
                FONTS.fontMediumItalic,
                { fontSize: 20, color: COLORS.primary, fontWeight: "bold" },
              ]}>
              {product.price} $
            </Text>
          </View>
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 10,
            }}>
            <FontAwesome name="car" size={20} color="black" />
            <Text style={[FONTS.fontRegular,{fontSize:15,color:colors.text}]}>Devolución de 14 días disponible</Text>
            <Text
              style={[
                FONTS.fontSemiBold,
                { fontSize: 15, color: COLORS.success },
              ]}>
              {" "}
              Delivery Gratis
            </Text>
          </View> */}
        </View>
        {/* <View style={[GlobalStyleSheet.container,{backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,marginVertical:10,paddingBottom:0,paddingTop:10}]}>
                    <Text style={[FONTS.fontMedium,{fontSize:16,color:colors.title,paddingBottom:10}]}>Seleccionar variante</Text>
                    <View style={{flexDirection:'row',flexWrap:'wrap',marginHorizontal:-15}}>
                        {SelectData.map((data:any,index) => {
                            return(
                                <TouchableOpacity key={index} 
                                    style={{
                                        paddingVertical:10,
                                        width:'100%',
                                        borderTopWidth:1,
                                        borderTopColor:COLORS.primaryLight,
                                        //marginHorizontal:-15,
                                        paddingHorizontal:15,
                                        flexDirection:'row',
                                        alignItems:'center',
                                        justifyContent:'space-between'
                                    }}
                                >
                                    <Text style={[FONTS.fontMedium,{fontSize:15,color:colors.title}]}>{data.title}:</Text>
                                    <View style={{flexDirection:'row',gap:5}}>
                                        <Text style={[FONTS.fontRegular,{fontSize:15,color:colors.text}]}>{data.text}</Text>
                                        <Feather size={20} color={COLORS.primary} name={'chevron-right'} />
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View> */}
        {/* <View style={[GlobalStyleSheet.container,{paddingHorizontal:-15,paddingVertical:0,marginBottom:10}]}> 
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{paddingHorizontal:15}}
                    >
                        <View style={{flexDirection:'row',alignItems:'center',gap:15}}>
                            {offerData.map((data:any,index) => {
                                return(
                                    <TouchableOpacity
                                        key={index} 
                                        style={[{
                                            padding:10,
                                            backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,
                                            borderRadius:4
                                        },Select === data && {
                                            backgroundColor:COLORS.primary
                                        }]}
                                        onPress={() => setSelect(data)}
                                    >
                                        <View style={{alignItems:'center'}}>
                                            <Image
                                                style={{height:45,width:45,tintColor:Select === data ? COLORS.secondary :COLORS.primary}}
                                                source={data.image}
                                            />
                                            <View>
                                                <Text style={[FONTS.fontMedium,{fontSize:15,color:Select === data ? COLORS.white : colors.title,textAlign:'center'}]}>{data.title}</Text>
                                                <Text style={[FONTS.fontRegular,{fontSize:12,color:Select === data ? COLORS.white : colors.title,opacity:.7,textAlign:'center'}]}>{data.text}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View> */}
        {/* <View style={[GlobalStyleSheet.container,{backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card}]}>
                    <View style={{}}>
                        <Text  style={[FONTS.fontMedium,{fontSize:16,color:colors.title}]}>Descripción del producto</Text>
                        <Text style={[FONTS.fontRegular,{fontSize:15,color:colors.text,lineHeight:20,marginTop:10,opacity:.8}]}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam sapiente tempore excepturi quos suscipit impedit. Iure error soluta accusantium quasi? Consequuntur porro amet sed vero voluptates corrupti incidunt, ducimus quas!
                        </Text>
                    </View>
                </View> */}
        <View
          style={[
            GlobalStyleSheet.container,
            {
              backgroundColor: theme.dark
                ? "rgba(255,255,255,.1)"
                : colors.card,
              marginTop: 10,
              marginBottom: 10,
            },
          ]}>
          <Text
            style={[FONTS.fontRegular, { fontSize: 16, color: colors.title }]}>
            {product.title}
          </Text>
          <Text
            style={[
              FONTS.fontRegular,
              { fontSize: 16, color: colors.title, marginTop: 10 },
            ]}>
            Todas las especificaciones
          </Text>
        </View>
        <View style={[GlobalStyleSheet.container, { flex: 1, paddingTop: 0 }]}>
          <View style={{ marginHorizontal: -15, marginTop: 0, flex: 1 }}>
            <SectionList
              contentContainerStyle={{
                backgroundColor: colors.card,
                marginTop: -10,
              }}
              scrollEnabled={false}
              sections={ListwithiconData}
              keyExtractor={(item: any, index) => item + index}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  //onPress={() => navigation.navigate(item.navigate)}
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 15,
                    // height: 30,
                    alignItems: "center",
                    paddingVertical: 5,
                    //borderRadius: SIZES.radius,
                    backgroundColor: colors.card,
                    //marginVertical:5
                  }}>
                  <View style={{ width: "40%" }}>
                    <Text
                      style={{
                        ...FONTS.fontMedium,
                        fontSize: 14,
                        color: colors.text,
                      }}>
                      {item.title}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        ...FONTS.fontRegular,
                        fontSize: 14,
                        color: colors.title,
                      }}>
                      {item.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <Text
                  style={{
                    ...FONTS.fontRegular,
                    fontSize: 13,
                    color: COLORS.title,
                    paddingLeft: 15,
                    paddingVertical: 5,
                    backgroundColor: COLORS.primaryLight,
                    //borderBottomWidth:1,
                    //borderBottomColor:COLORS.primaryLight,
                    marginTop: 10,
                    marginBottom: 10,
                  }}>
                  {title}
                </Text>
              )}
            />
          </View>
        </View>
        {/* <View style={[GlobalStyleSheet.container,{paddingHorizontal:15,backgroundColor:theme.dark ? 'rgba(255,255,255,.1)':colors.card,borderBottomWidth:1,borderBottomColor:COLORS.primaryLight,paddingVertical:15,marginTop:-5}]}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={[FONTS.fontMedium,{fontSize:18,color:colors.title}]}>Similar Products</Text>
                    </View>
                </View>
                <View style={[GlobalStyleSheet.container,{padding:0,borderBottomWidth:1,borderBlockColor:COLORS.primaryLight}]}>
                    <ScrollView 
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                            {card2Data.map((data:any, index:any) => {
                                return (
                                    <View style={[{ marginBottom: 0, width: SIZES.width > SIZES.container ? SIZES.container / 3 : SIZES.width / 2.3 }]} key={index}>
                                        <Cardstyle1
                                            title={data.title}
                                            image={data.image}
                                            price={data.price}
                                            offer={data.offer}
                                            color={data.color}
                                            brand={data.brand}
                                            discount={data.discount} 
                                            id={data.id}
                                            onPress3={() => addItemToWishList(data)}                                            
                                            onPress={() => navigation.navigate('ProductsDetails')}
                                        />
                                    </View>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View> */}
      </ScrollView>
      <View style={[GlobalStyleSheet.container, { padding: 0 }]}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.light,
              borderRadius: 10,
              width: "40%",
            }}>
            <TouchableOpacity
              onPress={decrementQuantity}
              style={{ padding: 10 }}>
              <Text style={{ fontSize: 18 }}>-</Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                marginHorizontal: 10,
                fontWeight: "bold",
              }}>
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={incrementQuantity}
              style={{ padding: 10 }}>
              <Text style={{ fontSize: 18 }}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: "60%" }}>
            <TouchableOpacity
              onPress={addItemToCart}
              style={{
                padding: 10,
                backgroundColor: COLORS.primary,
                borderRadius: 10,
              }}>
              <Text style={{ fontSize: wp("4%"), color: COLORS.white, textAlign: "center" }}>
                Agregar al carrito
              </Text>
            </TouchableOpacity>
            {/* <Button
              onPress={addItemToCart}
              title="AGREGAR AL CARRITO"
              color={COLORS.primary}
              text={COLORS.white}
              style={{
                fontFamily: "RalewayBold", 
                fontSize: wp("2.3%"),
              }}
            /> */}
          </View>
          {/* <View style={{width:'50%'}}>
                        <Button
                            title='Comprar ahora'
                            color={COLORS.secondary}
                            text={COLORS.title}
                            onPress={() => navigation.navigate('DeliveryAddress')}
                            style={{borderRadius:0}}
                        />
                    </View> */}
        </View>
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <Modal visible={isModalVisible} transparent={true}>
        <ImageViewer
          imageUrls={ItemImages.map((img) => ({
            url: "",
            props: { source: images[product.image] },
          }))}
          index={selectedImageIndex}
          onSwipeDown={closeModal}
          enableSwipeDown={true}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 40,
            right: 20,
            zIndex: 1,
          }}
          onPress={closeModal}>
          <Feather name="x" size={30} color="#fff" />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ProductsDetails;
