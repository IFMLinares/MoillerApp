declare module "react-native-swiper/src" {
    import { Component } from "react";
    import { ViewStyle, StyleProp } from "react-native";
  
    interface SwiperProps {
      autoplay?: boolean;
      autoplayTimeout?: number;
      height?: number | string;
      dotStyle?: StyleProp<ViewStyle>;
      activeDotStyle?: StyleProp<ViewStyle>;
      paginationStyle?: StyleProp<ViewStyle>;
      showsPagination?: boolean;
      loop?: boolean;
      onIndexChanged?: (index: number) => void;
      children?: React.ReactNode;
    }
  
    export default class Swiper extends Component<SwiperProps> {}
  }