import {StyleSheet, Text, View, TouchableOpacity, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import axios from 'axios';
import { TextInput } from 'react-native-paper';
// import { FlatList } from 'react-native-gesture-handler/lib/typescript/components/GestureComponents';

const CourseScreen = ({route}) => {

  const [testCourses, setTestCourses] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  var day = new Date().getDate();
  var month = new Date().getMonth()+1;
  var year = new Date().getFullYear();

  const [date, setDate] = useState('');

  if (date.length < 1) {
  if (`${day}`.length === 1 & `${month}`.length === 1) {
    setDate(year + '-0' + month + '-0' + day + 'T00:00:00Z')
  }
  else if (`${day}`.length === 1) {
    setDate(year + '-' + month + '-0' + day + 'T00:00:00Z')
  }
  else if (`${month}`.length === 1) {
    setDate(year + '-0' + month + '-' + day + 'T00:00:00Z')
  }
  else {
    setDate(year + '-' + month + '-' + day + 'T00:00:00Z')

  }}  

  axios.get('http://127.0.0.1:8000/api/courses/', {
    headers: {
      'Authorization': `token 53ba76420d512d53c7cca599cbda42c950d37996`
    }
  })
  .then((res) => {
    if (testCourses.length != res.data.length){
      setTestCourses(res.data);
      setFilteredData(res.data);

    }
    
  })
  .catch((error) => {
    console.error(error)
  })

  let data = [];
  for (let i=0; i<testCourses.length; i++){
    // if (testCourses[i].courseEndDateTime >= date) {
      data.push({
        id: testCourses[i].id,
        courseTitle: testCourses[i].courseTitle,
        courseCode: testCourses[i].courseCode,
      })
    // }
  }

  const {user} = route.params;


  const navigation = useNavigation();
  const [courses, setCourses] = useState([]);
  const [courseCodes, setCourseCodes] = useState([]);
  const [search, setSearch] = useState('');

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


      navigation.navigate('Home');
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

  const searchFilter = (text) => {
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
  }
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
          
            <View style={styles.options}>
                
                  <TextInput
                    value={search}
                    placeholder='Search courses'
                    onChangeText={(text) => searchFilter(text)}
                  />

                
                <FlatList
                  data={filteredData}
                  renderItem={({item}) => (
                    <View style={styles.course}>

                      <TouchableOpacity style={styles.checkBox} onPress={()=>pickCourse(item.id, item.courseCode)}>
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
    width: '90%',
    height: '90%',
   
  },
  customButtonContainer: {
    paddingHorizontal: 50,
  },

})

export default CourseScreen;