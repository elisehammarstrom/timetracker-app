import { Button,View, Text , TouchableHighlight,  StyleSheet,SafeAreaView, } from 'react-native';
import React, {useState} from 'react';
import {Stopwatch} from 'react-native-stopwatch-timer';

const Timer = ({courseName}) => {
    const [isStopwatchStart, setIsStopwatchStart] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);
    const [isTimerStart, setIsTimerStart] = useState(false);
 
    const [timerDuration, setTimerDuration] = useState(90000);
    const [resetTimer, setResetTimer] = useState(false);

  
    const colours = []


    let courseColours = ['#77BB97', '#8CC2E4', '#FAA79E'];

    let randColour = courseColours[Math.floor(Math.random() * courseColours.length)];

    return (
        <SafeAreaView>
           <View style={styles.container}>

       <View style={styles.sectionStyle}>
        <Text style={styles.title}>{courseName}</Text>
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
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
    container: {
      flex: 1,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },

    sectionStyle: {
      flex: 1,
      flexDirection: 'row',
      alignIems: 'center',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: 'pink',

    },
    buttonText: {
      fontSize: 20,
      padding: 20,
    },
  });
  
  const options = {
    text: {
      fontSize: 20,
      color: '#FFF',
      padding: 20,
      
    },
    


  };

export default Timer