import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import react, {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';


const EvaluationScreen = ({route}) => {
    const {options} = route.params;
    const navigation = useNavigation();

    return (
        <View>
            <Text>Evaluating {options}</Text>
        </View>
 
    )
}

export default EvaluationScreen;