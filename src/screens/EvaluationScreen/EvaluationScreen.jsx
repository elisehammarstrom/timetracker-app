import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import react, {useState} from 'react';
import Star from '../../components/Star/Star';
import CustomRadioButton from '../../components/CustomRadioButton/CustomRadioButton';

const EvaluationScreen = ({route}) => {
    // const {options} = route.params;

    return (
        
        <View style={styles.container}>
           
            <Star
                question="Difficulty level"
                leftText="Easy"
                rightText="Hard"
            />

            <Star 
                question="How rewarding has this course been?"
                leftText="Not at all"
                rightText="Very"
            />

            <Star  
                question="Has this course had a reasonable workload?"
                leftText="Not at all"
                rightText="Fully agree"
            />

            <CustomRadioButton
                question="Did you attend any lectures?"
                firstOption="No"
                secondOption="A few"
                thirdOption="Most"
                fourthOption="All"
            />
        </View>
 
    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
        backgroundColor: '#313131',
        height: '100%'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
        marginBottom: 50,

    },
})



export default EvaluationScreen;