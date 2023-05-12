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
    const {courseIDs} = route.params;

    const navigation = useNavigation();
    const [questions, setQuestions] = useState('');
    const [submit, setSubmit] = useState('');

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
                setQuestions(response.data.array);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            //   alert('You have already evaluated this course')
            //     navigation.navigate("ChooseEvaluateCourse", {courses: courses, token: token, courseIDs: courseIDs})
            });
    }
    

    const onSubmitPressed = () => {
        setSubmit(true)
        // navigation.navigate("ChooseEvaluateCourse", {courses: courses, token: token, courseIDs: courseIDs})
        

    }
    
    if (`${questions}`.length > 1) {

        return (
            
            <View style={styles.container}>
                <Text style={styles.title}> Evaluating {course} </Text>

                <ScrollView>

                    <Star
                        token={token}

                        question={questions[0].question.question}
                        answerID={questions[0].answer.id}
                        submit={submit}
                    />

                    <CustomRadioButton
                        token={token}

                        question={questions[1].question.question}
                        answerID={questions[1].answer.id}
                        submit={submit}

                        firstOption="Don't know"
                        secondOption="No"
                        thirdOption="Somehwat"
                        fourthOption="A bit"
                        fifthOption="Yes"
                    />

                    <CustomRadioButton
                        token={token}

                        question={questions[2].question.question}
                        answerID={questions[2].answer.id}
                        submit={submit}

                        firstOption="Don't know"
                        secondOption="No"
                        thirdOption="Not really"
                        fourthOption="Somewhat"
                        fifthOption="Yes"
                    />

                    <CustomRadioButton
                        token={token}

                        question={questions[3].question.question}
                        answerID={questions[3].answer.id}
                        submit={submit}

                        firstOption="Don't know"
                        secondOption="No"
                        thirdOption="Somewhat"
                        fourthOption="A bit"
                        fifthOption="Yes"
                    />

                    <CustomRadioButton
                        token={token}

                        question={questions[4].question.question}
                        answerID={questions[4].answer.id}
                        submit={submit}

                        firstOption="Don't know"
                        secondOption="No"
                        thirdOption="Somewhat"
                        fourthOption="A bit"
                        fifthOption="Yes"
                    />

                    <CustomRadioButton
                        token={token}

                        question={questions[5].question.question}
                        answerID={questions[5].answer.id}
                        submit={submit}

                        firstOption="Don't know"
                        secondOption="No"
                        thirdOption="Somewhat"
                        fourthOption="A bit"
                        fifthOption="Yes"
                    />

                    <CustomRadioButton
                        token={token}

                        question={questions[6].question.question}
                        answerID={questions[6].answer.id}
                        submit={submit}

                        firstOption="Don't know"
                        secondOption="No"
                        thirdOption="Somewhat"
                        fourthOption="A bit"
                        fifthOption="Yes"
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
        padding: 10,
        backgroundColor: '#313131',
        height: '100%',
        maxWidth: '100%'
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