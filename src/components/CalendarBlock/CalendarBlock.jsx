//Calendar block component used on the calendarOp screen
import { View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import DropDown from '../../components/DropDown';
import Text from '../../components/Text';

const CalendarBlock = ({ courseName, color, token, date }) => {
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState('');
  const [studyTime, setStudyTime] = useState(0)
  var formData = new FormData();
  formData.append('date', date);

  axios({
    method: "post",
    url: "http://127.0.0.1:8000/api/optimalSchedule/get_optimal_schedule_by_date/",
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `token ` + token
    }
  })
    .then(function (response) {
      //handle success
  
      for (let i=0;i<response.data.optimalAssignmentsList.length;i++) {
        if (response.data.optimalAssignmentsList[i][courseName] != undefined & data.length <1) {
          setData(response.data.optimalAssignmentsList[i][courseName])
          let sum = 0;
          for (let j=0; j<response.data.optimalAssignmentsList[i][courseName].length; j++){
            sum =  sum + response.data.optimalAssignmentsList[i][courseName][j].hours;
          }
          if (`${studyTime}` != `${sum}`) {
            setStudyTime(sum)
          }

        }
      }

    })
    .catch(function (response) {
      //handle error
      console.log(response);
    });


  const onSelect = (item) => {
    setSelectedItem(item)
  }
  
  return (
    <SafeAreaView>


      <View style={styles.container}>

        <View style={[styles.sectionStyle, styles[`sectionStyle_${color}`]]}>
          <View style={styles.titleContainer}>

            <DropDown
              value={selectedItem}
              data={data}
              courseName={courseName}
              onSelect={onSelect}
            />
            <Text style={styles.title}>{studyTime}h</Text>

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
    justifyContent: 'space-between',
    flex: 5,
    flexDirection: 'row'
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

export default CalendarBlock