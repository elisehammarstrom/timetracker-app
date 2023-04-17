import React, {useState} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';



const ConfirmEmailScreen = () => {
    const navigation = useNavigation();

    const {control, handleSubmit, formState: {errors}} = useForm();
    console.log(errors);

    const onConfirmPressed = data => {
        console.log(data)
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
                name="code"
                placeholder="Enter you confirmation code" 
                control={control}
                rules={{required: 'Code is required'}}
            />

            <CustomButton 
                text="Confirm" 
                onPress={handleSubmit(onConfirmPressed)} 
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
        justifyContent: 'center',
        padding: 50,
        backgroundColor: '#313131',
        height: '100%',

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
    },
    
});

export default ConfirmEmailScreen