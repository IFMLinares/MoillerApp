import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  TextInput,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
//import FeatherIcon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from "../constants/theme";
import { Feather } from "@expo/vector-icons";
import { GlobalStyleSheet } from "../constants/StyleSheet";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { StackScreenProps } from "@react-navigation/stack";
import { IMAGES } from "../constants/Images";
import { useSelector } from "react-redux";
// import Feather from "react-native-vector-icons/Feather";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Toast from "react-native-toast-message";
import BottomSheet2 from "../screens/Components/BottomSheet2"; 

type Props = {
  title: string;
  leftIcon?: string;
  leftAction?: any;
  transparent?: any;
  productId?: any;
  titleLeft?: any;
  titleLeft2?: any;
  titleRight?: any;
  rightIcon1?: any;
  rightIcon2?: any;
  rightIcon3?: any;
  rightIcon4?: any;
  rightIcon5?: any;
  righttitle?: any;
  righttitle2?: any;
};
const brand5Data = [
  {
    id: "1",
    image: IMAGES.marca,
  },
  {
    id: "2",
    image: IMAGES.marca1,
  },
  {
    id: "3",
    image: IMAGES.marca2,
  },
  {
    id: "4",
    image: IMAGES.marca3,
  },
];
const Header = ({
  title,
  leftIcon,
  leftAction,
  transparent,
  productId,
  titleLeft,
  titleLeft2,
  titleRight,
  rightIcon1,
  rightIcon2,
  rightIcon3,
  rightIcon4,
  rightIcon5,
  righttitle,
  righttitle2,
}: Props) => {
  const wishList = useSelector((state: any) => state.wishList.wishList);

  const cart = useSelector((state: any) => state.cart.cart);

  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const navigation = useNavigation<any>();
  const sheetRef = useRef<any>(null);
  return (
    <View
      style={[
        {
          height: 80,
          backgroundColor: COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
        },
        transparent && {
          position: "absolute",
          left: 0,
          right: 0,
          borderBottomWidth: 0,
        },
        Platform.OS === "ios" && {
          backgroundColor: colors.card,
        },
      ]}>
      <View
        style={[
          GlobalStyleSheet.container,
          {
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 5,
            justifyContent: "space-between",
            //paddingTop:10
          },
        ]}>
        {leftIcon === "back" && (
          <TouchableOpacity
            onPress={() => (leftAction ? leftAction() : navigation.goBack())}
            style={[styles.actionBtn, {}]}>
            <Feather size={24} color={COLORS.card} name={"arrow-left"} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              ...FONTS.fontMedium,
              fontSize: 20,
              color: COLORS.card,
              textAlign: titleLeft ? "left" : "center",
              paddingLeft: titleLeft2 ? 10 : 10,
              paddingRight: titleRight ? 40 : 0,
            }}>
            {title}
          </Text>
          {productId && (
            <Text
              style={{
                ...FONTS.fontSm,
                color: colors.text,
                textAlign: "center",
                marginTop: 2,
              }}>
              {productId}
            </Text>
          )}
        </View>
        {rightIcon1 == "search" && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // position: "relative",
              // left: 15,
            }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.card,
                borderRadius: 18,
                // paddingHorizontal: 10,
              }}>
              <View
                style={{
                  transform: [{ rotate: "90deg" }],
                  marginLeft: 20,
                }}>
                <Feather name="search" size={20} color={COLORS.title} />
              </View>
              <TextInput
                placeholder="Buscar"
                placeholderTextColor={COLORS.title}
                style={{
                  backgroundColor: COLORS.card,
                  width: 140,
                  height: 40,
                  borderRadius: 18,
                  paddingLeft: 10,
                  color: COLORS.title,
                  fontSize: 16,
                  // flex: 1,
                }}
              />
            </View>
          </View>
        )}
        {rightIcon5 == "search" && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Search")}
            style={[styles.actionBtn, {}]}>
            <Feather size={22} color={COLORS.card} name={"search"} />
          </TouchableOpacity>
        )}
        {righttitle && (
          <View style={[styles.actionBtn, { width: 60 }]}>
            <Text
              style={[FONTS.fontMedium, { fontSize: 13, color: COLORS.card }]}>
              {wishList.length} items
            </Text>
          </View>
        )}

        {righttitle2 && (
          <View style={[styles.actionBtn, { width: 60 }]}>
            <Text
              style={[FONTS.fontMedium, { fontSize: 13, color: COLORS.card }]}>
              {cart.length} items
            </Text>
          </View>
        )}
        {rightIcon2 == "cart" && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Mi Carrito")}
            style={[styles.actionBtn, {}]}>
            <Image
              style={{ height: 20, width: 20, tintColor: COLORS.card }}
              source={IMAGES.mycart}
            />
            <View
              style={[
                GlobalStyleSheet.notification,
                {
                  position: "absolute",
                  right: 0,
                  bottom: 20,
                  backgroundColor: "#FFE019",
                },
              ]}>
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 10,
                  color: COLORS.title,
                }}>
                {cart.length}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {rightIcon3 == "home" && (
          <TouchableOpacity
            onPress={() => navigation.navigate("BottomNavigation")}
            style={[styles.actionBtn, {}]}>
            <Image
              style={{ height: 20, width: 20, tintColor: COLORS.card }}
              source={IMAGES.Home4}
            />
            {/* <View
              style={[
                GlobalStyleSheet.notification,
                {
                  position: "absolute",
                  right: 0,
                  bottom: 20,
                  backgroundColor: "#FFE019",
                },
              ]}>
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 10,
                  color: COLORS.title,
                }}>
                0
              </Text>
            </View> */}
          </TouchableOpacity>
        )}
        {rightIcon4 == "filter" && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => sheetRef.current.openSheet("filter")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              width: "35%",
              justifyContent: "center",
            }}>
            <Image
              style={{ height: 16, width: 16, resizeMode: "contain" }}
              source={IMAGES.filter3}
            />
            <Text
              style={[FONTS.fontMedium, { fontSize: 15, color: COLORS.card }]}>
              CATEGORÍAS
            </Text>
            <BottomSheet2 ref={sheetRef} />
            <Toast ref={(ref) => Toast.setRef(ref)} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    ...FONTS.fontMedium,
  },
  actionBtn: {
    height: 35,
    width: 35,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    // position:'absolute',
    // left:10,
    // top:10,
    //backgroundColor:COLORS.background
  },
});

export default Header;
