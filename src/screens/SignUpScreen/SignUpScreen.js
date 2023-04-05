import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

const SignUpScreen = () => {
    const {control, handleSubmit, formState: {errors}, watch} = useForm();
    const pwd = watch('password');
    console.log(errors);

    const navigation = useNavigation();

    const onRegisterPressed = data => {
        console.log(data)
        navigation.navigate('ConfirmEmail')
    };

    const onSignInPress = () => {
        navigation.navigate('SignIn')

    };

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Create an account</Text>

            <CustomInput 
                name="username"
                placeholder="Username" 
                control={control}
                rules={{required: 'Username is required', minLength: {value: 3, message: 'Username should be at least 3 characters long'}}}
            />
            <CustomInput 
                name="email"
                placeholder="Email" 
                control={control}
                rules={{ pattern: {value: EMAIL_REGEX, message: 'Email is invalid'}}}
            />

            <CustomInput 
                name="password"
                placeholder={"Password"} 
                control={control}
                rules={{required: 'Password is required', minLength: {value: 8, message: 'Password should be at least 8 characters long'}}}
                secureTextEntry
            />
            <CustomInput 
                name="password-repeat"
                placeholder={"Repeat password"} 
                control={control}
                rules={{validate: value => value === pwd || 'Password do not match'}}
                secureTextEntry
            />

            <CustomButton 
                text="Register" 
                onPress={handleSubmit(onRegisterPressed)}
            />

            <CustomButton    
                text="Have and account? Sign in" 
                onPress={onSignInPress}
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

export default SignUpScreen