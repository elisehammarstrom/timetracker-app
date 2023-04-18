// This is what we call the 'Homepage' and where the student tracks their time.
// From here it is also possible to navigate to the different parts of the app.

import WeekCalendar from '../../components/WeekCalendar';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import Timer from '../../components/Timer';
import {addDays} from 'date-fns';
import React, {useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import ButtonMenu from '../../components/ButtonMenu';

const HomeScreen: React.FC = ({route}) => {

  const {options} = route.params;
  const navigation = useNavigation();

  const [date, setDate] = useState(new Date());

  // const colors = ['#66C7FD','#5987CC','#AC7CE4','#FFB5E2','#FFA9A3','#FFC977']
  const colors = ['ONE','TWO','THREE','FOUR','FIVE','SIX']


  const onTimePressed = () => {       
    navigation.navigate('AddTime', {
    });
  }

  const onStressPressed = () => {
    navigation.navigate('Stress', {
    });
  };



  return (
    <SafeAreaView style={styles.root}>
      <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />

      <View style={styles.timeLoop}>

          {/* Looping the courses to create a timer for each course */}
          {options.map((option, i) => (
                <View key={option}>
                  <Timer 
                    courseName={option} 
                    color={colors[i]}
                  />
                </View>
          ))}
      </View>

      {/* Buttons for adding untracked time and for tracking stress level */}
      <View style={styles.buttonContainer}>
        <View style={styles.customButtonContainer}>
          <CustomButton 
            text="Add untracked time" 
            onPress={onTimePressed}
            type="HOMESCREEN"
          />

          <CustomButton 
            text="Track stress level" 
            onPress={onStressPressed}
            type="HOMESCREEN"
          />
        </View>
        

        <View>
          <ButtonMenu
            screen='timeTracking'
          />
        </View>
        

      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#313131',
    height: '100%',
    justifyContent:'space-between',
    width: '100%'
  },
  buttonContainer: {
    backgroundColor: '#313131',
  },
  customButtonContainer: {
    paddingHorizontal: 50,
  },
  timeLoop: {
    width: '100%'
  }


});

export default HomeScreen;