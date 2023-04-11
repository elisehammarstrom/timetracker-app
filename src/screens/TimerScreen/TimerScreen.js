import {View, Text, StyleSheet, Image, } from 'react-native';
import Timer from '../../components/Timer';
import Logo from '../../../assets/icon.png';



const TimerScreen = () => {

  
  return (
      <View style={styles.test} >
          <Text> Track Your Time</Text>

          <Timer 
          />

      </View>
  )

}


const styles = StyleSheet.create({
  test: {
      backgroundColor: '#313131',
      height: '100%',
      

  }
});



export default TimerScreen