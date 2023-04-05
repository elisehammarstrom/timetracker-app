import React, {useState} from "react";
import { View, Text, CheckBox, FlatList, StyleSheet } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import CheckBoxes from "../../components/CheckBoxes";

const CourseScreen = () => {

    const onTimerPressed = () => {
        navigation.navigate('Timer');
    };
    
    const navigation = useNavigation();
    
    return (
        <View>
            <FlatList 
             data={[
                 {key: "Mekanik"},
                 {key: "Miljöteknik"},
                 {key: "Reglerteknik"},
                 {key: "Transformmetoder"},
                 {key: "Envariabelanalys"},
                 {key: "Linjär Alegebra I"},
                 
             ]}
             renderItem={ 
                 ({item}) => <Text style={styles.text}>{item.key} <CheckBoxes/> </Text>
             }
         />
            <CustomButton 
                text="Go to timer" 
                onPress={onTimerPressed}
            />

        
        </View>

        
    )
}
const styles = StyleSheet.create ({
    text: {
        flex: 1,
        fontSize: 40
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
      },
      checkbox: {
        alignSelf: 'center',
      },
      label: {
        margin: 8,
      },
})

export default CourseScreen