import { Dimensions } from "react-native";
import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
const {width,height} = Dimensions.get('screen');

export const COLORS = {
	primary: "#193561",
	primaryLight: "#DFE7F4",
	secondary: "#FFE019",
	success: "#159E42",
	danger: "#FF3131",
	warning: "#ffb02c",
	dark: "#2f2f2f",
	light: "#E6E6E6",
	info: "#2B39B9",
	white: "#fff",
	label: "#8A8A8A",
	backgroundColor: "#fff",
	black: "#000", 
	
	//light theme
	card : "#fff",
	background : "#F2F3F8",
	text : "#7D899D",
	title : "#000000",
	borderColor : "rgba(0,0,0,.1)",
	input : "rgba(0,0,0,.03)",
	
	//dark theme
	darkCard : "rgba(255,255,255,.05)",
	darkBackground : "rgba(0,3,3,.9)",
	darkText : "rgba(255,255,255,.6)",
	darkTitle : "#fff",
	darkBorder : "rgba(255,255,255,.2)",
	darkInput : "rgba(255,255,255,.05)",
}

export const SIZES = {
	fontLg: 16,
	font: 14,
	fontSm: 13,
	fontXs: 12,

	//radius
	radius_sm: 8,
	radius: 6,
	radius_lg: 15,

	//space
	padding: 15,
	margin: 15,

	//Font Sizes
	h1: 40,
	h2: 28,
	h3: 24,
	h4: 20,
	h5: 18,
	h6: 16,

	//App dimensions
	width,
	height,

	container: 800,
};

export const FONTS = {
	fontLg: { fontSize: SIZES.fontLg, color: COLORS.text, lineHeight: 20, fontFamily: 'RalewayRegular' },
	font: { fontSize: SIZES.font, color: COLORS.text, lineHeight: 20, fontFamily: 'RalewayRegular' },
	fontSm: { fontSize: SIZES.fontSm, color: COLORS.text, lineHeight: 18, fontFamily: 'RalewayRegular' },
	fontXs: { fontSize: SIZES.fontXs, color: COLORS.text, lineHeight: 14, fontFamily: 'RalewayRegular' },
	h1: { fontSize: SIZES.h1, color: COLORS.title, fontFamily: 'RalewaySemiBold' },
	h2: { fontSize: SIZES.h2, color: COLORS.title, fontFamily: 'RalewaySemiBold' },
	h3: { fontSize: SIZES.h3, color: COLORS.title, fontFamily: 'RalewaySemiBold' },
	h4: { fontSize: SIZES.h4, color: COLORS.title, fontFamily: 'RalewaySemiBold' },
	h5: { fontSize: SIZES.h5, color: COLORS.title, fontFamily: 'RalewaySemiBold' },
	h6: { fontSize: SIZES.h6, color: COLORS.title, fontFamily: 'RalewaySemiBold' },
	fontBold: { fontFamily: 'RalewayBold' },
	fontMedium: { fontFamily: 'RalewayMedium' },
	fontTitle: { fontFamily: 'RalewayMedium' },
	fontRegular: { fontFamily: 'RalewayRegular' },
	fontSemiBold: { fontFamily: 'RalewaySemiBold' },
	fontJostLight: { fontFamily: 'RalewayLight' },
	fontJostExtraLight: { fontFamily: 'RalewayExtraLight' },
	Marcellus: { fontFamily: 'MarcellusRegular' },
	fontJostItalic: { fontFamily: 'RalewayItalic' },
	fontJostSemiBoldItalic: { fontFamily: 'RalewaySemiBoldItalic' },
	fontJostLightItalic: { fontFamily: 'RalewayLightItalic' },
	fontJostMediumItalic: { fontFamily: 'RalewayMediumItalic' },
}


const appTheme = {COLORS, SIZES, FONTS}

export default appTheme;