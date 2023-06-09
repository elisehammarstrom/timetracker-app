// Component for the buttons in the bottom of many screens

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import EvaluationIcon from '../../../assets/evaluationIcon.png';
import TimeIcon from '../../../assets/timeIcon.png';
import CalendarIcon from '../../../assets/calendar.png';
import LineChartIcon from '../../../assets/chart.png';
//Line chart icons created by ibobicon
import BarChartIcon from '../../../assets/bar-chart-2.png';
//Bar chart icon created by Freepik
import Text from '../../components/Text';


const ButtonMenu = ({ token, screen }) => {
  const [courseIDs, setCourseIDs] = useState('');
  const [courses, setCourses] = useState([]);

  // get the courses so we can send them to the different screens
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
      console.error(error)
    })

  const navigation = useNavigation();

  // Navigation when you press each button
  const onReportsPress = () => {
    navigation.navigate('Calendar', { courses: courses, token: token, courseIDs: courseIDs }) //Options is the courses youve picked
  };

  const onTimetrackingPress = () => {
    navigation.navigate('Home', { options: courses, token: token })
  };

  const onCourseStatsPress = () => {
    navigation.navigate('Courses', { courses: courses, token: token, courseIDs: courseIDs })
  };

  const onCalendarPress = () => {
    navigation.navigate('CalendarOpScreen', { courses: courses, token: token, courseIDs: courseIDs })
  };

  const onComparePress = () => {
    navigation.navigate("CourseStats", { chosenCourses: courses, token: token, courseIDs: courseIDs })
  };

  return (
    // Five buttons for the five different screens you can navigate to
    <View style={styles.container}>

      <View style={[styles.buttonContainer1, screen === 'compare' ? { backgroundColor: '#605F5F', borderRadius: 10 } : { backgroundColor: 'transparent' }]}>
        <TouchableOpacity activeOpacity={0.5} onPress={onComparePress}>
          <Image
            source={LineChartIcon}
            style={[{ height: 120 * 0.3 }, { width: 120 * 0.3 }, { marginBottom: 10 }]}
            resizeMode="contain"
          />
          <Text style={styles.buttonIcon}>Compare</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.buttonContainer2, screen === 'reports' ? { backgroundColor: '#605F5F', borderRadius: 10 } : { backgroundColor: 'transparent' }]}>

        <TouchableOpacity activeOpacity={0.5} onPress={onReportsPress} style={{ alignSelf: 'center' }}>
          <Image
            source={BarChartIcon}
            style={[{ height: 120 * 0.3 }, { width: 120 * 0.3 }, { marginBottom: 10 }]}
            resizeMode="contain"
          />
          <Text style={styles.buttonIcon}>Reports</Text>
        </TouchableOpacity>

      </View>


      <View style={[styles.buttonContainer3, screen === 'timeTracking' ? { backgroundColor: '#605F5F', borderRadius: 10 } : { backgroundColor: 'transparent' }]}>
        <TouchableOpacity activeOpacity={0.5} onPress={onTimetrackingPress} style={{ alignSelf: 'center' }}>
          <Image
            source={TimeIcon}
            style={[{ height: 120 * 0.3 }, { width: 120 * 0.3 }, { marginBottom: 10 }]}
            resizeMode="contain"
          />
          <Text style={styles.buttonIcon}>Tracking</Text>
        </TouchableOpacity>

      </View>

      <View style={[styles.buttonContainer4, screen === 'calendar' ? { backgroundColor: '#605F5F', borderRadius: 10, width: 10 } : { backgroundColor: 'transparent' }]}>
        <TouchableOpacity activeOpacity={0.5} onPress={onCalendarPress} style={{ alignSelf: 'center' }} >
          <Image
            source={CalendarIcon}
            style={[{ height: 120 * 0.3 }, { width: 120 * 0.3 }, { marginBottom: 10 }]}
            resizeMode="contain"
          />
          <Text style={styles.buttonIcon}>Calendar</Text>
        </TouchableOpacity>

      </View>


      <View style={[styles.buttonContainer5, screen === 'evaluation' ? { backgroundColor: '#605F5F', borderRadius: 10 } : { backgroundColor: 'transparent' }]}>
        <TouchableOpacity activeOpacity={0.5} onPress={onCourseStatsPress}>
          <Image
            source={EvaluationIcon}
            style={[{ height: 120 * 0.3 }, { width: 120 * 0.3 }, { marginBottom: 10 }]}
            resizeMode="contain"
          />
          <Text style={styles.buttonIcon}>Evaluation</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#313131',
    position: 'absolute',
    bottom: 0,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#D3D0D0',
    paddingLeft: 15,
    paddingRight: 15

  },
  buttonContainer1: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 15
  },

  buttonContainer2: {
    flex: 1,
    padding: 10,
  },

  buttonContainer3: {
    flex: 1,
    padding: 10

  },
  buttonContainer4: {
    flex: 1,
    padding: 10,

  },
  buttonContainer5: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 15

  },
  buttonIcon: {
    fontSize: 9,
    color: 'white',
    justifyContent: 'center',
  }

})

export default ButtonMenu