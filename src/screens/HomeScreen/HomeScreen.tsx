
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

  const onTimePressed = () => {
        
    navigation.navigate('AddTime', {
    });
  }

    const onStressPressed = () => {
        
      navigation.navigate('Stress', {
      });
};



  return (
    <SafeAreaView style={styles.safe}>
      <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />

      <View>
          {/* Looping the courses to create a timer for each course */}
          {options.map(option => (
                <View key={option}>
                  <Timer courseName={option} color="ONE"/>
                </View>
          ))}
      </View>

      <CustomButton 
        text="Add untracked time" 
        onPress={onTimePressed}
      />

      <CustomButton 
        text="Track stress level" 
        onPress={onStressPressed}
      />

      <ButtonMenu
        screen='timeTracking'
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