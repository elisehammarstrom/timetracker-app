import {StyleSheet, View, ScrollView, Text} from 'react-native';
import React, { useState } from 'react';
import Star from '../../components/Star/Star';
import CustomRadioButton from '../../components/CustomRadioButton/CustomRadioButton';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const EvaluationScreen = ({route}) => {
    const {course} = route.params;
    const {courses} = route.params;
    const {token} = route.params;
    const {checkedID} = route.params;
    const navigation = useNavigation();
    const [questions, setQuestions] = useState('');

    // Create evaluation method
    const formData = new FormData();
    formData.append('courseID', checkedID[0])
    if (`${questions.length}` <1) {
        axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/evaluate/create_evaluation/",
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization':`token ` + token
            }
          })
            .then(function (response) {
                //handle success
                console.log(response.data);
                // if (`${questions}`.length < 1) {
                    setQuestions(response.data.array);
                    // console.log("i if-sats, questions= ", questions)
                // }
    
            })
            .catch(function (response) {
              //handle error
              console.log(response);
            });
    }
    
        if (`${questions}`.length > 1) {
            console.log("questions[0].question.question= ", questions[0].question.question)
        }
        // console.log("questions[0].question.question= ", questions[0].question.question)

    const onSubmitPressed = () => {
        navigation.navigate("ChooseEvaluateCourse", {courses: courses, token: token})
    }
    
    if (`${questions}`.length > 1) {

        return (
            
            <View style={styles.container}>
                <Text style={styles.title}> Evaluating {course} </Text>

                <ScrollView>

                    <Star
                        question={questions[0].question.question}
                        leftText="Easy"
                        rightText="Hard"
                    />

                    <CustomRadioButton
                        question="Did you attend any lectures?"
                        firstOption="No"
                        secondOption="A few"
                        thirdOption="Most"
                        fourthOption="All"
                    />

                    <CustomButton
                        text="Submit"
                        onPress={onSubmitPressed}
                    />

                </ScrollView>   


            </View>
    
        )
    }
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