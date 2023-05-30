// This is what we call the 'Homepage' and where the student tracks their time.
// From here it is also possible to navigate to the different parts of the app.

import WeekCalendar from '../../components/WeekCalendar';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import Timer from '../../components/Timer';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import ButtonMenu from '../../components/ButtonMenu';
import Logo from '../../../assets/logo.png';
import InvisibleBox from '../../../assets/invisible-box.png';
import SettingIcon from '../../../assets/settings.png';
import axios from 'axios';


const HomeScreen: React.FC = ({ route }) => {

  const { token } = route.params;
  const [courseIDs, setCourseIDs] = useState('');
  const [courses, setCourses] = useState([]);

  // We get the courses from the database
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

  const [date, setDate] = useState(new Date());
  // To get colors for the courseboxes
  const colors = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX']

  // Navigate to different screens you only can reach from homeScreen
  const onTimePressed = () => {
    navigation.navigate('AddTime', { courses: courses, token: token, courseIDs: courseIDs });
  }

  const onStressPressed = () => {
    navigation.navigate('Stress', { courses: courses, token: token, courseIDs: courseIDs });
  };

  const onSettingsPressed = () => {
    navigation.navigate('Profile', { token: token, courseIDs: courseIDs });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.layout} >

        <Image
          source={InvisibleBox}
          style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
          resizeMode="contain"
        />

        <Image
          source={Logo}
          style={[styles.logo, { height: 230 * 0.3 }]}
          resizeMode="contain"
        />


        <TouchableOpacity activeOpacity={0.5} style={{ padding: 10 }} onPress={onSettingsPressed}>
          <Image
            source={SettingIcon}
            style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
            resizeMode="contain"
          />
        </TouchableOpacity>

      </View>

      <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />
      <ScrollView>
        <View style={styles.timeLoop}>

          {/* Looping the courses to create a timer for each course */}
          {courses.map((option, i) => (
            <View key={option}>
              <Timer
                courseID={courseIDs[i]}
                color={colors[i]}
                courseName={option}
                token={token}
              // date={date}
              />
            </View>
          ))}
        </View>


        {/* Buttons for adding untracked time and for tracking stress level */}
        <View style={styles.buttonContainer}>
          <View style={styles.customButtonContainer}>
            <CustomButton
              text="Add untracked time"
              onPress={onTimePressed}
              type="HOMESCREEN"
            />


            <CustomButton
              text="Track stress level"
              onPress={onStressPressed}
              type="HOMESCREEN"
            />

          </View>
        </View>
      </ScrollView>
      <ButtonMenu
        screen='timeTracking'
        token={token}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#313131',
    height: '100%',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonContainer: {
    backgroundColor: '#313131',
  },
  customButtonContainer: {
    paddingHorizontal: 50,
    marginBottom: 100
  },
  timeLoop: {
    width: '100%',
  },
  settings: {
    color: 'white',
    fontSize: 30,
    padding: 10,
    paddingTop: 20,
  },
  logo: {
    width: '100%',
    maxWidth: 150,
    maxHeight: 200,

  },
  layout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    height: '100%',
    justifyContent: 'center',
    alighItems: 'center',
    width: 150,
    padding: 10,
  },
});

export default HomeScreen;