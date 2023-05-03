import { useState } from 'react';
import React from 'react';
import {StyleSheet, View, Text, Dimensions } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';
import { LineChart } from 'react-native-chart-kit';

const CourseStatsScreen = ({route}) =>{

    const {chosenCourses} = route.params;
    const {token} = route.params;

    const navigation = useNavigation();
    const [selected, setSelected] = useState("");
    const legend = ["Your time", "Average time"];
    const [dataGraph, setDataGraph] = useState({
        labels: ["Mon", "Tue", "Wen", "Thu", "Fri", "Sat", "Sun"],
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


    for (let i=0; i<length; i++) {

        courses.push( 
            { course: `${chosenCourses[i]}`, data: 
                {
                    labels: ["Mon", "Tue", "Wen", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [
                        {
                        data: [2, 1, 2, 3, 4, 0, 0],
                        color: (opacity = 1) => `#AC7CE4`, // optional
                        strokeWidth: 2 // optional
                        },
                        {
                        data: [2, 2, 0, 2, 1, 1, 1],
                        color: (opacity = 1) => `#5987CC`, // optional
                        strokeWidth: 2 // optional
                        }
                    ],
                    legend: legend // optional
                }
            },
        );
        if (selected === chosenCourses[i]) {
            if (time != "...your time"){
                setAvgTime("...avg time")
                setTime("...your time")
            }
        }
    }



    const onReadCourseEvaluationsPressed = () => {
        navigation.navigate('CourseEvaluations', {course: selected, courses: chosenCourses})
    }

    const onSelectListPressed = () => {
        
        for (let i=0; i<length; i++) {
            if (selected === courses[i].course) {
                setDataGraph(courses[i].data)
            }
        }

    }

   

    if (selected === "Mekanik") {
        if (time != "12h"){
            setAvgTime("9h")
            setTime('12h')
        }
    }
    if (selected === "Miljöteknik") {
        if (time != "15h"){
            setAvgTime("12h")
            setTime('15h')
        }
    }
    if (selected === "Envariabelanalys") {
        if (time != "8h"){
            setAvgTime("10h")
            setTime('8h')
        }
    }

    return (
        <View style={styles.container}>

            <View style={styles.selectListContainer}>

                <SelectList
                    dropdownTextStyles={styles.selectList}
                    inputStyles={styles.selectList}
                    boxStyles={styles.boxStyles}
                    setSelected={(val) => setSelected(val)}
                    onSelect={onSelectListPressed}
                    data={chosenCourses}
                    save="value"
                    search={false}
                    placeholder='Choose course to see statistics'
                    
                />

            </View>

            <View style={styles.header}>
                
                <View>

                    <Text style={styles.title}>{selected}</Text>
                    
                </View>

                <View style={styles.dateButton}>

                    <CustomButton
                        text="Select week"
                    />

                </View>
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
        justifyContent: 'space-between',
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
})

export default CourseStatsScreen;