import React, {useState} from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';
import BackArrow from '../../../assets/arrowBack.png';
import { useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import axios from 'axios';


const CourseEvaluationsScreen = ({route}) => {
    const {course} = route.params;
    const {courses} = route.params;
    const {token} = route.params;
    const {courseIDs} = route.params;

    const navigation = useNavigation();

    const [selected, setSelected] = useState("");
    const [data, setData] = useState("");

    for (let i=0; i<courses.length; i++) {
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
                'Authorization':`token ` + token
                }
            })
                .then(function (response) {
                //handle success
                console.log("data= ", data)
                console.log("responase.dta.raesltk= ", response.data.result)
                if (`${data.courseID}` !=`${response.data.result.courseID}`) {
                    console.log("HEJ")
                    setData(response.data.result)
                }
                })
                .catch(function (response) {
                //handle error
                console.log(response);
                });

        }
    }
  
    const onArrowPressed = () => {
        navigation.navigate('Courses', {courses: courses, token: token, courseIDs: courseIDs})
      }

    let starNumbers = [];
    let sum = 0;
    let numberOfRatings = 0;
    let avgRating = 0;
    let questionPercentages = [];
    if (Object.keys(data).length > 1) {
        starNumbers.push(data.questionAnswerNumbers["What is your general opinion of the course?"])
        console.log("starnumberslengt= ", Object.keys(starNumbers[0]).length)
        for (let i=1;i<=Object.keys(starNumbers[0]).length; i++) {
            console.log("starNumbers= ", starNumbers)
            sum = sum + i*starNumbers[0][i]
            numberOfRatings = numberOfRatings + starNumbers[0][i]
        }
        console.log("sum= ", sum)
        console.log("numberofRatings= ", numberOfRatings)

        avgRating = sum/numberOfRatings;

        // console.log("avgRating =", avgRating)
        questionPercentages.push({percentage: Math.round(data.questionAnswerPercentages["Does this course have a reasonable workload?"][4] + data.questionAnswerPercentages["Does this course have a reasonable workload?"][5]) , text: " felt the course had a reasonable workload."});
        questionPercentages.push({percentage: Math.round(data.questionAnswerPercentages["If you’ve been to any lectures, were they worth it?"][4] + data.questionAnswerPercentages["If you’ve been to any lectures, were they worth it?"][5]) , text: " felt the lectures were worth attending."});
        questionPercentages.push({percentage: Math.round(data.questionAnswerPercentages["If you’ve been to any lesson, were they worth it?"][4] + data.questionAnswerPercentages["If you’ve been to any lesson, were they worth it?"][5]) , text: " felt the lessons were worth attending."});
        questionPercentages.push({percentage: Math.round(data.questionAnswerPercentages["If you’ve done any assignments, were they worth it?"][4] + data.questionAnswerPercentages["If you’ve done any assignments, were they worth it?"][5]) , text: " felt the assignments were worth doing."});
        questionPercentages.push({percentage: Math.round(data.questionAnswerPercentages["Was this course difficult?"][4] + data.questionAnswerPercentages["Was this course difficult?"][5]) , text: " felt the course was not too difficult."});
        questionPercentages.push({percentage: Math.round(data.questionAnswerPercentages["Was this course stressful in general?"][4] + data.questionAnswerPercentages["Was this course stressful in general?"][5]) , text: " felt the course was not too stressful."});

        console.log(questionPercentages)
        
    }

 

    return (
        <View style={styles.container}>
             <View style={{justifyContent: 'flex-start'}}>
            <View style={styles.topContainer}>
        
            <TouchableOpacity activeOpacity={0.5} style={styles.backArrow} onPress={onArrowPressed}>
                <Image 
                    source={BackArrow} 
                    style={[{height: 100 * 0.3}, {width: 100 * 0.3}]} 
                    resizeMode="contain"
                />
            </TouchableOpacity >
            <Text style={styles.firstTitle}>Course Evaluations</Text>
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
                        <Rating 
                            fractions="{1}" 
                            startingValue={avgRating} 
                            readonly="{true}"
                            style={{backgroundColor: '#313131'}} 
                            tintColor='#313131'
                        />
                    </View>
                    {questionPercentages.map(option => (
                        <Text key={option.text} style={styles.results}>
                            {option.percentage} % {option.text}
                        </Text>
                    ))}
                    


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
        // marginTop: 40,
        alignItems: 'center',
    },
    star: {
        backgroundColor: '#313131',
        // width: '50%',
        padding: 5,
        borderRadius: 5,
    },
    results: {
        // fontWeight: 'bold',
        color: '#EFEFEF',
        fontSize: 15,

    }
 

});


export default CourseEvaluationsScreen;