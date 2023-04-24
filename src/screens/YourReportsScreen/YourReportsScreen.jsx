import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { StackedBarChart } from "react-native-chart-kit";
import CustomButton from '../../components/CustomButton/CustomButton';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';
import Navigation from '../../navigation';
import { useNavigation } from '@react-navigation/native';


const YourReportsScreen = ({route}) => {
  console.log("route.params=", route.params)

  var date = new Date().getDate();
  var createLabels = [];
  for (let i=0; i<7; i++) {
    createLabels.push(date+i)
  }
  const [labels, setLabels] = useState(createLabels)

  if (route.params !== undefined) {
    console.log("route.params=", route.params)
    const {firstDate} = route.params;
    const {lastDate} = route.params;
    let newLabels = [];
    for (let i=firstDate.day; i<=lastDate.day; i++) {
      newLabels.push(i)
      
    }
    console.log("newlabels=", newLabels)
    if (`${labels}` != `${newLabels}`) {
      setLabels(newLabels)
    }

  }
    


  console.log("labels=", labels)



    
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const chartConfig = {
      backgroundGradientFrom: "#313131",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#313131",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(239, 239, 239, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false // optional
    };
  
  const courses = ["Mekanik", "Reglerteknik", "Envariabelanalys"]; 
  const colorsConst = ['#66C7FD', '#5987CC', '#AC7CE4', '#FFB5E2', '#FFA9A3', '#FFC977'];
  // const weakColorsConst = ['rgba(102, 199, 253, 0.5)','rgba(89, 135, 204, 0.5)','rgba(172, 124, 228, 0.5)', 'rgba(255, 181, 226, 0.5)','rgba(255, 169, 163, 0.5)','rgba(255, 201, 119, 0.5)' ];
  const testTime = [[6,3,0,1,0], [1,3,2,2,4], [1,1,4,5,0]];

  const [legend, setLegend] = useState(["Mekanik", "Reglerteknik", "Envariabelanalys"]);
  const [colors, setColors] = useState(['#66C7FD', '#5987CC', '#AC7CE4', '#FFB5E2', '#FFA9A3', '#FFC977']);
  
  var time = [];
  var timeCourses = [];

  const [timeVar, setTimeVar] = useState(time)

  for (let i=0; i<courses.length; i++) {
    timeCourses.push({course: courses[i], time: testTime[i]})
  };
  
  for (let i=0; i<testTime[0].length; i++) {

    time.push([testTime[0][i], testTime[1][i], testTime[2][i]])
    
  };

  const data = {
    labels: labels,
    legend: legend,
    data: timeVar,
    barColors: colors
  };

  const onCoursePressed = (course) => {
    for (let i=0; i<timeCourses.length; i++) {
      if (legend.length === 1 & legend[0] === course) {
        setLegend(courses)
        setColors(colorsConst)
        setTimeVar(time)
      }
      
      else if (course === timeCourses[i].course & legend.length != 1){
        setLegend([timeCourses[i].course])
        setColors([colors[i]])
        var timeChange = []
        for (let j=0;j<timeCourses[i].time.length; j++){
          timeChange.push([timeCourses[i].time[j]])
        }
        setTimeVar(timeChange)  
      }
    }
  };

  const onDatePressed = () => {
    navigation.navigate('Calendar')
  }
    return (
        <View style={styles.container}>
          
            <View style={styles.header}>
                
                <View>
                    <Text style={styles.title}>Your reports</Text>
                </View>

                <View style={styles.dateButton}>
                    <CustomButton
                        text="Select dates"
                        onPress={onDatePressed}

                    />
                </View>

            </View>

            <View>
              <StackedBarChart
                // style={graphStyle}
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
              />
            </View>

            <View style={styles.dataContainer}>
              <View style={styles.data}>
                <Text style={styles.dataText}>Course</Text>
                <Text style={styles.dataText}>Time</Text>
              </View>
              
              {courses.map((course,i) => (
                <TouchableOpacity style={[styles.colors, {backgroundColor: colorsConst[i]}]} key={course} onPress={() => onCoursePressed(course)}>
                  <Text style={{fontWeight: 'bold'}}>{course}</Text>
                </TouchableOpacity> 
              ))}
               
            </View>

            <View>
              <ButtonMenu
                screen="yourReports"
              />
            </View>
            
        </View>
    )
};

const styles=StyleSheet.create({
  container: {
      backgroundColor: '#313131',
      height: '100%',
      justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#EFEFEF',
      margin: 10,
      justifyContent: 'flex-start'
  },
  dateButton: {
      marginRight: '2%',
  },
  colors: {
    width: '90%',
    height: 0.1 * Dimensions.get('window').height,
    justifyContent: 'center',
    paddingLeft: '5%',
    margin: 4,
  },
  dataContainer: {
    alignItems: 'center',
  },
  dataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EFEFEF',
  },
  data: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%'
  },
})

export default YourReportsScreen;