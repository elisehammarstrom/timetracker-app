import { Button,View, Text , TouchableHighlight,  StyleSheet,SafeAreaView, } from 'react-native';
import React, {useState} from 'react';
import {Stopwatch} from 'react-native-stopwatch-timer';

const Timer = () => {
    const [isStopwatchStart, setIsStopwatchStart] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);
    const [isTimerStart, setIsTimerStart] = useState(false);
 
    const [timerDuration, setTimerDuration] = useState(90000);
    const [resetTimer, setResetTimer] = useState(false);

    return (
        <SafeAreaView>
           <View style={styles.container}>

       <View style={styles.sectionStyle}>
         <Stopwatch
           laps
           secs
           start={isStopwatchStart}
           // To start
    
           options={options}
           // Options for the styling
           getTime={(time) => {
             console.log(time);
           }}/>

         <TouchableHighlight
           onPress={() => {
             setIsStopwatchStart(!isStopwatchStart);
             setResetStopwatch(false);
           }}>
           <Text style={styles.buttonText}>
             {!isStopwatchStart ? '▶️' : '⏸'}
           </Text>
         </TouchableHighlight>
         
        
       </View>
         </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },

    sectionStyle: {
      flex: 1,
      marginTop: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 20,
    },
  });
  
  const options = {
    container: {
      backgroundColor: 'blue',
      padding: 5,
      borderRadius: 5,
      width: 200,
      alignItems: 'center',
    },
    text: {
      fontSize: 25,
      color: '#FFF',
      marginLeft: 7,
    },
  };

export default Timer