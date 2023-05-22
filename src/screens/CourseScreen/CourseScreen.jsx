// This is the screen where the students picks the courses they want to track
// Both when they first sign up and when they want to change courses

import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import axios from 'axios';
import { TextInput } from 'react-native-paper';
import Text from '../../components/Text';
import Title from '../../components/Title';


const CourseScreen = ({ route }) => {
  const { originalCourseIDs } = route.params;
  const { token } = route.params;
  const navigation = useNavigation();

  const [courseIDs, setCourseIDs] = useState('');
  const [testCourses, setTestCourses] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseCodes, setCourseCodes] = useState([]);
  const [search, setSearch] = useState('');

  // Get all courses from database
  axios.get('http://127.0.0.1:8000/api/courses/', {
    headers: {
      'Authorization': `token ` + token
    }
  })
    .then((res) => {
      // We set testCourses and filteredData to all courses from the database
      // If condition to avoid infinite loop
      if (testCourses.length != res.data.length) {
        setTestCourses(res.data);
        setFilteredData(res.data);
      }

    })
    .catch((error) => {
      console.error(error)
    })
  // Set an array "data" with all the data from backend to make it easier for us to get it
  let data = [];
  for (let i = 0; i < testCourses.length; i++) {
    data.push({
      id: testCourses[i].id,
      courseTitle: testCourses[i].courseTitle,
      courseCode: testCourses[i].courseCode,
    })
  }
  // If the student already have courses, we want them to be checked when they choose new courses
  if (originalCourseIDs) {
    if (courses.length < 1) {
      setCourses(originalCourseIDs);
    }
  }
  // When you press this button you go to the homescreen with your picked courses
  const onTimerPressed = () => {
    // We add courses one at a time to the database, hence the for-loop
    for (let i = 0; i < courseCodes.length; i++) {
      const formData = new FormData();
      formData.append('courseCode', courseCodes[i]);

      // Post the chosen courses to the database
      axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/users/add_course/",
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `token ` + token
        }
      })
        .then(function (response) {
          //handle success
          console.log(response.data);
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });

    }

    // Remove courses from database of chosen courses if not picked
    // This is mainly for when the student want to change courses
    for (let i = 0; i < testCourses.length; i++) {
      if (courses.includes(testCourses[i].id)) {
        console.log("samma")
      } else {
        const formData = new FormData();
        formData.append('courseID', testCourses[i].id);

        axios({
          method: "post",
          url: "http://127.0.0.1:8000/api/users/remove_course/",
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `token ` + token
          }
        })
          .then(function (response) {
            //handle success
            console.log(response.data);
          })
          .catch(function (response) {
            //handle error
            console.log(response);
          });
      }
      // }
    }
    // We get all courses from the database to display them in a list
    axios.get('http://127.0.0.1:8000/api/users/get_courses/', {
      headers: {
        'Authorization': `token ` + token
      }
    })
      .then((res) => {
        // We set the courseIDs to the data we receive
        if (courseIDs.length === 0) {
          setCourseIDs(res.data.courses)
        }
        // This axios is to get the names of the courses picked, and not just the IDs
        axios.get('http://127.0.0.1:8000/api/courses/', {
          headers: {
            'Authorization': `token ` + token
          }
        })
          .then((res) => {
            let newCourses = [];
            for (let j = 0; j < courses.length; j++)

              for (let i = 0; i < res.data.length; i++) {
                if (`${res.data[i].id}` === `${courses[j]}`) {
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
        console.error(error)
      })

    navigation.navigate('Home', { token: token, newCourseIDs: courses });
  };

  // Function for when you press the courses checkboxes
  function pickCourse(selectedCourse, courseCode) {
    // If you press a box that is already checked you remove it
    if (courses.includes(selectedCourse)) {
      setCourses(courses.filter(Course => Course !== selectedCourse))
      setCourseCodes(courseCodes.filter(CourseCode => CourseCode !== courseCode))
      return;
    }
    if (courses.length < 6) {

      if (courseCodes.includes(courseCode)) {
        setCourseCodes(courseCodes.filter(CourseCode => CourseCode !== courseCode))
        return;
      }

      setCourseCodes(CourseCode => CourseCode.concat(courseCode))
      setCourses(Courses => Courses.concat(selectedCourse))

    }
    // cannot pick more than 6 courses
    else {
      alert('You cannot track more than six courses at a time, please deselect a course to select another one')
    }

  }
  // Function for the searching of courses
  const searchFilter = (text) => {
    if (courseCodes.length < 6) {
      if (text) {
        const newData = data.filter((item) => {
          const itemData = item.courseTitle ? item.courseTitle.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilteredData(newData);
        setSearch(text);
      } else {
        setFilteredData(data);
        setSearch(text);
      }
    } else {
      alert('You can pick a maximum of six courses')
    }
  }
  // Just a line that separate each item in the list
  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Choose courses to track:</Title>
      <View style={styles.options}>

        <TextInput
          value={search}
          placeholder='Search courses'
          onChangeText={(text) => searchFilter(text)}
        />


        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <View style={styles.course}>

              <TouchableOpacity style={styles.checkBox} onPress={() => pickCourse(item.id, item.courseCode)}>
                {courses.includes(item.id) && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>

              <Text style={styles.courseName}>{item.courseTitle}  {item.courseCode}</Text>

            </View>

          )}
          ItemSeparatorComponent={ItemSeparatorView}
        />

        <View style={styles.customButtonContainer}>
          <CustomButton
            text="Start tracking"
            onPress={onTimerPressed}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#313131',
  },
  check: {
    alignSelf: 'center',
  },
  courseName: {
    fontSize: 16,
    color: '#EFEFEF'
  },
  checkBox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: '#EFEFEF',
    marginRight: 5,
    backgroundColor: 'white'
  },
  course: {
    flexDirection: 'row',
    marginVertical: 7,
  },
  options: {
    width: '90%',
    height: '90%',

  },
  customButtonContainer: {
    paddingHorizontal: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EFEFEF',
    margin: 10,
    justifyContent: 'flex-start'
  },
})

export default CourseScreen;