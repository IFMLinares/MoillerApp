import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS, FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";
import Button from "../Button/Button";
import { useNavigation, useTheme } from "@react-navigation/native";
import ButtonOutline from "../Button/ButtonOutline";
import { fetchCategories, fetchSubcategories } from "../../api/categoryApi";

const brandData = [
  {
    title: "Nike",
    image: IMAGES.brand1,
  },
  {
    title: "Adidas",
    image: IMAGES.brand2,
  },
  {
    title: "Reebok",
    image: IMAGES.brand3,
  },
  {
    title: "Puma",
    image: IMAGES.brand4,
  },
  {
    title: "Bata",
    image: IMAGES.brand5,
  },
  {
    title: "Nike",
    image: IMAGES.brand6,
  },
  {
    title: "Adidas",
    image: IMAGES.brand7,
  },
  {
    title: "Reebok",
    image: IMAGES.brand8,
  },
  {
    title: "Puma",
    image: IMAGES.brand9,
  },
  {
    title: "Bata",
    image: IMAGES.brand10,
  },
];

type Props = {
  sheetRef?: any;
};

const FilterSheet2 = ({ sheetRef }: Props) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const navigation = useNavigation();

  // const brandData = ["Adidas", "Reebok", "Zara", "Gucci", "Vogue"];

  // const [activeSize, setActiveSize] = useState(brandData[0]);

  const categoriesData = [
    "All",
    "Face Wash",
    "Cleanser",
    "Scrubs",
    "Makeup Remover",
    "Hand Cream",
  ];

  const [active1Size, setActive1Size] = useState(categoriesData[0]);

  const sizeData = ["S", "M", "L", "XL", "2XL"];

  const [active2Size, setActive2Size] = useState(sizeData[0]);

  const [active3Size, setActive3Size] = useState(brandData[0]);

  const [multiSliderValue, setMultiSliderValue] = useState([200, 270]);

  const multiSliderValuesChange = (values: any) => setMultiSliderValue(values);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadSubcategories = async () => {
      if (selectedCategory) {
        try {
          const subcategories = await fetchSubcategories(selectedCategory);
          setSubcategories(subcategories);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    loadSubcategories();
  }, [selectedCategory]);

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 5);
  const displayedSubcategories = showAllSubcategories ? subcategories : subcategories.slice(0, 5);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  const [values, setValues] = useState<any>([0, 50]); // Initial values for the range

  const handleValuesChange = (newValues: any) => {
    setValues(newValues);
  };

  return (
    <View
      style={[
        GlobalStyleSheet.container,
        {
          paddingTop: 0,
          backgroundColor: theme.dark ? colors.background : colors.card,
          height: "100%",
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          paddingBottom: 10,
          paddingTop: 10,
          marginHorizontal: -15,
          paddingHorizontal: 15,
        }}
      >
        <Text style={[FONTS.fontMedium, { color: colors.title, fontSize: 16 }]}>
          Filtros
        </Text>
        <TouchableOpacity
          style={{
            height: 38,
            width: 38,
            backgroundColor: colors.card,
            borderRadius: 38,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => sheetRef.current.close()}
        >
          <Image
            style={{
              width: 18,
              height: 18,
              resizeMode: "contain",
              tintColor: colors.title,
            }}
            source={IMAGES.close}
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {showCategories && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text
                style={{ ...FONTS.fontMedium, fontSize: 15, color: colors.title }}
              >
                Categorías
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setShowAllCategories(!showAllCategories)}
              >
                <Text
                  style={{ ...FONTS.fontRegular, fontSize: 13, color: COLORS.primary }}
                >
                  {showAllCategories ? "Mostrar menos" : "Mostrar todos"}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{ marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 10 }}
            >
              {displayedCategories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    setShowCategories(false);
                  }}
                  style={{ alignItems: "center" }}
                >
                  <View
                    style={[
                      {
                        height: 45,
                        width: 45,
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: COLORS.primaryLight,
                        alignItems: "center",
                        justifyContent: "center",
                      },
                      selectedCategory === category.id && {
                        borderColor: COLORS.primary,
                      },
                    ]}
                  >
                    <Image
                      style={{
                        height: 30,
                        width: 30,
                        resizeMode: "contain",
                        borderRadius: 30,
                      }}
                      source={IMAGES[category.image]}
                    />
                  </View>
                  <Text
                    style={[
                      FONTS.fontMedium,
                      {
                        fontSize: 14,
                        color: colors.title,
                        marginTop: 10,
                        width: "100%",
                        textAlign: "center",
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {capitalizeFirstLetter(category.name)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        {selectedCategory && (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  ...FONTS.fontMedium,
                  fontSize: 15,
                  color: colors.title,
                }}
              >
                Subcategorías
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setShowAllSubcategories(!showAllSubcategories)}
              >
                <Text
                  style={{
                    ...FONTS.fontRegular,
                    fontSize: 13,
                    color: COLORS.primary,
                  }}
                >
                  {showAllSubcategories ? "Mostrar menos" : "Mostrar todos"}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 5,
                marginTop: 10,
              }}
            >
              {displayedSubcategories.map((subcategory, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setActiveSubcategory(subcategory.id);
                    navigation.navigate("Products", {
                      subcategoryId: subcategory.id,
                      subcategoryName: subcategory.name,
                    });
                    sheetRef.current.close();
                  }}
                  style={[
                    {
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: COLORS.primaryLight,
                      paddingHorizontal: 20,
                      paddingVertical: 5,
                      marginBottom: 5,
                    },
                    activeSubcategory === subcategory.id && {
                      backgroundColor: COLORS.primary,
                      borderColor: COLORS.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      {
                        ...FONTS.fontMedium,
                        fontSize: 13,
                        color: colors.title,
                      },
                      activeSubcategory === subcategory.id && {
                        color: COLORS.white,
                      },
                    ]}
                  >
                    {capitalizeFirstLetter(subcategory.name)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => setShowCategories(true)}
              style={{
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  ...FONTS.fontRegular,
                  fontSize: 13,
                  color: COLORS.primary,
                }}
              >
                Volver a Categorías
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default FilterSheet2;
