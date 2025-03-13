import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { IMAGES } from "../constants/Images";
import { FONTS, COLORS } from "../constants/theme";
import { useNavigation, useTheme } from "@react-navigation/native";
import { GlobalStyleSheet } from "../constants/StyleSheet";
import { ScrollView } from "react-native";
import data from "../data/data.json";
import { fetchSubcategories } from "../api/categoryApi";

const brand2Data = [
  {
    id: "1",
    title: "Samsung",
    image: IMAGES.LED1,
  },
  {
    id: "2",
    title: "Sony",
    image: IMAGES.LED2,
  },
  {
    id: "3",
    title: "Acer",
    image: IMAGES.LED3,
  },
  {
    id: "4",
    title: "LG",
    image: IMAGES.LED4,
  },
  {
    id: "5",
    title: "Acer",
    image: IMAGES.LED3,
  },
  {
    id: "6",
    title: "LG",
    image: IMAGES.LED4,
  },
  {
    id: "7",
    title: "Sony",
    image: IMAGES.LED2,
  },
  {
    id: "8",
    title: "More",
    image: IMAGES.grid,
  },
];
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
  // {
  //     id:"5",
  //     image:IMAGES.brand9
  // },
  // {
  //     id:"6",
  //     image:IMAGES.brand8
  // },
  // {
  //     id:"7",
  //     image:IMAGES.brand10
  // },
  // {
  //     id:"8",
  //     image:IMAGES.brand11
  // },
  // {
  //     id:"9",
  //     image:IMAGES.brand6
  // },
  // {
  //     id:"10",
  //     image:IMAGES.brand4
  // },
];
const brand3Data = [
  {
    id: "5",
    title: "Cameras",
    image: IMAGES.item22,
  },
  {
    id: "6",
    title: "DSLR",
    image: IMAGES.item12,
  },
  {
    id: "7",
    title: "Accessories",
    image: IMAGES.item21,
  },
  {
    id: "8",
    title: "More",
    image: IMAGES.grid,
  },
];
const brand4Data = [
  {
    id: "5",
    title: "Mouse",
    image: IMAGES.item24,
  },
  {
    id: "6",
    title: "LED",
    image: IMAGES.item13,
  },
  {
    id: "7",
    title: "Keyboard",
    image: IMAGES.item23,
  },
  {
    id: "8",
    title: "More",
    image: IMAGES.grid,
  },
];

const ArrivalData = [
  {
    image: IMAGES.item15,
    title: "Fashion",
  },
  {
    image: IMAGES.item16,
    title: "Beauty",
  },
  {
    image: IMAGES.item17,
    title: "Home",
  },
  {
    image: IMAGES.item20,
    title: "phone",
  },
  {
    image: IMAGES.item15,
    title: "Fashion",
  },
  {
    image: IMAGES.item16,
    title: "Beauty",
  },
  {
    image: IMAGES.item17,
    title: "Home",
  },
  {
    image: IMAGES.item20,
    title: "phone",
  },
];

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const CategoryCart = ({ categoryId, categoryTitle }) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const navigation = useNavigation<any>();
  const [subcategories, setSubcategories] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        const subcategories = await fetchSubcategories(categoryId);
        const uniqueSubcategories = subcategories.filter(
          (subcategory, index, self) =>
            index === self.findIndex((s) => s.id === subcategory.id)
        );
        setSubcategories(uniqueSubcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    loadSubcategories();
  }, [categoryId]);

  const displayedSubcategories = showAll
    ? subcategories
    : subcategories.slice(0, 7);
  return (
    <View>
      <View
        style={[
          GlobalStyleSheet.container,
          {
            paddingHorizontal: 0,
            backgroundColor: theme.dark ? "rgba(255,255,258,.1)" : colors.card,
            marginTop: 15,
          },
        ]}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 10,
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}>
          {displayedSubcategories.map((subcategory, index) => (
            <TouchableOpacity
              key={index}
              style={{ alignItems: "center" }}
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate("Products", {
                  subcategoryId: subcategory.id,
                  subcategoryName: subcategory.name,
                })
              }>
              <View
                style={[
                  {
                    height: 40,
                    width: "100%",
                    paddingHorizontal: 10,
                    backgroundColor: COLORS.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 5,
                  },
                ]}>
                <Text
                  style={[
                    FONTS.fontRegular,
                    { fontSize: 13, color: COLORS.white },
                  ]} >
                  {capitalizeFirstLetter(subcategory.name)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {subcategories.length > 7 && !showAll && (
            <TouchableOpacity
              style={{ alignItems: "center" }}
              activeOpacity={0.5}
              onPress={() => setShowAll(true)}>
              <View
                style={[
                  {
                    height: 40,
                    width: "100%",
                    paddingHorizontal: 10,
                    backgroundColor: COLORS.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}>
                <Text
                  style={[
                    FONTS.fontRegular,
                    { fontSize: 13, color: COLORS.white },
                  ]}>
                  Mostrar más
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* <View style={[GlobalStyleSheet.container,{paddingVertical:5,padding:0,}]}>
            <Image
                style={{width:'100%',height:undefined,aspectRatio:1/.3,resizeMode:'contain'}}
                source={IMAGES.ads4}
            />
        </View> */}
    </View>
  );
};

export default CategoryCart;
