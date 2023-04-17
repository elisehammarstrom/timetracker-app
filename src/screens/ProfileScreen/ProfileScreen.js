
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import {Text, View} from 'react-native';


const ProfileScreen = () => {

    

    const onCoursePressed = () => {
        
        navigation.navigate('StartCourses');
    };



    
    const navigation = useNavigation();

    return (
        <View>
            <Text>Home, sweet home</Text>
           
            <CustomButton 
            text="Go to courses" 
            onPress={onCoursePressed}
            />

        </View>
    )
}

export default ProfileScreen

