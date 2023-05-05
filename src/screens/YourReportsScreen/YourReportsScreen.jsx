import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { StackedBarChart } from "react-native-chart-kit";
import CustomButton from '../../components/CustomButton/CustomButton';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


const YourReportsScreen = ({route}) => {
  const {token} = route.params;
  const {firstDate} = route.params;
  const {lastDate} = route.params;

  const [initialLabels, setInitialLabels] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const fetchedCourses = [];
  const fetchedTimeStudied = [];
  const [courses, setCourses] = useState([]);
  const [timeStudied, setTimeStudied] = useState([]);
  const [state, setState] = useState('');


  //Fetching the first dates for the graph 
  axios.get('http://127.0.0.1:8000/api/tracking/get_dates_in_week/', {
    headers: {
      'Authorization': `token ` + token
    }
  })
  .then((res) => {
    if (initialLabels.length < 1 ) {
      setInitialLabels(res.data.dates)
      setStartDate(`${res.data.startDate}`);
      setEndDate(`${res.data.endDate}`);
    }
  })
  .catch((error) => {
    console.error(error)
  })

  // If you have selected dates from the calendar the dates of the graph will change
  if (firstDate) {
    if (startDate !== firstDate.dateString) {
      setStartDate(firstDate.dateString)
      setEndDate(lastDate.dateString)
    }
  }
  if (firstDate) {
    let newLabels = [];

    for (let i=firstDate.day; i<=lastDate.day; i++) {
      newLabels.push(i + '/' + firstDate.month) 
    }
    if (`${initialLabels}` != `${newLabels}`) {
      setInitialLabels(newLabels)
    }
  }
  
  //Fetching the users study time on each course for the dates you have picked
  const formData = new FormData();
  formData.append('startDate', startDate)
  formData.append('endDate', endDate)
  
  if (startDate) {
    axios({
      method: "post",
      url: "http://127.0.0.1:8000/api/tracking/get_user_course_study_time/",
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `token ` + token
      }
    })
    .then((res) => {
      for (let i=0; i<res.data.results.length; i++) {
        fetchedTimeStudied.push(res.data.results[i].timeStudied)
        fetchedCourses.push(res.data.results[i].Course)
      }
      if (`${fetchedTimeStudied}` != `${timeStudied}` ){
        setCourses(fetchedCourses);
        setTimeStudied(fetchedTimeStudied);
      }  
    })
    .catch((error) => {
      console.error(error)
    })
  }
  
  
  // Specifics for the graph 
  const fakeTime = ["10h", "12h", "11h"]
  const screenWidth = Dimensions.get("window").width;
  const chartConfig = {
      decimalPlaces: 0,
      backgroundGradientFrom: "#313131",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#313131",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(239, 239, 239, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
  };

  // Colors for the graph and for the boxes
  const colorsConst = ['#66C7FD', '#5987CC', '#AC7CE4', '#FFB5E2', '#FFA9A3', '#FFC977'];
  const [colors, setColors] = useState(['#66C7FD', '#5987CC', '#AC7CE4', '#FFB5E2', '#FFA9A3', '#FFC977']);
  const [legend, setLegend] = useState(courses);

  var time = [];
  var timeCourses = [];

  // Get the right format for the timeStudied to fit in to the graph
  if (timeStudied.length > 0) {
    for (let i=0; i<timeStudied[0].length; i++) {
      let timeSplit = [];
      
      for (let j=0; j<timeStudied.length; j++) {
        timeSplit.push(timeStudied[j][i])
      }
      time.push(timeSplit)
    };
  }
  // Making it possible to show data for only one course at a time
  for (let i=0; i<courses.length; i++) {
    timeCourses.push({course: courses[i], time: timeStudied[i]})
  };

  const [timeVar, setTimeVar] = useState([]);
  // Set timeVar which can be varied to time if the user haven't picked to show only one course
  if (`${timeVar}` != `${time}` & state != 'pressed') {
      setTimeVar(time)    
  }

  // Gets the sum of time studied of each course
  let sum = [];
  for (let i=0; i<timeCourses.length; i++) {
    sum.push(Math.round(timeCourses[i].time.reduce((a, b) => a + b, 0)*10)/10);
  }
  
  const data = {
    labels: initialLabels,
    legend: [],
    data: timeVar,
    barColors: colors
  };

  // When you press a course you will only see data for that course
  const onCoursePressed = (course) => {
    for (let i=0; i<timeCourses.length; i++) {
      if (legend.length === 1 & legend[0] === course) {
        setLegend([timeCourses[i].course])
        setLegend(courses)
        setColors(colorsConst)
        setTimeVar(time)
      }
      
      else if (course === timeCourses[i].course & legend.length != 1){
        setLegend([timeCourses[i].course])
        setColors([colors[i]])
        var timeChange = [];

        for (let j=0;j<timeCourses[i].time.length; j++){
          timeChange.push([timeCourses[i].time[j]])
        }

        setTimeVar(timeChange)
        setState('pressed')
      }
    }
  };

  // Navigation to the calendar where you can pick other dates to display
  const navigation = useNavigation();
  const onDatePressed = () => {
    navigation.navigate('Calendar', {courses: courses, token: token})
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
                yAxisLabel="h "

                decimalPlaces={1}
              />
            </View>

            <View style={styles.dataContainer}>
              <View style={styles.data}>
                <Text style={styles.dataText}>Course</Text>
                <Text style={styles.dataText}>Time</Text>
              </View>
              
              {courses.map((course,i) => (
                <TouchableOpacity style={[styles.colors, {backgroundColor: colorsConst[i]}]} key={course} onPress={() => onCoursePressed(course)}>
                  
                  <View>
                    <Text style={{fontWeight: 'bold'}}>{course}</Text>
                  </View>

                  <View>
                    <Text style={{fontWeight: 'bold'}}>{sum[i]} h</Text>
                  </View>

                </TouchableOpacity> 
              ))}
               
            </View>

            <View>
              <ButtonMenu
                screen="yourReports"
                token={token}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    margin: 4,
    alignItems: 'center'
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