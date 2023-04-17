
import { useNavigation } from '@react-navigation/native';
import React, {useState, useRef} from 'react';
import {Text, View, TextInput, StyleSheet, FlatList, Image,TouchableOpacity} from 'react-native';
import ButtonMenu from '../../components/ButtonMenu';






const StressScreen = () => {
    const navigation = useNavigation();
    const [courses, setCourses] = useState([])
    const options = ["Mekanik", "Reglerteknik", "Envariabelanalys"]


    const onTimerPressed = () => {
        navigation.navigate('Home', {options: courses});
    };
    

      function pickCourse(selectedCourse) {
        if(courses.includes(selectedCourse)){
          setCourses(courses.filter(Course => Course !== selectedCourse))
          return;
        }

        setCourses(Courses => Courses.concat(selectedCourse))

      }

    return (

        
        <View styles={styles.container}>

<Text styles={styles.title}>Select course you want to track </Text>
            <View styles={styles.options}>
              {options.map(option => (

                <View key={option} style={styles.course}>
                  <TouchableOpacity style={styles.checkBox} onPress={()=>pickCourse(option)}>
                    {courses.includes(option) && <Text style={styles.check}>✓</Text>}
                  </TouchableOpacity>
                  <Text style={styles.courseName}>{option}</Text>
                  </View>

                ))}
            

                
                

             </View>
             <ButtonMenu/>
             </View>

            

        

        
    )
}

const styles = StyleSheet.create({
    check: {
      alignSelf: 'center',
    },
    courseName: {
      textTransform: 'capitalize',
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
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

export default StressScreen