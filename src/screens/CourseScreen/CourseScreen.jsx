import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import axios from 'axios';

const CourseScreen = ({route}) => {

  const [testCourses, setTestCourses] = useState('');
  

  axios.get('http://127.0.0.1:8000/api/courses/', {
    headers: {
      'Authorization': `token 53ba76420d512d53c7cca599cbda42c950d37996`
    }
  })
  .then((res) => {
    // console.log(res.data)
    if (testCourses.length != res.data.length){
      setTestCourses(res.data);
    }
    
  })
  .catch((error) => {
    console.error(error)
  })

  console.log("testcourses=", testCourses)
  let data = [];
  for (let i=0; i<testCourses.length; i++){
    data.push({
      id: testCourses[i].id,
      courseTitle: testCourses[i].courseTitle,
      courseCode: testCourses[i].courseCode,
    })
  }

  const {user} = route.params;


  const navigation = useNavigation();
  const [courses, setCourses] = useState([])
  const [courseCodes, setCourseCodes] = useState([])

  const [selected, setSelected] = React.useState([]);

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    'Authorization':`token 53ba76420d512d53c7cca599cbda42c950d37996`
  }




  const onTimerPressed = () => {
    // for (let i=0; i<courseCodes.length; i++) {
      // courseCodes[i]
      const formData = new FormData();
      formData.append('courseCode', '1TE702');

      // axios.post('http://127.0.0.1:8000/api/users/add_course/', formData, headers, {
      //   timeout: 3000,
      // })
      axios.post('http://127.0.0.1:8000/api/users/add_course/', {
        headers: {
      'Authorization': `token 53ba76420d512d53c7cca599cbda42c950d37996`
      }, data:formData
      })
      .then(async response => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error)
      })

    // }


      navigation.navigate('Home', {options: courses});
      // console.log(user)
      // console.log("courses=", courses)
      // console.log('courseCodes=', courseCodes)
  };
    

  function pickCourse(selectedCourse, courseCode) {
    
    if(courses.includes(selectedCourse)){
      setCourses(courses.filter(Course => Course !== selectedCourse))
      return;
    }

    if(courseCodes.includes(courseCode)){
      setCourseCodes(courseCodes.filter(CourseCode => CourseCode !== courseCode))
      return;
    }

    setCourseCodes(CourseCode => CourseCode.concat(courseCode) )

    setCourses(Courses => Courses.concat(selectedCourse))
    



  }
  
    return (
        <View style={styles.container}>
          
            <View styles={styles.options}>
              

              {data.map((item,index) => (
                <View key={index} style={styles.course}>

                  <TouchableOpacity style={styles.checkBox} onPress={()=>pickCourse(item.id, item.courseCode)}>
                    {courses.includes(item.id) && <Text style={styles.check}>✓</Text>}
                  </TouchableOpacity>

                  <Text style={styles.courseName}>{item.courseTitle}  {item.courseCode}</Text>

                </View>
                ))}

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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor:  '#313131',
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
  },
  course: {
    flexDirection: 'row',
    marginVertical: 7,
  },
  options: {
    alignSelf: 'flex-start',
    marginLeft: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EFEFEF',
    margin: 10,
    marginBottom: 50,
  },
 
  customButtonContainer: {
    paddingHorizontal: 50,
  },
  selectListContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'scroll' // behövs bara för webben, på mobilen med expo appen funkar allt som det ska
},
selectBox: {
  backgroundColor: 'grey',
  color: 'white'
}


})

export default CourseScreen;