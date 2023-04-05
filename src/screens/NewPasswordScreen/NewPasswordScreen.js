import React, {useState} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

const NewPasswordScreen = () => {
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigation = useNavigation();


    const onSubmitPressed = () => {
        navigation.navigate('Home');
    };

    const onSignInPress = () => {
        navigation.navigate('SignIn');
    };


    return (
        <View style={styles.root}>
            <Text style={styles.title}>Reset your password</Text>

            <CustomInput 
                placeholder="Code" 
                value={code} 
                setValue={setCode} 
            />

            <CustomInput 
                placeholder="Enter your new password" 
                value={newPassword} 
                setValue={setNewPassword} 
            />


            <CustomButton 
                text="Submit" 
                onPress={onSubmitPressed} 
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