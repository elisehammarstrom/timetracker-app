import React from "react";
import { View, Text } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';




const HomeScreen = () => {

    const onTimerPressed = () => {
        navigation.navigate('Timer');
    };
    
    const navigation = useNavigation();
    
    return (
        <View>
            <Text>Home, sweet home</Text>
            <CustomButton 
                text="Go to timer" 
                onPress={onTimerPressed}
            />

        </View>
    )
}

export default HomeScreen