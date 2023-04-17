import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';


const NewPasswordScreen = () => {
    const navigation = useNavigation();
    const {control, handleSubmit, formState: {errors}} = useForm();
    console.log(errors)

    const onSubmitPressed = data => {
        console.log(data);
        navigation.navigate('Home');
    };

    const onSignInPress = () => {
        navigation.navigate('SignIn');
    };


    return (
        <View style={styles.root}>
            <Text style={styles.title}>Reset your password</Text>

            <CustomInput 
                name="code"
                placeholder="Code" 
                control={control}
                rules={{required: 'Code required'}}
            />

            <CustomInput 
                name="newPassword"
                placeholder="Enter your new password" 
                control={control}
                rules={{required: 'Password required'}}
                secureTextEntry
            />


            <CustomButton 
                text="Submit" 
                onPress={handleSubmit(onSubmitPressed)} 
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
        justifyContent: 'center',
        alignItems: 'center',
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

export default NewPasswordScreen