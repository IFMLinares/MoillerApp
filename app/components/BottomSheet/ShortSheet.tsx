import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import { GlobalStyleSheet } from "../../constants/StyleSheet";
import { COLORS, FONTS } from "../../constants/theme";
import { IMAGES } from "../../constants/Images";

type Props = {
  shortRef?: any;
  onSortChange: (sortOption: string) => void; // Agregar esta línea
  activeSortCriteria: string; // Nueva prop para sincronizar el estado inicial
};

const ShortSheet2 = ({ shortRef, onSortChange, activeSortCriteria }: Props) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;

  const SortData = [
    "De la A a la Z",
    "De la Z a la A",
    "Precio: menor a mayor",
    "Precio: mayor a menor",
    "Lo más nuevo primero",
  ];

  const [activeSize, setActiveSize] = useState(activeSortCriteria);

    // Sincroniza el estado inicial con la prop activeSortCriteria
    useEffect(() => {
      setActiveSize(activeSortCriteria);
    }, [activeSortCriteria]);

  return (
    <View
      style={[
        GlobalStyleSheet.container,
        {
          paddingTop: 0,
          backgroundColor: theme.dark ? colors.background : colors.card,
        },
      ]}>
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
        }}>
        <Text style={[FONTS.fontMedium, { color: colors.title, fontSize: 16 }]}>
          Ordenar por:
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
          onPress={() => shortRef.current.close()}>
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
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 20 }}>
        {SortData.map((data, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setActiveSize(data); // Actualiza el estado con la opción seleccionada
                onSortChange(data); // Notifica al componente padre
                shortRef.current.close(); // Cierra el BottomSheet
              }}
              key={index}
              style={[
                {
                  height: 40,
                  width: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 5,
                  marginBottom: 5,
                },
                activeSize === data && {
                  backgroundColor: colors.card,
                },
              ]}>
              <Text
                style={[
                  { ...FONTS.fontRegular, fontSize: 15, color: colors.title },
                  activeSize === data && { color: COLORS.primary },
                ]}>
                {data}
              </Text>
              <View
                style={[
                  {
                    backgroundColor: COLORS.primaryLight,
                    width: 24,
                    height: 24,
                    borderRadius: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  activeSize === data && {
                    backgroundColor: COLORS.primary,
                  },
                ]}>
                <View
                  style={[
                    {
                      width: 14,
                      height: 14,
                      backgroundColor: colors.card,
                      borderRadius: 50,
                    },
                    activeSize === data && {
                      backgroundColor: colors.card,
                    },
                  ]}></View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default ShortSheet2;
