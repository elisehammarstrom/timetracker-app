import {View, Text, StyleSheet, Image, } from 'react-native';
import Timer from '../../components/Timer';
import Logo from '../../../assets/icon.png';



const TimerScreen = ({route}) => {

  const {options} = route.params;

  
  return (
      <View style={styles.test} >
          <Text> Track Your Time</Text>
          {options.map(option => (
                <View key={option}>
                  <Timer courseName={option}/>

                  </View>

                ))}

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
});



export default TimerScreen