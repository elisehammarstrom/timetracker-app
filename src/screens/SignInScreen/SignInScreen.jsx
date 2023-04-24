import React, {useState} from 'react'
import { View, Text, Image, StyleSheet, useWindowDimensions, TextInput } from 'react-native'
import Logo from '../../../assets/icon.png'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

const SignInScreen = () => {
    const {height} = useWindowDimensions();
    const navigation = useNavigation();

    const {control, handleSubmit, formState: {errors}} = useForm();
    console.log(errors);


    const onSignInPressed = data => {

        const info = {
            email: data.email,
            password: data.password,
        } 

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        }

        const formData = new FormData();
        formData.append('email', info.email);
        formData.append('password', info.password);

        axios 
        .post('http://127.0.0.1:8000/auth/login/', formData, headers, {
            timeout: 3000,
        })
        .then(async response => {
            console.log(response.data);
        })
        .catch(error=> {
            console.log("error from image :");
   })
        console.log(data)
        // Validate user
        
        navigation.navigate('StartCourses', {user: data});
    };
    const onForgotPasswordPressed = () => {
        navigation.navigate('ForgotPassword')
    };

    const onSignUpPress = () => {
        navigation.navigate('SignUp')
    };

/*     var info = []; */

    /* const requestData = {
        email: 'simon.sjo@gmail.com',
        password: '123456',
      };
      
      // Send a POST request with the request data in the request body
      axios.post('http://127.0.0.1:8000/auth/login/', requestData)
        .then(response => {
          // Handle response data here
        })
       /*  .catch(error => {
          // Handle error here
        }); */
      

    return (
        <View style={styles.root}>
            <Image 
                source={Logo} 
                style={[styles.logo, {height: height * 0.3}]} 
                resizeMode="contain"
            />

            <CustomInput 
                name="email"
                placeholder="Email" 
                control={control} 
                rules={{required: 'Email is required'}}
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