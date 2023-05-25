// Screen where you sign in
import React from 'react'
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native'
import Logo from '../../../assets/logo.png'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import axios from 'axios';


const SignInScreen = () => {
    const { height } = useWindowDimensions();
    const navigation = useNavigation();

    // We use react-hook-form to save the data
    const { control, handleSubmit, formState: { errors } } = useForm();

    // When you press the sign in button we send the data to the database and check if it matches a user. 
    // If the info matches a user you get a token and sends you to the home page
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

                if (response.data.token) {
                    navigation.navigate('Home', { token: response.data.token })
                }

            })
            .catch(error => {
                //console.log("error from image :");
                alert('Wrong email or password')

            })


    };

    const onSignUpPress = () => {
        navigation.navigate('SignUp')
    };

    return (
        <View style={styles.container}>

            <View style={styles.root}>

                <Image
                    source={Logo}
                    style={[styles.logo, { height: height * 0.4 }]}
                    resizeMode="contain"
                />

                <CustomInput
                    name="email"
                    placeholder="Email"
                    control={control}
                    rules={{ required: 'Email is required' }}
                />
                <CustomInput
                    name="password"
                    placeholder={"Password"}
                    secureTextEntry
                    control={control}
                    rules={{ required: 'Password is required' }}
                />


                <CustomButton
                    text="Sign in"
                    onPress={handleSubmit(onSignInPressed)}
                />

                <CustomButton
                    text="Don't have an account? Create one"
                    onPress={onSignUpPress}
                    type="TERTIARY"
                />


            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#313131',
        justifyContent: 'center',

    },
    root: {
        alignItems: 'center',
        paddingHorizontal: 50,

    },
    logo: {
        width: '70%',
        maxWidth: 300,
        maxHeight: 200,
    },
    languageContainer: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    languageButton: {
        width: '40%'
    }

});

export default SignInScreen