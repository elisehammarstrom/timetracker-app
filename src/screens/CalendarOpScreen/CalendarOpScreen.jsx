import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CalendarBlock from '../../components/CalendarBlock';
import ClickableWeekCalendar from '../../components/ClickableWeekCalendar';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';
import Title from '../../components/Title';
import CustomButton from '../../components/CustomButton/CustomButton';
import axios from 'axios';
import LeftArrow from '../../../assets/left-arrow.png'
import RightArrow from '../../../assets/right-arrow.png'
import Invisible from '../../../assets/invisible-box.png'


const CalendarOpScreen = ({ route }) => {

  const { token } = route.params;
  const { courses } = route.params;
  const { courseIDs } = route.params;



  const [date, setDate] = useState(new Date());
  const [isShowingArrow, setShowingArrow] = React.useState(true)

  const onCurrentDatePressed = () => {
    setDate(new Date())
  }

  var ourDate = new Date();

  //Change it so that it is 7 days in the future
  var pastDate = ourDate.getDate() + 7;
  ourDate.setDate(pastDate);

  const onCalendarPressed = () => {
    setDate(ourDate)


  }

  // console.log("date= ", date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  axios({
    method: "post",
    url: "http://127.0.0.1:8000/api/availableHours/create_availableHours/",
    headers: {
      'Authorization': `token ` + token

    }
  })
    .then(function (response) {
      //handle success
      console.log(response.data)

    })
    .catch(function (response) {
      //handle error
      console.log(response);
    });



  //make date in the correct format
  if (month && day < 10) {
    var month = '0' + month
    var day = '0' + day
    var newDate = year + '-' + month + '-' + day

  }
  else if (day < 10) {
    var day = '0' + day
    var newDate = year + '-' + month + '-' + day
  }
  else if (month < 10) {
    var month = '0' + month
    var newDate = year + '-' + month + '-' + day
  }
  else {
    var newDate = year + '-' + month + '-' + day
  }

  console.log('newDate', newDate)

  const navigation = useNavigation();

  const colors = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX']

  const onChooseAssignmentPressed = () => {
    navigation.navigate('ChooseAssignment', { token: token, courses: courses, courseIDs: courseIDs })
  }

  return (
    <View style={styles.container} >


      <View style={styles.topContainer}>
        <Title style={styles.title}>Recommended Study Hours</Title>


      </View>

      {
        isShowingArrow ?
          (
            <View style={styles.layout}>
              <View >
                <Image
                  source={Invisible}
                  style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.calendar}>
                <ClickableWeekCalendar date={date} onChange={(newDate) => { setDate(newDate); navigation.navigate('CalendarOpScreen', { token: token, courses: courses, courseIDs: courseIDs }) }} />

              </View>
              <TouchableOpacity onPress={() => { onCalendarPressed(true); setShowingArrow(false); }}>
                <Image
                  source={RightArrow}
                  style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )
          :
          (
            <View style={styles.layout}>
              <TouchableOpacity onPress={() => { onCurrentDatePressed(true); setShowingArrow(true); }}>
                <Image
                  source={LeftArrow}
                  style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <View style={{ paddingHorizontal: 10 }}>
                <ClickableWeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />
              </View>

              <View >
                <Image
                  source={Invisible}
                  style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
                  resizeMode="contain"
                />
              </View>
            </View>
          )
      }



      <View style={styles.scroll}>
        <ScrollView style={{ marginBottom: 80 }}>

          {courses.map((option, i) => (

            <View key={option} >

              <CalendarBlock
                color={colors[i]}
                courseName={option}
                date={newDate}
                token={token} />
            </View>
          ))}

          <View style={styles.button}>
            <CustomButton
              text="Choose assignments"
              onPress={onChooseAssignmentPressed}
            />
          </View>

        </ScrollView>



      </View>
      <View>
        <ButtonMenu
          screen="courseStats"
          token={token}
        />
      </View>



    </View>

  );
};

export default CalendarOpScreen;


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#313131',
    height: '100%',
    alignitems: 'center',
    justifyContent: 'space-between',

  },
  text: {
    color: 'white',
    fontSize: 30,
    flex: 5
  },
  topContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,

  },
  close: {
    flex: 3
  },
  box: {
    backgroundColor: 'pink'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EFEFEF',

  },
  scroll: {
    height: '80%',

  },
  button: {
    padding: 50
  },
  layout: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },


})