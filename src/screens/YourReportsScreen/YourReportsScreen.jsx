// On this screen the student will see their own statistics for a max period of 7 days.

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import { StackedBarChart } from "react-native-chart-kit";
import CustomButton from '../../components/CustomButton/CustomButton';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Noll from '../../../assets/transparent.png'
import Ett from '../../../assets/ett.png'
import Två from '../../../assets/2.png'
import Tre from '../../../assets/3.png'
import Fyra from '../../../assets/4.png'
import Fem from '../../../assets/5.png'
import Title from '../../components/Title';
import Text from '../../components/Text';


const YourReportsScreen = ({ route }) => {
  const { token } = route.params;
  const { firstDate } = route.params;
  const { lastDate } = route.params;
  const { courseIDs } = route.params;

  const [labels, setLabels] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const fetchedCourses = [];
  const fetchedTimeStudied = [];
  const [courses, setCourses] = useState([]);
  const [timeStudied, setTimeStudied] = useState([]);
  const [state, setState] = useState('');
  const fetchedStress = [];
  const [stress, setStress] = useState('');
  // This array contains the sources of the pictures that wil be displayed depending on the avg stress of each course
  const smileys = [Noll, Ett, Två, Tre, Fyra, Fem];

  // Here we set the start- and enddate. To avoid infinite loop we put it inside a if condition. 
  if (startDate !== firstDate.dateString) {
    setStartDate(firstDate.dateString);
    setEndDate(lastDate.dateString);
    if (stress.length > 0) {
      setStress([]);
    }
  }
  // Setting the labels for the graph, i.e. the dates of which you have chosen. We want it in the format of d/m so it fits on the screen
  let newLabels = [];
  for (let i = firstDate.day; i <= lastDate.day; i++) {
    newLabels.push(i + '/' + firstDate.month);
  }
  // if condition to avoid infinite loop when we set the labels
  if (`${labels}` != `${newLabels}`) {
    setLabels(newLabels);
  }


  //Fetching the users study time on each course for the dates you have picked
  if (startDate.length >0) {
  const formData = new FormData();
  formData.append('startDate', startDate)
  formData.append('endDate', endDate)
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
      // We push the data of the timestudied and the courses the an array each
      for (let i = 0; i < res.data.results.length; i++) {
        fetchedTimeStudied.push(res.data.results[i].timeStudied)
        fetchedCourses.push(res.data.results[i].Course)
      }
      // Setting the courses and timestudied to the fetched data
      if (`${fetchedTimeStudied}` != `${timeStudied}`) {
        setCourses(fetchedCourses);
        setTimeStudied(fetchedTimeStudied);
      }
    })
    .catch((error) => {
      //console.error(error)

    })
  }

  // Getting the avg stress for each course and the timespan chosen
  for (let i = 0; i < courseIDs.length; i++) {
    if (startDate.length > 0) {
    console.log("startDate= ", startDate)
    const formData = new FormData();
    formData.append('startDate', startDate)
    formData.append('endDate', endDate)
    formData.append('courseID', courseIDs[i])

    axios({
      method: "post",
      url: "http://127.0.0.1:8000/api/tracking/get_user_stress_period/",
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `token ` + token
      }
    })
      .then((res) => {
        // fetching the stress and setting it to a number for each course
        if (stress.length === 0) {
          fetchedStress.push(res.data)
          if (stress != fetchedStress) {
            setStress(fetchedStress)
          }
        }

      })
      .catch((error) => {
        //console.error(error)
      })
  }
}
  // Getting an array of the stress (rounded up), so we can compare to the stress smileys
  let stressNumbers = [];
  if (stress.length === courseIDs.length) {
    for (let i = 0; i < courseIDs.length; i++) {
      for (let j = 0; j < stress.length; j++) {
        if (stress[j].courseObject.courseID === courseIDs[i]) {
          stressNumbers.push(Math.round(stress[j].avg_stress))
        }
      }
    }
  }

  // Specifics for the graph ...
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

  // Colors for the graph and for the boxes, needing to color arrays since if we change to only one course we want the color in the graph to be consistent
  const colorsConst = ['#66C7FD', '#5987CC', '#AC7CE4', '#FFB5E2', '#FFA9A3', '#FFC977'];
  const [colors, setColors] = useState(['#66C7FD', '#5987CC', '#AC7CE4', '#FFB5E2', '#FFA9A3', '#FFC977']);
  const [legend, setLegend] = useState(courses);

  var time = [];
  var timeCourses = [];

  // Get the right format for the timeStudied to fit in to the graph, i.e. an array with data for each day instead of one array for each course
  if (timeStudied.length > 0) {
    for (let i = 0; i < timeStudied[0].length; i++) {
      let timeSplit = [];

      for (let j = 0; j < timeStudied.length; j++) {
        timeSplit.push(timeStudied[j][i])
      }
      time.push(timeSplit)
    };
  }
  // Making it possible to show data for only one course at a time
  for (let i = 0; i < courses.length; i++) {
    timeCourses.push({ course: courses[i], time: timeStudied[i] })
  };

  const [timeVar, setTimeVar] = useState("");
  const [data, setData] = useState('');
  // Set timeVar which can be varied to time if the user haven't picked to show only one course


  if (`${timeVar}` != `${time}` & state != 'pressed') {
    setTimeVar(time)
  }

  if (timeVar.length > 0 & data.data != timeVar) {
    setData({
      labels: labels,
      legend: [],
      data: timeVar,
      barColors: colors
    })
  }

  // When you press a course you will only see data for that course
  const onCoursePressed = (course) => {

    for (let i = 0; i < timeCourses.length; i++) {
      // If you already have pressed the course, the data will go back to all courses if you press again
      if (legend.length === 1 & legend[0] === course) {
        setLegend([timeCourses[i].course])
        setLegend(courses)
        setColors(colorsConst)
        setTimeVar(time)
      }
      // If you pick a course we set the data to only show for that course, and the legend and colors sets to correspond 
      else if (course === timeCourses[i].course & legend.length != 1) {

        var timeChange = [];
        for (let j = 0; j < timeCourses[i].time.length; j++) {
          timeChange.push([timeCourses[i].time[j]])
        }
        // If the course you pick don't have any data you will get an alert, to check we sum up the array of data and check if it is =0
        let sum = 0;
        for (let i = 0; i < timeChange.length; i++) {
          for (let j = 0; j < timeChange[0].length; j++) {
            sum = sum + timeChange[i][j];
          }
        }

        if (sum != 0) {
          setTimeVar(timeChange)
          setState('pressed')
          setLegend([timeCourses[i].course])
          setColors([colors[i]])
        } else {
          alert('You have not tracked time for this course')
        }

      }
    }

  };

  // Navigation to the calendar where you can pick other dates to display
  const navigation = useNavigation();
  const onDatePressed = () => {
    navigation.navigate('Calendar', { courses: courses, token: token, courseIDs: courseIDs })
  }
  if (data.data != undefined) {

    return (
      <View style={styles.container}>

        <View style={styles.header}>

          <View>
            <Title style={styles.title}>Your reports</Title>
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
            <Text style={styles.dataTextCourse}>Course</Text>
            <Text style={styles.dataTextStress}>Stress</Text>
          </View>
          <ScrollView style={styles.scrollView}>
            <View style={styles.center}>

              {courses.map((course, i) => (

                <TouchableOpacity style={[styles.colors, { backgroundColor: colorsConst[i] }]} key={course} onPress={() => onCoursePressed(course)}>

                  <View style={{ flex: 7 }}>
                    <Text style={{ fontWeight: 'bold' }}>{course}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Image
                      source={smileys[stressNumbers[i]]}
                      style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }, { marginBottom: 10 }]}
                      resizeMode="contain"
                    />
                  </View>

                </TouchableOpacity>

              ))}
            </View>
          </ScrollView>
        </View>


        <View>
          <ButtonMenu
            screen="reports"
            token={token}
          />
        </View>

      </View>
    )
  }
};

const styles = StyleSheet.create({
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
  dataTextStress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EFEFEF',
    flex: 1
  },
  dataTextCourse: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EFEFEF',
    flex: 5
  },
  data: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%'
  },
  scrollView: {
    width: Dimensions.get('window').width,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40
  }
})

export default YourReportsScreen;