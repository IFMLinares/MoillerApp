import { View, Text, FlatList, TouchableOpacity, Image} from "react-native";
import React, { useEffect, useState }  from "react";
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

const CategoryCart = ({ categoryId }) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const navigation = useNavigation<any>();
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        const subcategories = await fetchSubcategories(categoryId);
        // Filtrar subcategorías duplicadas por id
        const uniqueSubcategories = subcategories.filter((subcategory, index, self) =>
          index === self.findIndex((s) => s.id === subcategory.id)
        );
        setSubcategories(uniqueSubcategories);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    loadSubcategories();
  }, [categoryId]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ alignItems: "center", marginRight: 20 }}
      activeOpacity={0.5}
      onPress={() =>
        navigation.navigate("Products", {
          subcategoryId: item.id,
          subcategoryName: item.name,
        })
      }
    >
      <View
        style={{
          height: 60,
          width: 60,
          borderRadius: 50,
          borderWidth: 1,
          borderColor: COLORS.primaryLight,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{ height: 40, width: 45, resizeMode: "contain" }}
          source={{ uri: item.image }} // Assuming you have an image URL in your subcategory data
        />
      </View>
      <Text
        style={[
          FONTS.fontRegular,
          { fontSize: 13, color: colors.title, marginTop: 10 },
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );


  return (
    <View>
      <View
        style={[
          GlobalStyleSheet.container,
          {
            paddingHorizontal: 0,
            backgroundColor: theme.dark ? "rgba(255,255,258,.1)" : colors.card,
            marginTop: 10,
          },
        ]}
      >
        <FlatList
          data={subcategories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={{ paddingHorizontal: 20, flexGrow: 1 }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {/* <View style={[GlobalStyleSheet.container,{paddingHorizontal:0,backgroundColor:theme.dark ? 'rgba(255,255,258,.1)':colors.card,marginTop:15}]}>
            <View style={{paddingHorizontal:15,borderBottomWidth:1,borderBottomColor:COLORS.primaryLight,paddingBottom:15}}>
                <Text style={[FONTS.fontMedium,{fontSize:14,color:colors.title}]}>Televisions</Text>
            </View>
            <View style={{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:20,paddingTop:20,alignItems:'center',justifyContent:'center',gap:20}}>
                {brand2Data.map((data:any,index) => {
                    return(
                        <TouchableOpacity 
                            key={index} 
                            style={{alignItems:'center',}}
                            activeOpacity={0.5}
                            onPress={() => navigation.navigate('Products')}
                        >
                            <View style={[{height:70,width:70,borderRadius:50,backgroundColor:COLORS.primaryLight,alignItems:'center',justifyContent:'center'},data.id == 8 && {backgroundColor:colors.card,borderWidth:1,borderColor:COLORS.primaryLight}]}>
                                <Image
                                    style={[{height:38,width:60,resizeMode:'contain'},data.id == 8 && {
                                        height:24,width:24,tintColor:COLORS.primary
                                    }]}
                                    source={data.image}
                                />
                            </View>
                            <Text style={[FONTS.fontRegular,{fontSize:13,color:colors.title,marginTop:10},data.id == 8 && {color:COLORS.primary}]}>{data.title}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View> */}
      {/* <View style={[GlobalStyleSheet.container,{paddingHorizontal:0,backgroundColor:theme.dark ? 'rgba(255,255,258,.1)':colors.card,marginTop:15}]}>
            <View style={{paddingHorizontal:15,borderBottomWidth:1,borderBottomColor:COLORS.primaryLight,paddingBottom:15}}>
                <Text style={[FONTS.fontMedium,{fontSize:14,color:colors.title}]}>Camera</Text>
            </View>
            <View style={{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:20,paddingTop:20,alignItems:'center',justifyContent:'center',gap:20}}>
                {brand3Data.map((data:any,index) => {
                    return(
                        <TouchableOpacity 
                            key={index} 
                            style={{alignItems:'center',}}
                            activeOpacity={0.5}
                            onPress={() => navigation.navigate('Products')}
                        >
                            <View style={[{height:70,width:70,borderRadius:50,backgroundColor:COLORS.primaryLight,alignItems:'center',justifyContent:'center'},data.id == 8 && {backgroundColor:colors.card,borderWidth:1,borderColor:COLORS.primaryLight}]}>
                                <Image
                                    style={[{height:70,width:70,resizeMode:'contain'},data.id == 8 && {
                                        height:24,width:24,tintColor:COLORS.primary
                                    }]}
                                    source={data.image}
                                />
                            </View>
                            <Text style={[FONTS.fontRegular,{fontSize:13,color:colors.title,marginTop:10},data.id == 8 && {color:COLORS.primary}]}>{data.title}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View> */}
      {/* <View style={[GlobalStyleSheet.container,{paddingHorizontal:0,paddingTop:15,paddingBottom:0}]}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20 }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 10 }}>
                    {ArrivalData.map((data:any, index) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => navigation.navigate('Products')}
                                key={index}
                                style={{
                                    backgroundColor:colors.card,
                                    height: 35,
                                    alignItems: 'center',
                                    gap:5,
                                    //justifyContent: 'center',
                                    flexDirection:'row',
                                    borderRadius: 34,
                                    borderWidth:1,
                                    borderColor:colors.text,
                                    //marginTop: 10,
                                    paddingHorizontal: 5,
                                    paddingVertical: 5,
                                    overflow:'hidden'
                                }}>
                                <Image
                                    style={{width:44,height:45,resizeMode:'contain'}}
                                    source={data.image}
                                />
                                <Text style={{ ...FONTS.fontMedium, fontSize: 13, color:colors.title }}>{data.title}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>
        </View> */}
      {/* <View style={[GlobalStyleSheet.container,{paddingHorizontal:0,backgroundColor:theme.dark ? 'rgba(255,255,258,.1)':colors.card,marginTop:15}]}>
            <View style={{paddingHorizontal:15,borderBottomWidth:1,borderBottomColor:COLORS.primaryLight,paddingBottom:15}}>
                <Text style={[FONTS.fontMedium,{fontSize:14,color:colors.title}]}>Computer Accessories</Text>
            </View>
            <View style={{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:20,paddingTop:20,alignItems:'center',justifyContent:'center',gap:20}}>
                {brand4Data.map((data:any,index) => {
                    return(
                        <TouchableOpacity 
                            key={index} 
                            style={{alignItems:'center',}}
                            activeOpacity={0.5}
                            onPress={() => navigation.navigate('Products')}
                        >
                            <View style={[{height:70,width:70,borderRadius:50,backgroundColor:COLORS.primaryLight,alignItems:'center',justifyContent:'center'},data.id == 8 && {backgroundColor:colors.card,borderWidth:1,borderColor:COLORS.primaryLight}]}>
                                <Image
                                    style={[{height:70,width:70,resizeMode:'contain'},data.id == 8 && {
                                        height:24,width:24,tintColor:COLORS.primary
                                    }]}
                                    source={data.image}
                                />
                            </View>
                            <Text style={[FONTS.fontRegular,{fontSize:13,color:colors.title,marginTop:10},data.id == 8 && {color:COLORS.primary}]}>{data.title}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View> */}
      {/* <View style={[GlobalStyleSheet.container,{paddingVertical:5,padding:0,}]}>
            <Image
                style={{width:'100%',height:undefined,aspectRatio:1/.3,resizeMode:'contain'}}
                source={IMAGES.ads4}
            />
        </View> */}
      <View
        style={[
          GlobalStyleSheet.container,
          {
            paddingHorizontal: 0,
            backgroundColor: theme.dark ? "rgba(255,255,258,.1)" : colors.card,
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
              // <TouchableOpacity
              //   key={index}
              //   style={{ alignItems: "center" }}
              //   activeOpacity={0.5}
              //   onPress={() => navigation.navigate("Products")}>
                <View
                  style={[
                    {
                      height:70,
                      width:70,
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
              // </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default CategoryCart;
