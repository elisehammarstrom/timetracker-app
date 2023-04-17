
import WeekCalendar from '../../components/WeekCalendar';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

import {addDays} from 'date-fns';
import React, {useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';

const HomeScreen: React.FC = () => {
  const [date, setDate] = useState(new Date());

  const onTimePressed = () => {
        
    navigation.navigate('AddTime', {
    });
  }

    const onStressPressed = () => {
        
      navigation.navigate('Stress', {
      });
};

const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />

          <CustomButton 
            text="Add untracked time" 
            onPress={onTimePressed}
            />

        <CustomButton 
            text="Track stress level" 
            onPress={onStressPressed}
            />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
});

export default HomeScreen;