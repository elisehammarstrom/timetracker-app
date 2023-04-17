import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions, TextInput } from 'react-native'
import Logo from '../../../assets/icon.png'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';

const SignInScreen = () => {
    const {height} = useWindowDimensions();
    const navigation = useNavigation();

    const {control, handleSubmit, formState: {errors}} = useForm();
    console.log(errors);


    const onSignInPressed = data => {
        console.log(data)
        // Validate user
        navigation.navigate('StartCourses');
    };
    const onForgotPasswordPressed = () => {
        navigation.navigate('ForgotPassword')
    };

    const onSignUpPress = () => {
        navigation.navigate('SignUp')
    };

    return (
        <View style={styles.root}>
            <Image 
                source={Logo} 
                style={[styles.logo, {height: height * 0.3}]} 
                resizeMode="contain"
            />

            <CustomInput 
                name="username"
                placeholder="Username" 
                control={control} 
                rules={{required: 'Username is required'}}
            />
            <CustomInput 
                name="password"
                placeholder={"Password"} 
                secureTextEntry
                control={control} 
                rules={{required: 'Password is required'}}
            />


            <CustomButton 
                text="Sign in" 
                onPress={handleSubmit(onSignInPressed)}
            />

            <CustomButton    
                text="Forgot password?" 
                onPress={onForgotPasswordPressed}
                type="TERTIARY"
            />
            <CustomButton    
                text="Don't have an account? Create one" 
                onPress={onSignUpPress}
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
    logo: {
        width: '70%',
        maxWidth: 300,
        maxHeight: 200,
    },
});

export default SignInScreen