import { Styles } from "@expo/config-plugins/build/android";
import React from "react";
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { StackedBarChart } from "react-native-chart-kit";
import CustomButton from "../../components/CustomButton";
import { useState } from "react";


const YourReportsScreen = ({route}) => {
    const [legendCourses, setLegendCourses]= useState(route.params.paramKey)
    const [type, setType] = useState("SECONDARY")
    const [data, setData] = useState([])

    const courses = route.params.paramKey
    const length = courses.length

    var items = []
    var types = []
    // var barColors = []

    //Data for stacked bar chart
    var ourData = {
        labels: ['Mon', 'Tue', 'Wen', 'Thu', 'Fri'],
        legend: legendCourses,
        data: data,
        barColors: ['#66C7FD', '#5987CC', '#AC7CE4'],
    }

    //Choosing a course to see in the bar chart
    function coursePress(course) {
        if (legendCourses===courses){
            setLegendCourses([course])
            console.log(legendCourses)
            setType("PRIMARY")
            console.log(type)
        }
        else {
            setLegendCourses(route.params.paramKey)
            console.log(legendCourses)
            setType("SECONDARY")
            console.log(type)
        }
    }

    for (let i=0; i<length; i++) {
        items.push(
            <CustomButton
                text={courses[i]}
                onPress={()=>coursePress(courses[i])}
                type={types[i]}
            />
        )
    } 


    return (
        <View>
            {types}
            <StackedBarChart
                data={ourData}
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

            {/* Looping the courses to create buttons */}
            <View style={Styles.buttonContainer}>

                {items}
                {/* {courses.map(course => (
                    <CustomButton
                        text={course}
                        onPress={()=>coursePress(course)}
                        type={type}
                    />
                ))} */}
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