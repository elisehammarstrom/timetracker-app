import React from "react";
import { View, Text } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';




const HomeScreen = () => {

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

export default HomeScreen