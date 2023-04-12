import { Styles } from "@expo/config-plugins/build/android";
import React from "react";
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { StackedBarChart } from "react-native-chart-kit";
import CustomButton from "../../components/CustomButton";
import { useState } from "react";


const YourReportsScreen = ({route}) => {
    // const [courses, setCourses]= useState(route.params.paramKey)
    const [type, setType] = useState("SECONDARY")

    var courses = route.params.paramKey

    var data = {
        labels: ['Mon', 'Tue', 'Wen', 'Thu', 'Fri'],
        legend: courses,
        data: [[5, 3, 0], [3, 2, 3], [1, 2, 5], [0, 0, 8], [2, 4, 1]],
        barColors: ['#66C7FD', '#5987CC', '#AC7CE4'],
    }

    function coursePress(course) {
        if (courses===course) {
            courses = route.params.paramKey
            console.log(courses)
            setType("SECONDARY")

        }
        else {
          
            // setCourses(course)
            courses = course
            console.log(courses)
            setType("PRIMARY")
            console.log(type)

        }
        

    }
    return (
        <View>
            <StackedBarChart
                data={data}
                width={Dimensions.get('window').width - 16}
                height={220}
                chartConfig={{
                    // backgroundColor: '#1cc910',
                    // backgroundGradientFrom: '#eff3ff',
                    // backgroundGradientTo: '#efefef',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                    borderRadius: 16,
                    },
                }}
                style={styles.stackedBarChart}
            />
            <View style={Styles.buttonContainer}>
                {courses.map(course => (
                    <CustomButton
                        text={course}
                        onPress={()=>coursePress(course)}
                        type={type}
                    />
                ))}

               
            
            </View>



        </View>
    )
}

const styles = StyleSheet.create({
    stackedBarChart: {
        marginVertical: 8,
        borderRadius: 16,
    }
})

export default YourReportsScreen