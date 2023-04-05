import React, {useState} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const ConfirmEmailScreen = () => {
    const [code, setCode] = useState('');
    const navigation = useNavigation();


    const onConfirmPressed = () => {
        navigation.navigate('Home')
    };

    const onSignInPress = () => {
        navigation.navigate('SignIn')
    };

    const onResendPress = () => {
        console.warn('onResendPress')
    };


    return (
        <View style={styles.root}>
            <Text style={styles.title}>Confirm your email</Text>

            <CustomInput 
                placeholder="Enter you confirmation code" 
                value={code} 
                setValue={setCode} 
            />

            <CustomButton 
                text="Confirm" 
                onPress={onConfirmPressed} 
            />

            <CustomButton
                text="Back to sign in"
                onPress={onSignInPress}
                type="SECONDARY"
            />

            <CustomButton
                text="Resend code"
                onPress={onResendPress}
                type="TERTIARY"
            />



        </View>
    )
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        margin: 10,
    },
    
});

export default ConfirmEmailScreen