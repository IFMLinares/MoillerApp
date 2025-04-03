import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { useTheme } from "@react-navigation/native";
import LikeBtn from "../LikeBtn";
import CheckoutItems from "../CheckoutItems";
import { IMAGES } from "../../constants/Images";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { Feather } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
type Props = {
  title: string;
  //color : any;
  //style ?: object;
  //rounded ?: any;
  //size ?: string;
  marca: string;
  modelo: string;
  price: string;
  image?: any;
  delevery: string;
  removelikebtn?: any;
  offer?: any;
  btntitle?: string;
  brand?: any;
  discount?: any;
  closebtn?: any;
  trackorder?: any;
  completed?: any;
  EditReview?: any;
  removebottom?: any;
  onPress?: (e: any) => void;
  onPress2?: (e: any) => void;
  onPress3?: (e: any) => void;
  onPress4?: (e: any) => void;
  hideActions?: boolean; // Nueva propiedad para ocultar botones
  //hascolor:any
};

const Cardstyle3 = ({
  title,
  price,
  image,
  marca,
  modelo,
  delevery,
  removelikebtn,
  offer,
  btntitle,
  onPress,
  brand,
  discount,
  closebtn,
  trackorder,
  completed,
  EditReview,
  onPress2,
  removebottom,
  onPress3,
  onPress4,
  hideActions = false, // Valor predeterminado: no ocultar botones
}: Props) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  return (
    <View
      style={{
        marginTop: 0,
        paddingHorizontal: 15,
        paddingVertical: 10,
        paddingBottom: 0,
        backgroundColor: theme.dark ? "rgba(255,255,255,.1)" : colors.card,
      }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.5}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 0,
          justifyContent: "center",
          borderBottomWidth: removebottom ? 0 : 1,
          borderBottomColor: COLORS.primaryLight,
          paddingBottom: 10,
          marginHorizontal: -15,
        }}>
         <Image
          style={{
            height: undefined,
            width: SIZES.width / 6,
            aspectRatio: 1 / 1,
            resizeMode: "contain",
          }}
          source={image}
        /> 
        <View style={{ flex: 1 }}>
          <Text
            style={[
              FONTS.fontMedium,
              { fontSize: 12, color: COLORS.primary, paddingRight: 30 },
            ]}>
            {brand}
          </Text>
          <Text
            numberOfLines={0}
            style={[
              FONTS.fontMedium,
              {
                fontSize: 13,
                color: colors.title,
                marginTop: 5,
                paddingRight: 10,
              },
            ]}>
            {title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 2,
              width: "100%",
            }}>
            <Text
              style={[
                FONTS.fontRegular,
                {
                  fontSize: wp("2.5%"),
                  color: COLORS.success,
                  fontWeight: "bold",
                  marginLeft: 10,
                  width: "33%",
                },
              ]}>
              {marca}
            </Text>
            <Text
              style={[
                FONTS.fontRegular,
                {
                  fontSize: wp("2.5%"),
                  color: COLORS.red,
                  fontWeight: "bold",
                  width: "33%",
                },
              ]}>
              {modelo}
            </Text>
            <Text
              style={[
                FONTS.fontMediumItalic,
                {
                  fontSize: 14,
                  color: COLORS.white,
                  borderRadius: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 1,
                  backgroundColor: COLORS.primary,
                  fontWeight: "bold",
                },
              ]}>
              {price} €
            </Text>
            <Text
              style={[
                FONTS.fontJostLight,
                {
                  fontSize: 12,
                  color: colors.title,
                  textDecorationLine: "line-through",
                  opacity: 0.6,
                },
              ]}>
              {discount}
            </Text>
            <Text
              style={[
                FONTS.fontRegular,
                { fontSize: 12, color: COLORS.danger },
              ]}>
              {offer}
            </Text>
          </View> 
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginTop: 10,
            }}>  
          </View>
        </View>
        {closebtn && !hideActions ? (
          <TouchableOpacity
            onPress={onPress4}
            style={{ position: "absolute", right: 10, top: 5 }}
          >
            <Feather size={20} color={colors.title} name={"x"} />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
      {!removebottom && !hideActions ? (
        <View
          style={{
            height: 40,
            width: "100%",
            justifyContent: "space-around",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View>
            <CheckoutItems />
          </View>
          <View
            style={{
              width: 1,
              height: 40,
              backgroundColor: COLORS.primaryLight,
            }}
          />
          <TouchableOpacity
            onPress={onPress4}
            activeOpacity={0.5}
            style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
          >
            <Image
              style={{
                height: 16,
                width: 16,
                resizeMode: "contain",
                tintColor: COLORS.danger,
              }}
              source={IMAGES.delete}
            />
            <Text
              style={{
                ...FONTS.fontMedium,
                fontSize: 14,
                color: COLORS.danger,
              }}
            >
              Eliminar
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default Cardstyle3;
