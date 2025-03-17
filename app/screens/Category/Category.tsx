import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Header from "../../layout/Header";
import { useTheme } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/RootStackParamList";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import CategoryCart from "../../components/CategoryCart";
import { COLORS, FONTS } from "../../constants/theme";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { fetchCategories } from "../../api/categoryApi";
import { IMAGES } from "../../constants/Images";
import BottomSheet2 from "../Components/BottomSheet2";
import Toast from "react-native-toast-message";
type CategoryScreenProps = StackScreenProps<RootStackParamList, "Category">;

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
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const Category = ({ navigation, route }: CategoryScreenProps) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [show, setShow] = useState(true);
  const sheetRef = useRef<any>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        // Filtrar las categorías para excluir "Consumo" y "Servicios"
        const filteredCategories = categories.filter(
          (category) => category.name !== "CONSUMO" && category.name !== "SERVICIOS"
        );
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    loadCategories();
  }, []);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={{ alignItems: "center", margin: 10 }}
      onPress={() => setSelectedCategory(item.id)}>
      <View
        style={{
          height: 70,
          width: 70,
          borderRadius: 50,
          backgroundColor: COLORS.primaryLight,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Image
          source={IMAGES[item.image]}
          style={{ height: 50, width: 50, borderRadius: 25 }}
        />
      </View>
      <Text
        style={[
          FONTS.fontRegular,
          {
            fontSize: 13,
            color: colors.title,
            marginTop: 5,
            width: "100%",
            textAlign: "center",
          },
        ]}
        numberOfLines={2}>
        {capitalizeFirstLetter(item.name)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header
        title="Categorías"
        leftIcon="back"
        titleLeft
        rightIcon4="filter"
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View style={{ padding: 10 }}>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={{ alignItems: "center" }}
          />
        </View>
        {selectedCategory && <CategoryCart categoryId={selectedCategory} />}
        <View
          style={[
            GlobalStyleSheet.container,
            {
              paddingHorizontal: 0,
              backgroundColor: theme.dark
                ? "rgba(255,255,258,.1)"
                : colors.card,
              marginTop: 0,
            },
          ]}>
          <View
            style={{
              paddingHorizontal: 15,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.primaryLight,
              paddingBottom: 15,
            }}>
            <Text
              style={[FONTS.fontMedium, { fontSize: 14, color: colors.title }]}>
              Marca
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 20,
              paddingTop: 20,
              alignItems: "center",
              justifyContent: "center",
              gap: 15,
            }}>
            {brand5Data.map((data: any, index) => {
              return (
                <View
                  key={index}
                  style={[
                    {
                      height: 70,
                      width: 70,
                      borderRadius: 50,
                      borderWidth: 1,
                      borderColor: COLORS.primaryLight,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}>
                  <Image
                    style={[
                      {
                        height: 65,
                        width: 65,
                        resizeMode: "contain",
                        borderRadius: 40,
                        backgroundColor: COLORS.primary,
                      },
                    ]}
                    source={data.image}
                  />
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <BottomSheet2 ref={sheetRef} />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

export default Category;
