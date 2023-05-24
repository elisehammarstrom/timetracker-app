import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CalendarBlock from '../../components/CalendarBlock';
import ClickableWeekCalendar from '../../components/ClickableWeekCalendar';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';
import Title from '../../components/Title';
import CustomButton from '../../components/CustomButton/CustomButton';

const CalendarOpScreen = ({ route }) => {

  const { token } = route.params;
  const { courses } = route.params;
  const { courseIDs } = route.params;

  const [date, setDate] = useState(new Date());
  // console.log("date= ", date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

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
console.log("newdae= ", newDate)

  const navigation = useNavigation();


  const colors = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX']

  //get total study time per course from database
  const studyTime = [5, 1, 2]

  const showInfo = (option) => {
    let name = option
   // console.log(name)
  }

  const onChooseAssignmentPressed = () => {
    navigation.navigate('ChooseAssignment', {token: token, courses: courses, courseIDs: courseIDs})
  }

  return (
    <View style={styles.container} >


      <View style={styles.topContainer}>
        <Title style={styles.title}>Recommended Study Hours</Title>


      </View>

      <ClickableWeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />

      <View style={styles.scroll}>
        <ScrollView style={{ marginBottom: 80 }}>

          {courses.map((option, i) => (

            <TouchableOpacity key={option} onPress={() => { setShowingInfo(false); showInfo({ option }) }} >

              <CalendarBlock
                color={colors[i]}
                courseName={option}
                studyTime={studyTime[i]}
                courseID={courseIDs[i]}
                date={newDate}
                token={token} />
            </TouchableOpacity>
          ))}


          <CustomButton
            text="Choose assignments"
            onPress={onChooseAssignmentPressed}
          />
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

  }


})