import { Button, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Image } from 'react-native';
import React, { useState } from 'react';
import { Stopwatch } from 'react-native-stopwatch-timer';
import Play from '../../../assets/play.png'
import Pause from '../../../assets/pause.png'
import axios from 'axios';
import { add } from 'timelite/time'
import { str } from 'timelite/time'


const Timer = ({ courseID, courseName, color, token }) => {
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  const [duration, setDuration]= useState('');


  var day = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  var date = year + '-' + month + '-' + day;

  axios({
    method: "post",
    url: "http://127.0.0.1:8000/api/tracking/get_user_day_study_time/",
    headers: {
    'Authorization':`token ` + token
    }
  })
    .then(function (response) {
    //handle success
    console.log(response.data.results)
    for (let i=0; i<Object.keys(response.data.results).length; i++){
      if (response.data.results[i].courseID === courseID) {
        if (duration.length < 1) {
          setDuration(response.data.results[i].duration)
        }
      }
    }
    })
    .catch(function (response) {
    //handle error
    console.log(response);
    });
    console.log("dureation= ", duration)


  function resetTimerMidnight(hour, minutes, seconds, func) {
    const twentyFourHours = 86400000;
    const now = new Date();
    let eta_ms = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minutes, seconds, 0, 0, 0).getTime() - now;
    if (eta_ms < 0) {
      eta_ms += twentyFourHours;
    }
    setTimeout(function () {
      //run once
      func();
      // run every 24 hours from now on
      setInterval(func, twentyFourHours);
    }, eta_ms);
  }

  //resets the timer at midnight
  //ska också skicka med trackad tid
  resetTimerMidnight(0, 0, 0, () => {
    setResetStopwatch(true)
  });

  const getTime = (time, totalDuration) => {
    if (isStopwatchStart != true & time != '00:00:00') {
      let sum = add([time, totalDuration]);
      let sumString = str(sum);

      const formData = new FormData();
      formData.append('courseID', courseID);
      formData.append('date', date);
      formData.append('duration', sumString);

      axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/tracking/track_time/",
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `token ` + token
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

            {<Text style={styles.title}>{courseName}</Text> }
          </View>

          <View style={styles.stopWatchContainer}>
            <Stopwatch
              laps
              secs
              start={isStopwatchStart}// To start
              reset={resetStopwatch} // To reset
              options={options} // Options for the styling
              getTime={(time) => {
                getTime(time, duration);
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
                    style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
                    resizeMode="contain"
                  /> :
                  <Image
                    source={Pause}
                    style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
                    resizeMode="contain" />}
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

  titleContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    flex: 5,
  },

  stopWatchContainer: {
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

  sectionStyle_ONE: {
    backgroundColor: '#66C7FD'
  },
  sectionStyle_TWO: {
    backgroundColor: '#5987CC'
  },
  sectionStyle_THREE: {
    backgroundColor: '#AC7CE4'
  },
  sectionStyle_FOUR: {
    backgroundColor: '#FFB5E2'
  },
  sectionStyle_FIVE: {
    backgroundColor: '#FFA9A3'
  },
  sectionStyle_SIX: {
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