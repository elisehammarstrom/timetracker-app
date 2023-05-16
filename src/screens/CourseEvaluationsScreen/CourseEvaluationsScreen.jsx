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
                if (`${data}` !=`${response.data.result}`) {
                    setData(response.data.result)
                }
                // console.log(response.data.result.questionAnswerNumbers["What is your general opinion of the course?"]);
                })
                .catch(function (response) {
                //handle error
                console.log(response);
                });

        }
    }
    console.log("data= ", data)

    let starNumbers = [];
    let sum = 0;
    let avgRating = 0;
    if (Object.keys(data).length > 1) {
        starNumbers.push(data.questionAnswerNumbers["What is your general opinion of the course?"])
        for (let i=0;i<starNumbers[0].length; i++) {
            sum = sum + starNumbers[0][i]
        }
        avgRating = sum/Object.keys(data).length
    }
   
    const onArrowPressed = () => {
        navigation.navigate('Courses', {courses: courses, token: token, courseIDs: courseIDs})
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        padding: 20,
        marginBottom: 20,
        justifyContent: 'flex-start'
    },
    breadtext: {
        fontSize: 20,
        color: "#EFEFEF",
        padding: 20
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
        alignItems: 'center'
    },
    star: {
        backgroundColor: '#313131',
        // width: '50%',
        padding: 5,
        borderRadius: 5,
    }
 

});


export default CourseEvaluationsScreen;