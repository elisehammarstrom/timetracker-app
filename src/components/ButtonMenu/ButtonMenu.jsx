// Component for the buttons in the bottom of many screens

import React from "react";
import CustomButton from "../CustomButton/CustomButton";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ButtonMenu = ({options}) => {
    const navigation = useNavigation();


    //Navigation when you press each button
    const onYourReportsPress = data => {
      console.log(data)
      navigation.navigate('YourReports', {paramKey: options}) //Options is the courses youve picked
    };
  
    // const onTimetrackingPress = data => {
    //   console.log(data)
    //   navigation.navigate('Timer')
    // };
  
    const onCourseStatsPress = data => {
      console.log(data)
      navigation.navigate('Courses')
    };

    return(
        // Three buttons for "Your reports", "Timetracing/homepage" and "Course stats"
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <CustomButton 
                    text="Your reports"
                    onPress={onYourReportsPress}
                    type="SECONDARY"
                />
            </View>    

            <View style={styles.buttonContainer}>
                <CustomButton
                    text="Timetracking"
                    // onPress={onTimetrackingPress}
                />
            </View>
            <View style={styles.buttonContainer}>
                <CustomButton 
                    text="Course stats"
                    onPress={onCourseStatsPress}
                    type="SECONDARY"
                />
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      buttonContainer: {
        flex: 1,
      }
})

export default ButtonMenu