import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import { RadioButton } from 'react-native-paper';
import ButtonMenu from '../../components/ButtonMenu/ButtonMenu';


const EvaluateCourseScreen = () => {
    const navigation = useNavigation();
    const options = ["Mekanik", "Reglerteknik", "Envariabelanalys"]

    const [checked, setChecked] = React.useState('');

    const onEvaluateCoursePressed = () => {
        navigation.navigate('EvaluateCourse', {options: checked});
    };
    
    return (
        <View style={styles.container}>

            <View style={styles.options}>
                <Text style={styles.title}>Select course to Evaluate</Text>

                <View>
                    {options.map(option => (
                        <View style={styles.button} key={option}>
                            <RadioButton
                                text={option}
                                value={option}
                                status={ checked === option ? 'checked' : 'unchecked'}
                                onPress={() => setChecked(option)}
                            />
                            <Text style={styles.text}>{option}</Text>
                        </View>   
                    ))}
                </View>
                
                <View style={styles.evaluateButton}>
                    <CustomButton 
                        text="Evaluate course" 
                        onPress={onEvaluateCoursePressed}
                    />
                </View>
            </View>
            

            <View>
                <ButtonMenu
                    screen="courseStats"
                />
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        backgroundColor: '#313131',
        height: '100%'
    },
    options: {
        alignItems: 'center'
    },
    title: {
        marginTop: '25%',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
        marginBottom: 50,
    },
    button: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',        
    },
    text: {
        color: '#EFEFEF',
        fontWeight: 'bold',
        fontsize: 15,
    },
    evaluateButton: {
        padding: 50
    }
})

export default EvaluateCourseScreen;