import { Button,View, Text , TouchableOpacity,  StyleSheet,SafeAreaView,Dimensions, Image } from 'react-native';
import React, {useState} from 'react';
import {Stopwatch} from 'react-native-stopwatch-timer';
import Play from '../../../assets/play.png'
import Pause from '../../../assets/pause.png'
import { secondsToMinutes } from 'date-fns';
import axios from 'axios';
import DropDown from '../../components/DropDown';

const Timer = ({courseID, courseName, color, token}) => {
    const [isStopwatchStart, setIsStopwatchStart] = useState(false);
    const [resetStopwatch, setResetStopwatch] = useState(false);
    const [isTimerStart, setIsTimerStart] = useState(false);
 
    const [timerDuration, setTimerDuration] = useState(90000);
    const [resetTimer, setResetTimer] = useState(false);
    const [active, setActive] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    //hämta in uppgifter från databasen
    let fruits = [
      {id: 1, name: courseName},
      {id: 2, name: 'Assignment 1'},
      {id: 3, name: 'Lecture 3 '},
      {id: 4, name: 'Lesson 2'},
      {id: 5, name: 'Group project'},
      {id: 6, name: 'Repetition'},
  ]
  
  const onSelect = (item) => {
      setSelectedItem(item)
  }
    
    var day = new Date().getDate();
    var month = new Date().getMonth()+1;
    var year = new Date().getFullYear();
    var date = year + '-' + month + '-' + day;

    const getTime = (time) => {
      if (isStopwatchStart != true){
        let data = {
          courseID: courseID,
          date: date,
          duration: time,
        };
        // console.log(courseName)
        const formData = new FormData();
        formData.append('courseID', courseID);
        formData.append('date', date);
        formData.append('duration', time);

        axios({
          method: "post",
          url: "http://127.0.0.1:8000/api/tracking/track_time/",
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization':`token ` + token
          }
        })
          .then(function (response) {
            //handle success
            console.log(response.data);
          })
          .catch(function (response) {
            //handle error
            console.log(response);
          });

        // console.log(data)
      } 
     
    }

    return (
        <SafeAreaView>
           <View style={styles.container}>

            <View style={[styles.sectionStyle, styles[`sectionStyle_${color}`]]}>

              <View style={styles.titleContainer}>

              <DropDown
                    value={selectedItem}
                    data={fruits}
                    courseName={courseName}
                    onSelect={onSelect}
                    />
                {/* <Text style={styles.title}>{courseName}</Text> */}
              </View>

              <View style={styles.stopWatchContainer}>
                <Stopwatch
                  laps
                  secs
                  start={isStopwatchStart}// To start
                  options={options} // Options for the styling
                  getTime={(time) => {
                    getTime(time);
                  }}
                />
              </View>
              <View style={styles.playPauseContainer}>
                <TouchableOpacity activeOpacity={0.5}
                  onPress={() => {
                    setIsStopwatchStart(!isStopwatchStart);
                    setResetStopwatch(false);
                  }}>
                  <Text style={styles.buttonText}>
                    {!isStopwatchStart ? 
                      <Image 
                        source={Play} 
                        style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
                        resizeMode="contain" 
                        />: 
                      <Image 
                        source={Pause}
                        style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
                        resizeMode="contain"/>}
                  </Text>
                </TouchableOpacity> 
              </View>
              
            </View>

          </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 13,
    paddingLeft: 13,
  },

  container: {
/*     flex: 1, */
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionStyle: {
 /*    flex: 5, */
    flexDirection: 'row',
    alignIems: 'center',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    rowGap: 20,
    overflowWrap: 'break-word',
    padding: 10,
    paddingRight: 15,
    width: 0.9 * Dimensions.get('window').width,
    marginVertical: 5,
    borderRadius: 5,
  },

  titleContainer:{
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 5,
  },

  stopWatchContainer:{
    justifyContent: 'center',
    flex: 3
  },

  playPauseContainer: {
    flex: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 25

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
      fontSize: 14,
      fontWeight: 'bold',
      color: 'black',
      padding: 13,
      
    },
    


  };

export default Timer