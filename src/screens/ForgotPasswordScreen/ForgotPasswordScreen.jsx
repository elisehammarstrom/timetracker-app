import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';


const ForgotPasswordScreen = () => {
    const navigation = useNavigation();
    const {control, handleSubmit, formState: {errors}} = useForm();
    console.log(errors)

    const onSendPressed = () => {
        navigation.navigate('NewPassword')
    };

    const onSignInPress = () => {
        navigation.navigate('SignIn')
    };



    return (
        <View style={styles.root}>
            <Text style={styles.title}>Reset your password</Text>

            <CustomInput
                name="email" 
                placeholder="Email" 
                control={control}
                rules={{required: 'Email required'}}
            />

            <CustomButton 
                text="Send" 
                onPress={handleSubmit(onSendPressed)} 
            />

            <CustomButton
                text="Back to sign in"
                onPress={onSignInPress}
                type="TERTIARY"
            />


        </View>
    )
};

const styles = StyleSheet.create({
    root: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
        backgroundColor: '#313131'

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
    },
    
});

export default ForgotPasswordScreen