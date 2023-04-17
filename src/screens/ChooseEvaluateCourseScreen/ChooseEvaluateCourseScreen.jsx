import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import react, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';

const EvaluateCourseScreen = () => {
    const navigation = useNavigation();
    const [courses, setCourses] = useState([])
    const options = ["Mekanik", "Reglerteknik", "Envariabelanalys"]


    const onEvaluateCoursePressed = () => {
        navigation.navigate('EvaluateCourse', {options: courses});
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
            <Text styles={styles.title}>Select course to Evaluate</Text>
            <View styles={styles.options}>
              {options.map(option => (
                <View key={option} style={styles.course}>
                  <TouchableOpacity style={styles.checkBox} onPress={()=>pickCourse(option)}>
                    {courses.includes(option) && <Text style={styles.check}>✓</Text>}
                  </TouchableOpacity>
                  <Text style={styles.courseName}>{option}</Text>
                  </View>

                ))}
                 <CustomButton 
                    text="Evaluate course" 
                    onPress={onEvaluateCoursePressed}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
        backgroundColor: '#313131',
        height: '100%'
    },
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
})

export default EvaluateCourseScreen;