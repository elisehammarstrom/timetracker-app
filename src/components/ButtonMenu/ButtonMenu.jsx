// Component for the buttons in the bottom of many screens

import React, { useState } from "react";
import CustomButton from "../CustomButton/CustomButton";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import EvaluationIcon from '../../../assets/evaluationIcon.png';
import TimeIcon from '../../../assets/timeIcon.png';
import CalendarIcon from '../../../assets/calendar.png';
import LineChartIcon from '../../../assets/chart.png';
import BarChartIcon from '../../../assets/bar-graph.png';


const ButtonMenu = ({ screen, token }) => {
  const [courseIDs, setCourseIDs] = useState('');
  const [courses, setCourses] = useState([]);

  axios.get('http://127.0.0.1:8000/api/users/get_courses/', {
    headers: {
      'Authorization': `token ` + token
    }
  })
    .then((res) => {

      if (`${courseIDs}` != `${res.data.courses}`) {
        setCourseIDs(res.data.courses)
      }

      axios.get('http://127.0.0.1:8000/api/courses/', {
        headers: {
          'Authorization': `token ` + token
        }
      })
        .then((res) => {
          let newCourses = [];
          for (let j = 0; j < courseIDs.length; j++)

            for (let i = 0; i < res.data.length; i++) {
              if (`${res.data[i].id}` === `${courseIDs[j]}`) {
                newCourses.push(`${res.data[i].courseTitle}`)
              }
            }
          if (`${courses}` != `${newCourses}`) {
            setCourses(newCourses)
          }

        })
        .catch((error) => {
          console.error(error)
        })

    })
    .catch((error) => {
      // console.error(error)
    })

  const navigation = useNavigation();

  // Navigation when you press each button
  const onReportsPress = data => {
    console.log('token= ', token)
    navigation.navigate('Calendar', { courses: courses, token: token, courseIDs: courseIDs }) //Options is the courses youve picked
  };

  const onTimetrackingPress = data => {
    navigation.navigate('Home', { options: courses, token: token })
  };

  const onCourseStatsPress = type => {
    navigation.navigate('Courses', { courses: courses, token: token, courseIDs: courseIDs })
  };

  const onCalendarPress = type => {
    navigation.navigate('CalendarOpScreen', { courses: courses, token: token, courseIDs: courseIDs })
  };

  const onComparePress = type => {
    navigation.navigate("CourseStats", { courses: courses, token: token, courseIDs: courseIDs })
  };

  return (
    // Three buttons for "Your reports", "Timetracing/homepage" and "Course stats"
    <View style={styles.container}>

      <View style={styles.buttonContainer1}>
        <TouchableOpacity activeOpacity={0.5} onPress={onComparePress}>
          <Image
            source={LineChartIcon}
            style={[{ height: 120 * 0.3 }, { width: 120 * 0.3 }, { marginBottom: 10 }]}
            resizeMode="contain"
          />
          <Text style={styles.buttonIcon}>Compare</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer2}>

        <TouchableOpacity activeOpacity={0.5} onPress={onReportsPress}>
          <Image
            source={BarChartIcon}
            style={[{ height: 120 * 0.3 }, { width: 120 * 0.3 }, { marginBottom: 10 }]}
            resizeMode="contain"
          />
          <Text style={styles.buttonIcon}>Reports</Text>
        </TouchableOpacity>
        {/*  <CustomButton
                    text="Your reports"
                    onPress={onYourReportsPress}
                    type={screen==='yourReports' ? 'CURRENTPAGE' : 'TERTIARY'} //Depending on what page you are the buttons have a different style
                /> */}
      </View>





      <View style={styles.buttonContainer3}>
        <TouchableOpacity activeOpacity={0.5} onPress={onTimetrackingPress}>
          <Image
            source={TimeIcon}
            style={[{ height: 120 * 0.3 }, { width: 120 * 0.3 }, { marginBottom: 10 }]}
            resizeMode="contain"
          />
          <Text style={styles.buttonIcon}>Tracking</Text>
        </TouchableOpacity>
        {/*   <CustomButton
                    text="Tracking"
                    onPress={onTimetrackingPress}
                    type={screen==='timeTracking' ? 'CURRENTPAGE' : 'TERTIARY'}
                />  */}
      </View>


      <View style={styles.buttonContainer4}>
        <TouchableOpacity activeOpacity={0.5} onPress={onCalendarPress}>
          <Image
            source={CalendarIcon}
            style={[{ height: 120 * 0.3 }, { width: 120 * 0.3 }, { marginBottom: 10 }]}
            resizeMode="contain"
          />
          <Text style={styles.buttonIcon}>Calendar</Text>
        </TouchableOpacity>

      </View>


      <View style={styles.buttonContainer5}>
        <TouchableOpacity activeOpacity={0.5} onPress={onCourseStatsPress}>
          <Image
            source={EvaluationIcon}
            style={[{ height: 120 * 0.3 }, { width: 120 * 0.3 }, { marginBottom: 10 }]}
            resizeMode="contain"
          />
          <Text style={styles.buttonIcon}>Evaluation</Text>
        </TouchableOpacity>
        {/*    <CustomButton 
                    text="Course stats"
                    onPress={onCourseStatsPress}
                    type={screen==='courseStats' ? 'CURRENTPAGE' : 'TERTIARY'}
                />   */}
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#313131',
    position: 'absolute',
    bottom: 0,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#D3D0D0'
  },
  buttonContainer1: {
    flex: 1,
    paddingLeft: 30,
    padding: 10
  },

  buttonContainer2: {
    flex: 1,
    padding: 10

  },

  buttonContainer3: {
    flex: 1,
    padding: 10

  },
  buttonContainer4: {
    flex: 1,
    padding: 10

  },
  buttonContainer5: {
    justifyContent: 'flex-end',
    flex: 1,
    padding: 10

  },
  buttonIcon: {
    fontSize: 9,
    color: 'white',
    justifyContent: 'center',
  }

})

export default ButtonMenu