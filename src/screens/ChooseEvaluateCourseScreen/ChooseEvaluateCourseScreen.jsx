// This is the screen were you choose which course you want to evaluate

import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { RadioButton } from 'react-native-paper';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';
import BackArrow from '../../../assets/arrowBack.png';
import Title from '../../components/Title';
import Text from '../../components/Text';


const EvaluateCourseScreen = ({ route }) => {
    const navigation = useNavigation();
    const { courses } = route.params;
    const { token } = route.params;
    const { courseIDs } = route.params;

    const [checked, setChecked] = useState('');

    const onArrowPressed = () => {
        navigation.navigate('Courses', { courses: courses, token: token, courseIDs: courseIDs })
    }
    // Check which course has been chosen, if none chosen - alert, else - navigate.
    const onEvaluateCoursePressed = () => {
        let checkedID = [];
        for (let i = 0; i < courses.length; i++) {
            if (checked === courses[i]) {
                checkedID.push(courseIDs[i])
            }
        }
        if (checked === '') {
            alert("Please choose a course to evaluate")
        } else {
            navigation.navigate('EvaluateCourse', { course: checked, courses: courses, token: token, checkedID: checkedID, courseIDs: courseIDs });
        }
    };

    return (
        <View style={styles.container}>

            <TouchableOpacity activeOpacity={0.5} style={styles.backArrow} onPress={onArrowPressed}>
                <Image
                    source={BackArrow}
                    style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
                    resizeMode="contain"
                />
            </TouchableOpacity >

            <View style={styles.options}>
                <Title style={styles.title}>Select course to evaluate</Title>

                <View>
                    {courses.map(option => (
                        <View style={styles.button} key={option}>
                            <RadioButton.Android
                                text={option}
                                value={option}
                                status={checked === option ? 'checked' : 'unchecked'}
                                onPress={() => setChecked(option)}


                            />
                            <Text style={styles.text}>{option}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.evaluateButton}>
                    <CustomButton
                        text="Evaluate course"
                        onPress={onEvaluateCoursePressed}
                    />
                </View>
            </View>


            <View>
                <ButtonMenu
                    screen="courseStats"
                    token={token}
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        backgroundColor: '#313131',
        height: '100%'
    },
    options: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        marginBottom: 40,
    },
    button: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',

    },
    text: {
        color: '#EFEFEF',
        fontWeight: 'bold',
        fontsize: 15,
    },
    evaluateButton: {
        padding: 50
    },
    backArrow: {
        width: '10%',
        padding: 10,
        marginBottom: -80
    },
})

export default EvaluateCourseScreen;