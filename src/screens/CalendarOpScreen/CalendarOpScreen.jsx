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
  // const { assignments } = route.params;
  const [isShowingInfo, setShowingInfo] = useState(true)
  const [name, setname] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [date, setDate] = useState(new Date());


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
                courseID={courseIDs[i]} />
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