import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { MultipleSelectList } from 'react-native-dropdown-select-list'

const CourseScreen = ({route}) => {
  const {user} = route.params;


  const navigation = useNavigation();
  const [courses, setCourses] = useState([])
  const options = ["Mekanik", "Reglerteknik", "Envariabelanalys", "System- och operationsanalys"]

  const [selected, setSelected] = React.useState([]);

  const data = [
    {key:'1', value:'Algoritmer och datastrukter'},
    {key:'2', value:'Mekanik'},
    {key:'3', value:'Miljöteknik'},
    {key:'4', value:'Reglerteknik'},
    {key:'5', value:'Sannolikhet och statistik'},
    {key:'6', value:'System- och operationsanalys'},
    {key:'7', value:'Transformmetoder'},
]


  const onTimerPressed = () => {
      navigation.navigate('Home', {options: courses});
      console.log(user)
  };
    

  function pickCourse(selectedCourse) {
    if(courses.includes(selectedCourse)){
      setCourses(courses.filter(Course => Course !== selectedCourse))
      return;
    }

    setCourses(Courses => Courses.concat(selectedCourse))

  }

    return (
        <View style={styles.container}>
         
 
          <View style={styles.selectListContainer}>
            <MultipleSelectList 
              setSelected={(val) => setSelected(val)} 
              data={data} 
              save="value"
              label="Chosen courses"
              search = {true}
              placeholder = 'Search courses'
              dropdownTextStyles={{color: 'white'}}
              inputStyles={{color: 'white', width: 200}}
              checkBoxStyles = {{backgroundColor: 'white'}}
              boxStyles = {styles.selectBox}
              labelStyles = {{color:'white'}}
              notFoundText = 'No course found'
              dropdownStyles={{backgroundColor: 'grey', width: 300}}
              badgeStyles = {{backgroundColor: '#313131'}}
           
           
              />
          </View>
          
            <View styles={styles.options}>
              {options.map(option => (
                <View key={option} style={styles.course}>
                  <TouchableOpacity style={styles.checkBox} onPress={()=>pickCourse(option)}>
                    {courses.includes(option) && <Text style={styles.check}>✓</Text>}
                  </TouchableOpacity>
                  <Text style={styles.courseName}>{option}</Text>
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
/*     justifyContent: 'center',
    alignItems: 'center', */
    backgroundColor:  '#313131',
  },
  check: {
    alignSelf: 'center',
  },
  courseName: {
    fontSize: 16,
  },
  checkBox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: 'green',
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