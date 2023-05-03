import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from "../../components/CustomButton/CustomButton";
import { useNavigation } from '@react-navigation/native';
import ButtonMenu from "../../components/ButtonMenu/ButtonMenu";



const CourseStatsScreen = ({route}) => {
    const {courses} = route.params;
    const {token} = route.params;
    const navigation = useNavigation();

    const onEvaluateCoursesPressed = () => {
        navigation.navigate("ChooseEvaluateCourse", {courses: courses, token: token})
    }

    const onSeeCourseStatisticsPressed = () => {
        navigation.navigate("CourseStats", {chosenCourses: courses, token: token})
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
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
            <View>

                <ButtonMenu
                    screen='courseStats'
                    token={token}
                />

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#313131',
        justifyContent: 'space-between'
    },
    buttonContainer: {
        marginTop: '25%',
        justifyContent: 'center',
        padding: 50,
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