

import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import {Text, View} from 'react-native';

const HomeScreen = () => {

    const onCoursePressed = () => {
        
        navigation.navigate('StartCourses');
    };

       const onCalendarPressed = () => {
        
        navigation.navigate('StartCalendar');
    }; 

    
    const navigation = useNavigation();

    return (
        <View>
            <Text>Home, sweet home</Text>
            
            <CustomButton 
            text="Go to courses" 
            onPress={onCoursePressed}
            />

            <CustomButton 
            text="Go to calendar" 
            onPress={onCalendarPressed}
            />

        </View>
    )
}

export default HomeScreen
