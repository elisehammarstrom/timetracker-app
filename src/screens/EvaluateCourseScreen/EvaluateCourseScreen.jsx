import {StyleSheet, View, ScrollView} from 'react-native';
import React from 'react';
import Star from '../../components/Star/Star';
import CustomRadioButton from '../../components/CustomRadioButton/CustomRadioButton';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';

const EvaluationScreen = ({route}) => {
    const {options} = route.params;
    const navigation = useNavigation();

    const onSubmitPressed = () => {
        navigation.navigate("CourseStats")
    }

    return (
        
        <View style={styles.container}>
            <ScrollView>
                <Star
                    question="Difficulty level"
                    leftText="Easy"
                    rightText="Hard"
                />

                <Star 
                    question="How rewarding has this course been?"
                    leftText="Not at all"
                    rightText="Very"
                />

                <Star  
                    question="Has this course had a reasonable workload?"
                    leftText="Not at all"
                    rightText="Fully agree"
                />

                <CustomRadioButton
                    question="Did you attend any lectures?"
                    firstOption="No"
                    secondOption="A few"
                    thirdOption="Most"
                    fourthOption="All"
                />

                <CustomRadioButton
                    question="Did you find the letures worthwhile?"
                    firstOption="Don't know"
                    secondOption="No"
                    thirdOption="Somewhat"
                    fourthOption="Very"
                />

                <CustomRadioButton
                    question="Have you done any assignments?"
                    firstOption="There was none"
                    secondOption="No"
                    thirdOption="Some"
                    fourthOption="Most"
                />

                <CustomRadioButton
                    question="Did you find the assingments worthwhile?"
                    firstOption="Don't know"
                    secondOption="No"
                    thirdOption="Somewhat"
                    fourthOption="Very"
                />

                <CustomButton
                    text="Submit"
                    onPress={onSubmitPressed}
                />

            </ScrollView>   


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



export default EvaluationScreen;