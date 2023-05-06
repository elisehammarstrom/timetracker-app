// Component for the buttons in the bottom of many screens

import React, {useState} from "react";
import CustomButton from "../CustomButton/CustomButton";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';


const ButtonMenu = ({screen, token}) => {
    const [courseIDs, setCourseIDs] = useState('');
    const [courses, setCourses] = useState([]);

    axios.get('http://127.0.0.1:8000/api/users/get_courses/', {
        headers: {
          'Authorization': `token ` + token
        }
      })
      .then((res) => {
      
        if (courseIDs.length === 0) {
          setCourseIDs(res.data.courses)
        }
    
        axios.get('http://127.0.0.1:8000/api/courses/', {
        headers: {
          'Authorization': `token ` + token
        }
        })
        .then((res) => {
          let newCourses = [];
          for (let j=0; j<courseIDs.length; j++)
    
            for (let i=0; i<res.data.length; i++) {
              if (`${res.data[i].id}` === `${courseIDs[j]}`) {
                newCourses.push(`${res.data[i].courseTitle}`)
              }
          }
          if (courses.length === 0) {
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

    // const courses = ["Mekanik", "Reglerteknik", "Envariabelanalys"];
    // Navigation when you press each button
    const onYourReportsPress = data => {
      console.log('token= ',token)
      navigation.navigate('YourReports', {courses: courses, token: token}) //Options is the courses youve picked
    };
  
     const onTimetrackingPress = data => {
      navigation.navigate('Home', {options: courses, token: token})
    };
  
    const onCourseStatsPress = type => {
      navigation.navigate('Courses', {courses: courses, token: token})
    };

    return(
        // Three buttons for "Your reports", "Timetracing/homepage" and "Course stats"
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <CustomButton 
                    text="Your reports"
                    onPress={onYourReportsPress}
                    type={screen==='yourReports' ? 'CURRENTPAGE' : 'TERTIARY'} //Depending on what page you are the buttons have a different style
                />
            </View>    

            <View style={styles.buttonContainer}>
                <CustomButton
                    text="Tracking"
                    onPress={onTimetrackingPress}
                    type={screen==='timeTracking' ? 'CURRENTPAGE' : 'TERTIARY'}
                />
            </View>

            <View style={styles.buttonContainer}>
                <CustomButton 
                    text="Course stats"
                    onPress={onCourseStatsPress}
                    type={screen==='courseStats' ? 'CURRENTPAGE' : 'TERTIARY'}
                />
            </View>

        </View>
    )
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#313131',
        position: 'absolute',
        bottom: 0
      },
      buttonContainer: {
        flex: 1,
      }
})

export default ButtonMenu