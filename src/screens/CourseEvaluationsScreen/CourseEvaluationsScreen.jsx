// On this screen you can see the evaluations of the courses you have picked.

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';
import BackArrow from '../../../assets/arrowBack.png';
import { useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import axios from 'axios';
import Noll from '../../../assets/transparent.png';
import Ett from '../../../assets/ett.png';
import Två from '../../../assets/2.png';
import Tre from '../../../assets/3.png';
import Fyra from '../../../assets/4.png';
import Fem from '../../../assets/5.png';
import Title from '../../components/Title';
import Text from '../../components/Text';

const CourseEvaluationsScreen = ({ route }) => {
    const { course } = route.params;
    const { courses } = route.params;
    const { token } = route.params;
    const { courseIDs } = route.params;

    const navigation = useNavigation();

    const [selected, setSelected] = useState("");
    const [data, setData] = useState("");
    const smileys = [Noll, Ett, Två, Tre, Fyra, Fem];
    const [stress, setStress] = useState(0);

    // Depending on what course you pick in the dropdown list
    for (let i = 0; i < courses.length; i++) {
        if (selected === courses[i]) {
            const formData = new FormData();
            formData.append('courseID', courseIDs[i]);

            // Post the chosen courses to the database
            axios({
                method: "post",
                url: "http://127.0.0.1:8000/api/evaluate/get_course_statistics/",
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `token ` + token
                }
            })
                .then(function (response) {
                    //handle success
                    // We set data to the data (of statistics) we got from the database. 
                    // To avoid an infinite loop we only set it once by using an if statement
                    if (`${data.courseID}` != `${response.data.result.courseID}`) {
                        setData(response.data.result)
                    }
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                });

            // Get the average stress for the whole course
            axios({
                method: "post",
                url: "http://127.0.0.1:8000/api/tracking/get_stress_period_all/",
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `token ` + token
                }
            })
                .then(function (response) {
                    //handle success
                    if (stress != response.data.avg_stress) {
                        if (response.data.avg_stress != undefined) {
                            setStress(Math.round(response.data.avg_stress))
                        } else {
                            setStress(0)
                        }
                    }
                    console.log("stress= ", stress)
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                });

        }
    }

    const onArrowPressed = () => {
        navigation.navigate('Courses', { courses: courses, token: token, courseIDs: courseIDs })
    }
    // We want the average of stars from the evaluations. From the data we get how many who gave 1 star, 2 stars etc.
    let starNumbers = [];
    let sum = 0;
    let numberOfRatings = 0.1;
    let avgRating = 0;
    let questionPercentages = [];
    if (Object.keys(data).length > 1) {
        // starNumbers is an array with the statistics for the first question in the evaluations, i.e. the one where you fill in stars
        starNumbers.push(data.questionAnswerNumbers["What is your general opinion of the course?"])
        for (let i = 1; i <= Object.keys(starNumbers[0]).length; i++) {
            // To the sum we add i*starNumber[0][i], which means that a 1-star rating gets the value of 1, a 2-star rating the value of 2...
            sum = sum + i * starNumbers[0][i]
            numberOfRatings = numberOfRatings + starNumbers[0][i]
        }
        // The average rating is the sum divided by the number of ratings.
        avgRating = sum / numberOfRatings;

        // We push the percentages who chose answers 4 and 5 on the evaluation to an array, these are for all questions to most positive answers.
        // We also push a text to be displayed for each question (this could be made much more efficient if we had more time)
        questionPercentages.push({ percentage: Math.round(data.questionAnswerPercentages["Does this course have a reasonable workload?"][4] + data.questionAnswerPercentages["Does this course have a reasonable workload?"][5]), text: " felt the course had a reasonable workload." });
        questionPercentages.push({ percentage: Math.round(data.questionAnswerPercentages["If you’ve been to any lectures, were they worth it?"][4] + data.questionAnswerPercentages["If you’ve been to any lectures, were they worth it?"][5]), text: " felt the lectures were worth attending." });
        questionPercentages.push({ percentage: Math.round(data.questionAnswerPercentages["If you’ve been to any lesson, were they worth it?"][4] + data.questionAnswerPercentages["If you’ve been to any lesson, were they worth it?"][5]), text: " felt the lessons were worth attending." });
        questionPercentages.push({ percentage: Math.round(data.questionAnswerPercentages["If you’ve done any assignments, were they worth it?"][4] + data.questionAnswerPercentages["If you’ve done any assignments, were they worth it?"][5]), text: " felt the assignments were worth doing." });
        questionPercentages.push({ percentage: Math.round(data.questionAnswerPercentages["Was this course difficult?"][4] + data.questionAnswerPercentages["Was this course difficult?"][5]), text: " felt the course was not too difficult." });
        questionPercentages.push({ percentage: Math.round(data.questionAnswerPercentages["Was this course stressful in general?"][4] + data.questionAnswerPercentages["Was this course stressful in general?"][5]), text: " felt the course was not too stressful." });
    }

    return (
        <View style={styles.container}>
            <View style={{ justifyContent: 'flex-start' }}>
                <View style={styles.topContainer}>

                    <TouchableOpacity activeOpacity={0.5} style={styles.backArrow} onPress={onArrowPressed}>
                        <Image
                            source={BackArrow}
                            style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
                            resizeMode="contain"
                        />
                    </TouchableOpacity >
                    <Title style={styles.firstTitle}>Course Evaluations</Title>
                </View>


                <View style={styles.selectListContainer}>
                    <SelectList
                        dropdownTextStyles={styles.selectList}
                        inputStyles={styles.selectList}
                        boxStyles={styles.boxStyles}
                        setSelected={(val) => setSelected(val)}
                        data={courses}
                        save="value"
                        search={false}
                        placeholder='Choose course to see evaluations'
                        defaultOption={{ key: course, value: course }}
                        dropdownStyles={styles.dropDown}
                    />

                </View>

                <View style={styles.stats}>
                    <ScrollView>
                        <View style={styles.star}>
                            {/* The stars are displayed here */}
                            <Rating
                                fractions="{1}"
                                startingValue={avgRating}
                                readonly="{true}"
                                style={{ backgroundColor: '#313131' }}
                                tintColor='#313131'
                                imageSize={55}
                            />
                        </View>

                        {/* We loop/map the array with percentages and text to render them here */}
                        {questionPercentages.map(option => (
                            <View style={styles.resultContainer}>
                                <Text key={option.text} style={styles.results}>
                                    {option.percentage} % {option.text}
                                </Text>
                            </View>

                        ))}

                        {stress != 0 ?
                            <View style={styles.stress}>
                                <Text style={styles.results}>
                                    This is how stressed the average student felt:
                                </Text>
                                <Image
                                    source={smileys[stress]}
                                    style={[{ height: 150 * 0.4 }, { width: 150 * 0.4 }, { marginTop: 10 }]}
                                    resizeMode="contain"
                                />
                            </View>

                            : null}

                    </ScrollView>

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
        backgroundColor: '#313131',
        height: '100%',
        justifyContent: 'space-between'
    },
    selectListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectList: {
        fontWeight: 'bold',
        color: '#EFEFEF',
    },
    boxStyles: {
        width: 0.75 * Dimensions.get('window').width,
        backgroundColor: '#0376C2'
    },
    backArrow: {
        width: '10%',
        padding: 10,
        flex: 0.5
    },
    dropDown: {
        width: 0.75 * Dimensions.get('window').width,
        backgroundColor: '#0376C2'
    },
    firstTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        padding: 10,
        flex: 2.5

    },
    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40
    },
    stats: {
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    star: {
        backgroundColor: '#313131',
        padding: 5,
        borderRadius: 5,
    },
    results: {
        color: '#EFEFEF',
        fontSize: 18,
    },
    stress: {
        alignItems: 'center',
        marginTop: 10
    },
    resultContainer: {
        padding: 10
    }


});


export default CourseEvaluationsScreen;