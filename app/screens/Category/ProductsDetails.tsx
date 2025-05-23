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
  TextInput,
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
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/reducer/cartReducer";
import { addTowishList } from "../../redux/reducer/wishListReducer";
import { RootState } from "../../redux/reducer";
import FontAwesome from "react-native-vector-icons/FontAwesome6";
import Toast from "react-native-toast-message";
import ImageViewer from "react-native-image-zoom-viewer";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Linking from "expo-linking"; // Importar Linking para abrir URLs
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system"; // Importar FileSystem
import * as Sharing from "expo-sharing"; // Importar Sharing para compartir el archivo descargado
import { ResizeMode } from "expo-av";
// api articulos
import { addItemToCartApi } from "../../api/addItemApi";
import { BASE_URL } from "../../api/globalUrlApi"; // Importar la URL base

// api articulos

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

type ProductsDetailsScreenProps = StackScreenProps<
  RootStackParamList,
  "ProductsDetails"
>;

const ProductsDetails = ({ route, navigation }: ProductsDetailsScreenProps) => {
  // api

  const { product, productId } = route.params;
  console.log("Producto recibido:", product); // Depuración
  console.log("ID del producto recibido:", productId); // Depuración
  // api

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [Select, setSelect] = useState(offerData[0]);
  const clienteId = useSelector((state: RootState) => state.user.clienteId); // Especifica el tipo del estado
  console.log("clienteId desde Redux:", clienteId); // Verifica el valor del clienteId
  const cart = useSelector((state: RootState) => state.cart.cart); // Mover useSelector aquí

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const downloadAndOpenPDF = async () => {
    try {
      // Verifica si la URL es relativa y la convierte en una URL completa
      const fileUrl = product.fichaTecnica.startsWith("http")
        ? product.fichaTecnica
        : `${BASE_URL}${product.fichaTecnica}`;

      const fileUri = `${FileSystem.documentDirectory}ficha_tecnica.pdf`; // Ruta donde se guardará el archivo
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        fileUri
      );

      const result = await downloadResumable.downloadAsync();
      if (!result || !result.uri) {
        throw new Error("No se pudo descargar el archivo.");
      }

      console.log("Archivo descargado en:", result.uri);

      // Verificar si el archivo se puede compartir/abrir
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri);
      } else {
        alert(
          "El archivo se descargó, pero no se puede abrir automáticamente."
        );
      }
    } catch (error) {
      console.error("Error al descargar el archivo:", error);
      alert(
        "Hubo un error al descargar el archivo. Por favor, inténtalo de nuevo."
      );
    }
  };

  const onShare = async () => {
    try {
      const deepLink = `${product.id}`; // Cambia "myapp" por el esquema de tu aplicación
      const message = `
        Nombre del artículo: ${product.name}
        Precio: ${product.price} €
        Código del artículo: ${product.code}
        Marca: ${product.brand}
        Modelo: ${product.model}
        Categoría: ${product.line}
        Subcategoría: ${product.subline}
        
        Ver más detalles aquí: ${deepLink}
      `;

      const result = await Share.share({
        message: message.trim(),
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Compartido con un tipo de actividad específico
        } else {
          // Compartido sin tipo de actividad
        }
      } else if (result.action === Share.dismissedAction) {
        // Compartir fue descartado
      }
    } catch (error: any) {
      console.error("Error al compartir:", error);
    }
  };

  const dispatch = useDispatch();

  const addItemToCart = async () => {
    const productWithQuantity = {
      ...product,
      quantity, // Incluye la cantidad seleccionada
      clienteId, // Incluye el clienteId
    };

    try {
      // Verificar si el producto ya está en el carrito
      const existingCartItem = cart.find(
        (cartItem: any) => cartItem.id === product.id
      );

      let newQuantity = quantity;

      if (existingCartItem) {
        // Si el producto ya está en el carrito, suma la cantidad
        newQuantity = existingCartItem.quantity + quantity;

        // Mostrar mensaje con la cantidad total
        Toast.show({
          type: "info",
          text1: "Producto actualizado",
          text2: `Ahora tienes ${newQuantity} unidades de este producto en tu carrito.`,
        });
      } else {
        // Mostrar mensaje de éxito si es un producto nuevo
        Toast.show({
          type: "success",
          text1: "¡Producto añadido al carrito exitosamente!",
        });
      }

      // Llamada a la API para actualizar la cantidad total
      const response = await addItemToCartApi(
        clienteId,
        product.id,
        newQuantity
      );

      console.log("Respuesta de la API:", response); // Verifica la respuesta

      // Actualizar el estado en Redux
      dispatch(addToCart({ ...product, quantity: newQuantity }));
    } catch (error) {
      console.error("Error al añadir al carrito:", error); // Depuración de errores
      Toast.show({
        type: "error",
        text1: "Error al añadir al carrito",
        text2: "Por favor, inténtelo de nuevo.",
      });
    }
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

  const ListwithiconData = [
    {
      title: "GENERAL",
      data: [
        {
          title: "Marca",
          text: product.brand, // Mostrar el campo `brand` (cat_des)
        },
        {
          title: "Modelo",
          text: product.model,
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
  ];

  const getMediaItems = (product: any) => {
    const mediaItems = []; 
    // Verificar si `lowImage` está disponible
    if (product?.lowImage) {
      mediaItems.push({
        type: "image",
        url: `${BASE_URL}${product.lowImage}`, // Generar la URL completa para la imagen de baja calidad
      });
    }

    // Verificar si `highImage` está disponible
    if (product?.highImage) {
      mediaItems.push({
        type: "image",
        url: `${BASE_URL}${product.highImage}`, // Generar la URL completa para la imagen de alta calidad
      });
    }

    // Agregar video al arreglo (si existe)
    if (product?.video) {
      mediaItems.push({
        type: "video",
        url: product.video,
      });
    }

    return mediaItems;
  };

  const mediaItems = getMediaItems(product);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title="Detalles del producto"
        leftIcon="back"
        rightIcon5={"search"}
        rightIcon2={"cart"}
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
            {mediaItems.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => openModal(index)}>
                {item.type === "image" ? (
                  <Image
                    style={{
                      height: hp("30%"),
                      width: wp("100%"),
                      resizeMode: "contain",
                    }}
                    source={{ uri: item.url }}
                  />
                ) : (
                  <View
                    style={{
                      height: hp("30%"),
                      width: wp("100%"),
                      backgroundColor: "black",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Feather name="play-circle" size={50} color="white" />
                  </View>
                )}
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
              justifyContent: "space-between",
            }}>
            <View style={{}}></View>
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
              </TouchableOpacity>
            </View>
          </View>
        </View>

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
                FONTS.fontJostMediumItalic, // Cambia a la propiedad correcta
                { fontSize: 20, color: COLORS.primary, fontWeight: "bold" },
              ]}>
              {product.price} €
            </Text>
          </View>
        </View>

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
            style={[
              FONTS.fontRegular,
              { fontSize: 16, color: COLORS.success },
            ]}>
            Código del artículo: {product.code}
          </Text>
          <TouchableOpacity
            onPress={downloadAndOpenPDF} // Llama a la función para descargar y abrir el PDF
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: COLORS.primary,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.white,
                textAlign: "center",
                fontWeight: "bold",
              }}>
              FICHA TÉCNICA
            </Text>
          </TouchableOpacity>
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
            <TextInput
              style={{
                fontSize: 18,
                marginHorizontal: 10,
                fontWeight: "bold",
                textAlign: "center",
                width: 40,
              }}
              keyboardType="numeric"
              value={String(quantity)}
              onChangeText={(text) => {
                const num = parseInt(text);
                if (!isNaN(num) && num > 0) {
                  setQuantity(num);
                }
              }}
            />
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
              <Text
                style={{
                  fontSize: wp("4%"),
                  color: COLORS.white,
                  textAlign: "center",
                  fontWeight: "bold",
                }}>
                AGREGAR AL CARRITO
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Toast />

      <Modal visible={isModalVisible} transparent={true}>
        {mediaItems[selectedImageIndex]?.type === "image" ? (
          <ImageViewer
            imageUrls={mediaItems
              .filter((item) => item.type === "image")
              .map((item) => ({ url: item.url }))}
            index={selectedImageIndex}
            onSwipeDown={closeModal}
            enableSwipeDown={true}
          />
        ) : (
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Video
              source={{ uri: mediaItems[selectedImageIndex]?.url }} // URL del video
              style={{ width: "100%", height: "100%" }}
              useNativeControls // Habilita los controles nativos
              resizeMode={"contain" as ResizeMode} // Conversión explícita de tipo
              shouldPlay // Reproduce automáticamente
              onError={(error) =>
                console.error("Error al reproducir el video:", error)
              } // Maneja errores
            />
          </View>
        )}
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
