import { useState } from 'react';
import React from 'react';
import {StyleSheet, View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';
import { LineChart } from 'react-native-chart-kit';
import BackArrow from '../../../assets/arrowBack.png';
import axios from 'axios';

const CourseStatsScreen = ({route}) =>{

    const {chosenCourses} = route.params;
    const {token} = route.params;
    const {courseIDs} = route.params;

    const navigation = useNavigation();
    const [selected, setSelected] = useState("");
    const legend = ["Your time", "Average time"];
    const [courseData, setCourseData] = useState('');
    let fetchedCourseData = [];
    const [label, setLabel] = useState('');
    const [data, setData] = useState('');

    for (let i=0; i<courseIDs.length; i++) {
        axios({
            method: "get",
            url: "http://127.0.0.1:8000/api/courses/" + `${courseIDs[i]}` + '/',
            headers: {
            'Authorization':`token ` + token
            }
        })
            .then(function (response) {
            //handle success
            // console.log(response.data);
            fetchedCourseData.push(response.data)
            if (courseData.length < courseIDs.length) {
                setCourseData(fetchedCourseData)
            }
            })
            .catch(function (response) {
            //handle error
            console.log(response);
            });
    }
    

if (courseData.length >1) {
// console.log("courseData= ", courseData)

    for (let i=0; i<courseData.length; i++) {
        // console.log('selected= ', selected)
        // console.log('courseData[i].courseTitle= ',courseData[i].courseTitle )
        if (selected === courseData[i].courseTitle) {
            const formData = new FormData();
            formData.append('courseID', courseData[i].id);

            axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/tracking/get_user_timetracked_per_week/",
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization':`token ` + token
            }
            })
            .then(function (response) {
                //handle success
                console.log(response.data);
                let newData = response.data.results;
                let weeks = [];
                let avgDuration = [];
                for (let i=0; i<newData.length; i++){
                    weeks.push(newData[i].weekNo)
                    avgDuration.push(newData[i].avgDuration)
                }

                if (`${label}` != `${weeks}`) {
                    setLabel(weeks)
                    setData(avgDuration)
                }
                console.log(data)
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
        }
      }
}
    const [dataGraph, setDataGraph] = useState({
        labels: [],
        datasets: [
            {
            data: [0, 0, 0, 0, 0, 0, 0],
            color: (opacity = 1) => `transparent`, // optional
            strokeWidth: 2 // optional
            },
            {
            data: [0, 0, 0, 0, 0, 0, 0],
            color: (opacity = 1) => `transparent`, // optional
            strokeWidth: 2 // optional
            }
        ],
        // legend: ["Your time", "Average time"] // optional
        });
    if (label.length > 1 & data.length > 1 & dataGraph.labels != label) {
        setDataGraph({
            labels: label,
            datasets: [
                {
                data: data,
                color: (opacity = 1) => `transparent`, // optional
                strokeWidth: 2 // optional
                },
                {
                data: [0, 0, 0, 0, 0, 0, 0],
                color: (opacity = 1) => `transparent`, // optional
                strokeWidth: 2 // optional
                }
            ],
            // legend: ["Your time", "Average time"] // optional
            })
    }



    const screenWidth = Dimensions.get("window").width;
    const chartConfig = {
        backgroundGradientFrom: "#313131",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#313131",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(239, 239, 239, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false, // optional
    };

    let courses = [];
    const length = chosenCourses.length;
    const [avgTime, setAvgTime] = useState('');
    const [time, setTime] = useState('');


    // for (let i=0; i<length; i++) {

    //     courses.push( 
    //         { course: `${chosenCourses[i]}`, data: 
    //             {
    //                 labels: ["Mon", "Tue", "Wen", "Thu", "Fri", "Sat", "Sun"],
    //                 datasets: [
    //                     {
    //                     data: [2, 1, 2, 3, 4, 0, 0],
    //                     color: (opacity = 1) => `#AC7CE4`, // optional
    //                     strokeWidth: 2 // optional
    //                     },
    //                     {
    //                     data: [2, 2, 0, 2, 1, 1, 1],
    //                     color: (opacity = 1) => `#5987CC`, // optional
    //                     strokeWidth: 2 // optional
    //                     }
    //                 ],
    //                 legend: legend // optional
    //             }
    //         },
    //     );
    //     if (selected === chosenCourses[i]) {
    //         if (time != "...your time"){
    //             setAvgTime("...avg time")
    //             setTime("...your time")
    //         }
    //     }
    // }



    const onReadCourseEvaluationsPressed = () => {
        navigation.navigate('CourseEvaluations', {course: selected, courses: chosenCourses, token: token})
    }

    const onArrowPressed = () => {
        navigation.navigate('ChooseReport', {token: token, courseIDs: courseIDs})
      }

    // const onSelectListPressed = () => {
        
    //     for (let i=0; i<length; i++) {
    //         if (selected === courses[i].course) {
    //             setDataGraph(courses[i].data)
    //         }
    //     }

    // }


    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.5} style={styles.backArrow} onPress={onArrowPressed}>
                <Image 
                    source={BackArrow} 
                    style={[{height: 100 * 0.3}, {width: 100 * 0.3}]} 
                    resizeMode="contain"
                />
            </TouchableOpacity >

            <View style={styles.selectListContainer}>

                <SelectList
                    dropdownTextStyles={styles.selectList}
                    inputStyles={styles.selectList}
                    boxStyles={styles.boxStyles}
                    setSelected={(val) => setSelected(val)}
                    // onSelect={onSelectListPressed}
                    data={chosenCourses}
                    save="value"
                    search={false}
                    placeholder='Choose course to see statistics'
                    
                />

            </View>

            <View style={styles.header}>
                
                    <Text style={styles.title}>{selected}</Text>
                
            </View>

            <View>
                <LineChart
                    data={dataGraph}
                    width={screenWidth}
                    height={220}
                    chartConfig={chartConfig}
                    withDots={false}
                    fromZero={true}
                />
            </View>
            

            <View style={styles.timeContainer}>

                <View style={[styles.time, styles.yourTime]}>
                    <View>
                        <Text style={{fontWeight: 'bold'}}>Your time:</Text>

                    </View>
                    <View> 
                        <Text style={{fontWeight: 'bold'}}> {time} </Text> 

                    </View>

                </View>  

                <View style={[styles.time, styles.averageTime]}>
                    <Text style={{fontWeight: 'bold'}}>Average time:</Text>
                    <Text style={{fontWeight: 'bold'}}> {avgTime} </Text> 
                </View> 

                <View style={styles.evaluationButton}>
                    <CustomButton
                        text="Read course evaluations"
                        onPress={onReadCourseEvaluationsPressed}
                    />
                </View>

            </View>

            <View style={styles.ButtonMenu}>
                <ButtonMenu
                    screen="courseStats"
                    token={token}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#313131',
        height: '100%',
        justifyContent: 'space-between',
    },
    selectListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '3%',
    },
    selectList: {
        fontWeight: 'bold',
        color: '#EFEFEF',
    },
    boxStyles: {
        width: 0.9 * Dimensions.get('window').width,
    },
    header: {
        overflowWrap: 'break-word',
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        justifyContent: 'centers',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
        marginBottom: 50,
        justifyContent: 'flex-start',
        overflowWrap: 'break-word',

    },
    dateButton: {
        marginRight: '2%',
    },
    timeContainer: {
        alignItems: 'center',
    },
    time: {
        width: '90%',
        height: 0.1 * Dimensions.get('window').height,
        justifyContent: 'space-between',
        paddingLeft: '5%',
        margin: 4,
        flexDirection: 'row',
        alignItems: 'center'
    },
    yourTime: {
        backgroundColor:'#AC7CE4'
    },
    averageTime: {
        backgroundColor: '#5987CC'
    },
    evaluationButton: {
        width: 0.6 * Dimensions.get('window').width,
        justifyContent: 'center',
    },
    backArrow: {
        width: '10%',
        padding: 10
    },
})

export default CourseStatsScreen;