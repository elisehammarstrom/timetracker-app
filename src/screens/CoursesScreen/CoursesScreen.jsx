// This is the screen you get to after choosing the option 'Evaulations' on the menu
// You will choose if you want to read evaluations or if you want to add an evaluation

import React from "react";
import { View, StyleSheet } from 'react-native';
import CustomButton from "../../components/CustomButton/CustomButton";
import { useNavigation } from '@react-navigation/native';
import ButtonMenu from "../../components/ButtonMenu/ButtonMenu";
import Title from '../../components/Title';


const CourseStatsScreen = ({ route }) => {
    const { courses } = route.params;
    const { token } = route.params;
    const { courseIDs } = route.params;
    const navigation = useNavigation();

    const onEvaluateCoursesPressed = () => {
        navigation.navigate("ChooseEvaluateCourse", { courses: courses, token: token, courseIDs: courseIDs })
    }

    const onCourseEvaluationsPressed = () => {
        navigation.navigate("CourseEvaluations", { courses: courses, token: token, courseIDs: courseIDs })
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Title style={styles.title}>What do you want to do?</Title>


                <CustomButton
                    text="See course evaluations"
                    onPress={onCourseEvaluationsPressed}
                />
                <CustomButton
                    text="Evaluate courses"
                    onPress={onEvaluateCoursesPressed}
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
    container: {
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