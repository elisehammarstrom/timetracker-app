import {View, Text, StyleSheet } from 'react-native';
import Timer from '../../components/Timer';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';



const TimerScreen = ({route}) => {

  const {options} = route.params;
  const navigation = useNavigation();
  
  return (
      <View style={styles.test} >
          <Text> Track Your Time</Text>
          {/* Looping the courses to create a timer for each course */}
          {options.map(option => (
                <View key={option}>
                  
                  <Timer courseName={option} color="ONE"/>
                </View>
                ))}

          <ButtonMenu
            options={options}
          />
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