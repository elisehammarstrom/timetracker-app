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
                 {id: 1, name: "Mekanik"},
                 {id: 2, name: "Miljöteknik"},
                 {id: 3, name: "Reglerteknik"},
                 {id: 4, name: "Transformmetoder"},
                 {id: 5, name: "Envariabelanalys"},
                 {id: 6, name: "Linjär Alegebra I"},
                 
             ]}
             renderItem={ 
                 ({item}) => <Text style={styles.text}>{item.name} <CheckBoxes id ={item.name} /></Text>
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
      name: {
        backgroundColor: "blue",
        color: "white",
        padding: 2,
        margin: 2,
      },
})

export default CourseScreen