import { Button,View, Text , TouchableHighlight,  StyleSheet,SafeAreaView, } from 'react-native';
import React, {useState} from 'react';
import {Stopwatch} from 'react-native-stopwatch-timer';
import { BorderlessButton } from 'react-native-gesture-handler';

const Timer = ({courseName, color}) => {
    const [isStopwatchStart, setIsStopwatchStart] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);
    const [isTimerStart, setIsTimerStart] = useState(false);
 
    const [timerDuration, setTimerDuration] = useState(90000);
    const [resetTimer, setResetTimer] = useState(false);

    return (
        <SafeAreaView>
           <View style={styles.container}>

            <View style={[styles.sectionStyle, styles[`sectionStyle_${color}`]]}>

              <Text style={styles.title}>{courseName}</Text>
              <Stopwatch
                laps
                secs
                start={isStopwatchStart}// To start
                options={options} // Options for the styling
                getTime={(time) => {
                  console.log(time);
                }}
              />
                
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
    fontSize: 18,
    fontWeight: 'bold',
    padding: 13,
    paddingLeft: 13,
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
    alignContent: 'space-between',
    rowGap: 10,
    overflowWrap: 'break-word',
    padding: 15,
    // backgroundColor: 'pink',
    width: '90%',
    marginVertical: 5,
    borderRadius: 5,
  },

  sectionStyle_ONE:{
    backgroundColor: '#66C7FD'
  },
  sectionStyle_TWO:{
    backgroundColor: '#5987CC'
  },
  sectionStyle_THREE:{
    backgroundColor: '#AC7CE4'
  },
  sectionStyle_FOUR:{
    backgroundColor: '#FFB5E2'
  },
  sectionStyle_FIVE:{
    backgroundColor: '#FFA9A3'
  },
  sectionStyle_SIX:{
    backgroundColor: '#FFC977'
  },

  buttonText: {
    fontSize: 20,
    padding: 13,

  },
  });
  
  const options = {
    text: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
      padding: 13,
      
    },
    


  };

export default Timer