import { View, Text,  ScrollView, Image, TouchableOpacity,useWindowDimensions,Dimensions   } from 'react-native'
import React, { useEffect, useState  } from 'react'
import Header from '../../layout/Header'
import { useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootStackParamList';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CategoryCart from '../../components/CategoryCart';
import { COLORS,FONTS } from '../../constants/theme';
import { GlobalStyleSheet } from '../../constants/StyleSheet';
import { fetchCategories } from '../../api/categoryApi';

const FirstRoute = () => (
    <ScrollView contentContainerStyle={{paddingBottom:20}} showsVerticalScrollIndicator={false}>
        <CategoryCart category="Compresores" />
    </ScrollView>
);
  
const SecondRoute = () => (
    <ScrollView contentContainerStyle={{paddingBottom:20}} showsVerticalScrollIndicator={false}>
         <CategoryCart category="Filtros Secadores" />
    </ScrollView>
);
const ThreeRoute = () => (
    <ScrollView contentContainerStyle={{paddingBottom:20}} showsVerticalScrollIndicator={false}>
        <CategoryCart category="Herramientas" />
    </ScrollView>
);
// const FourRoute = () => (
//     <ScrollView contentContainerStyle={{paddingBottom:20}} showsVerticalScrollIndicator={false}>
//         <CategoryCart/> 
//     </ScrollView>
// );
// const FiveRoute = () => (
//     <ScrollView contentContainerStyle={{paddingBottom:20}} showsVerticalScrollIndicator={false}>
//         <CategoryCart/> 
//     </ScrollView>
// );
  
const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    Three:ThreeRoute,
    // Four:FourRoute,
    // Five:FiveRoute,
});

type CategoryScreenProps = StackScreenProps<RootStackParamList, 'Category'>;

const Category = ({navigation, route} : CategoryScreenProps) => {
  const layout = useWindowDimensions();
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        setRoutes(categories.map(category => ({
          key: category.id,
          title: category.name.toUpperCase(),
        })));
      } catch (error) {
        console.error('Error al cargar las categorías:', error);
      }
    };

    loadCategories();
  }, []);

  const renderScene = ({ route }) => (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
      <CategoryCart category={route.title} />
    </ScrollView>
  );

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Header title='Categorías' leftIcon='back' titleLeft />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={[GlobalStyleSheet.container, { padding: 0, flex: 1 }]}>
          <TabView
            style={{ flexGrow: 1 }}
            renderTabBar={props => (
              <TabBar
                {...props}
                activeColor={COLORS.primary}
                indicatorStyle={{ backgroundColor: COLORS.primary, height: 4, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
                labelStyle={[FONTS.fontMedium, { fontSize: 13, color: colors.text }]}
                scrollEnabled={true}
                tabStyle={{ width: 215 }}
                style={{
                  backgroundColor: theme.dark ? 'rgba(255,255,258,.1)' : colors.card,
                  elevation: 5,
                  paddingVertical: 0
                }}
              />
            )}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default Category