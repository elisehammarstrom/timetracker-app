import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from "../../components/CustomButton/CustomButton";
import { useNavigation } from '@react-navigation/native';



const CourseStatsScreen = () => {
    const navigation = useNavigation();

    const onEvaluateCoursesPressed = () => {
        console.log("Evaluate courses")
        navigation.navigate("EvaluateCourse")
    }

    const onSeeCourseStatisticsPressed = () => {
        console.log("See course statistics")
        // navigation.navigate("")
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>What do you want to do?</Text>

            <CustomButton
                text="Evaluate courses"
                onPress={onEvaluateCoursesPressed}
            />

            <CustomButton
                text="See course statistics"
                onPress={onSeeCourseStatisticsPressed}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
        backgroundColor: '#313131',
        height: '100%'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
        marginBottom: 50,

    },
})

export default CourseStatsScreen