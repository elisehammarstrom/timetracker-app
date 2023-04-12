import {View, Text, StyleSheet } from 'react-native';
import Timer from '../../components/Timer';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

const TimerScreen = ({route}) => {

  const {options} = route.params;
  const navigation = useNavigation();

  const onYourReportsPress = data => {
    console.log(data)
    navigation.navigate('YourReports', {paramKey: options})
  };

//   const onTimetrackingPress = data => {
//     console.log(data)
//     navigation.navigate('Timer')
// };

 const onCourseStatsPress = data => {
    console.log(data)
    navigation.navigate('CourseStats')
  };

  
  return (
      <View style={styles.test} >
          <Text> Track Your Time</Text>
          {options.map(option => (
                <View key={option}>
                  <Timer courseName={option}/>
                </View>
          ))}

          <View styles={styles.container}>
            <View styles={styles.buttonContainer}>
              <CustomButton 
                text="Your reports"
                onPress={onYourReportsPress}
                type="SECONDARY"
              />
            </View>

            <View styles={styles.buttonContainer}>
              <CustomButton 
                text="Timetracking"
                // onPress={onTimetrackingPress}
              />
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton 
                text="Course stats"
                onPress={onCourseStatsPress}
                type="SECONDARY"
              />
            </View>
          </View>
          

      </View>
  )

}


const styles = StyleSheet.create({
  test: {
      height: '100%',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,

  }
});



export default TimerScreen