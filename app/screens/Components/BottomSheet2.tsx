import { View, Text } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTheme } from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import FilterSheet2 from '../../components/BottomSheet/FilterSheet';
import ShortSheet2 from '../../components/BottomSheet/ShortSheet';
import GenderSheet2 from '../../components/BottomSheet/GenderSheet';
import LanguageoptionSheet from '../../components/BottomSheet/LanguageoptionSheet';
import NotificationSheet from '../../components/BottomSheet/NotificationSheet';
import SkipLoginSheet from '../../components/BottomSheet/SkipLoginSheet';


type Props = {
   height ?: string,
}

const BottomSheet2 = forwardRef((props, ref) => {
    const {colors} : {colors : any} = useTheme();
    const rbsheetRef = useRef<any>();
    const [sheetType, setSheetType ] = useState<any>('');

    useImperativeHandle(ref, () => ({
        openSheet : async (value:string) => {
            await setSheetType(value);
            await rbsheetRef.current.open();
        },
        closeSheet() {
            rbsheetRef.current.close();
        }
    }));

    return(
        <>
        <RBSheet
            ref={rbsheetRef}
            closeOnDragDown={true}
            height={sheetType === "gender" ? 150 :
                    sheetType === "short" ? 330 :
                    sheetType === "filter" ? 550 :
                    sheetType === "notification" ? 350 :
                    sheetType === "SkipLoginSheet" ? 480 :
                    sheetType === "Language" ? 300 : 200}
            openDuration={100}
            customStyles={{
                container:{
                    backgroundColor: colors.cardBg,
                },
                draggableIcon: {
                    marginTop:10,
                    marginBottom:0,
                    height:5,
                    width:80,
                    backgroundColor: colors.border,
                }
            }}
        >
            {(sheetType === "gender") &&
                <GenderSheet genderRef={rbsheetRef}/>
            }
            {(sheetType === "short") &&
                <ShortSheet ShortRef={rbsheetRef}/>
            }
            {(sheetType === "notification") &&
                <NotificationSheet2 moresheet2={rbsheetRef}/>
            }
            {(sheetType === "SkipLoginSheet") &&
                <SkipLoginSheet2 moresheet3={rbsheetRef}/>
            }
            {(sheetType === "filter") &&
                <FilterSheet  sheetRef={rbsheetRef}/>
            }
            {(sheetType === "Language") &&
                <LanguageSheet setLanguage={props.setLanguage}/>
            }
        </RBSheet>
    </>
)
});


const ShortSheet = forwardRef(({ ShortRef } : { ShortRef : any}, ref) => {
    return(
        <View>
            <ShortSheet2
                shortRef={ShortRef}
            />
        </View>
    )
});

const GenderSheet = forwardRef(({ genderRef } : { genderRef : any}, ref) => {
    return(
        <View>
            <GenderSheet2
                genderRef={genderRef}
            />
    </View>
    )
});

const FilterSheet = forwardRef(({ sheetRef } : { sheetRef : any}, ref) => {
    return(
        <View>
            <FilterSheet2
                sheetRef={sheetRef}
            />
        </View>
    )
});

const LanguageSheet = forwardRef(({ moresheet, setLanguage } : { moresheet : any}, ref) => {
    return(
        <View>
            <LanguageoptionSheet
                setLanguage={setLanguage}
                moresheet={moresheet}
            />
        </View>
    )
});

const NotificationSheet2 = forwardRef(({ moresheet2 } : { moresheet2 : any}, ref) => {
    return(
        <View>
            <NotificationSheet
                moresheet2={moresheet2}
            />
        </View>
    )
});

const SkipLoginSheet2 = forwardRef(({ moresheet3 } : { moresheet3 : any}, ref) => {
    return(
        <View>
            <SkipLoginSheet
                moresheet3={moresheet3}
            />
        </View>
    )
});

export default BottomSheet2