
import WeekCalendar from '../../components/WeekCalendar';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

import {addDays} from 'date-fns';
import React, {useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';

const CalendarScreen: React.FC = () => {
  const [date, setDate] = useState(new Date());

  const onCoursePressed = () => {
        
    navigation.navigate('StartCourses', {
    });
};

const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />

      <CustomButton 
            text="Go to courses" 
            onPress={onCoursePressed}
            />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
});

export default CalendarScreen;