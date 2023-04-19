import { useState } from 'react';
import React from 'react';
import {StyleSheet, View, Text, Dimensions } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import CustomButton from '../../components/CustomButton/CustomButton';
import { useNavigation } from '@react-navigation/native';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';
import { LineChart } from 'react-native-chart-kit';

const CourseStatsScreen = () =>{
    const navigation = useNavigation();
    const [selected, setSelected] = useState("");
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

    const courses = [ 
        { course: 'Mekanik', data:
        {
            labels: ["Mon", "Tue", "Wen", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                data: [20, 45, 28, 80, 99, 43, 45],
                color: (opacity = 1) => `#AC7CE4`, // optional
                strokeWidth: 2 // optional
                },
                {
                data: [27, 40, 50, 70, 66, 12, 23],
                color: (opacity = 1) => `#5987CC`, // optional
                strokeWidth: 2 // optional
                }
            ],
            legend: ["Your time", "Average time"] // optional
            }
        },
        { course: 'Reglerteknik', data:
        {
            labels: ["Mon", "Tue", "Wen", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                data: [2, 5, 2, 0, 9, 3, 5],
                color: (opacity = 1) => `#AC7CE4`, // optional
                strokeWidth: 2 // optional
                },
                {
                data: [7, 4, 5, 7, 6, 2, 3],
                color: (opacity = 1) => `#5987CC`, // optional
                strokeWidth: 2 // optional
                }
            ],
            legend: ["Your time", "Average time"] // optional
            }
        },
        { course: 'Envariabelanalys', data:
        {
            labels: ["Mon", "Tue", "Wen", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                data: [20, 45, 28, 80, 99, 43, 45],
                color: (opacity = 1) => `#AC7CE4`, // optional
                strokeWidth: 2 // optional
                },
                {
                data: [27, 40, 50, 70, 66, 12, 23],
                color: (opacity = 1) => `#5987CC`, // optional
                strokeWidth: 2 // optional
                }
            ],
            legend: ["Your time", "Average time"] // optional
            }
        },
    ] ;

    const data = [
        {key:'1', value:'Mekanik'},
        {key:'2', value:'Reglerteknik'},
        {key:'3', value:'Envariabelanalys'}
    ]

    const length = data.length;

    const onReadCourseEvaluationsPressed = () => {
        navigation.navigate('CourseEvaluations', {course: selected})
    }

    const onSelectListPressed = () => {
        console.log(selected)

        console.log(courses[1].course)
        
        for (let i=0; i<length; i++) {
            if (selected === courses[i].course) {
                setDataGraph(courses[i].data)
            }
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
                    data={data}
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
                        text="Select date"
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
                />
            </View>
            

            <View style={styles.timeContainer}>

                <View style={[styles.time, styles.yourTime]}>
                    <Text style={{fontWeight: 'bold'}}>Your time:</Text>
                </View>  

                <View style={[styles.time, styles.averageTime]}>
                    <Text style={{fontWeight: 'bold'}}>Average time:</Text>
                </View> 

                <View style={styles.evaluationButton}>
                    <CustomButton
                        text="Read course evaluations"
                        onPress={onReadCourseEvaluationsPressed}
                    />
                </View>

            </View>

            <View>
                <ButtonMenu
                    screen="courseStats"
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
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
        marginBottom: 50,
        justifyContent: 'flex-start'
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
        justifyContent: 'center',
        paddingLeft: '5%',
        margin: 4,
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
    }
})

export default CourseStatsScreen;