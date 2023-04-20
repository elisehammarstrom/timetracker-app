import React, {useState} from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { SelectList } from 'react-native-dropdown-select-list';

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

const SignUpScreen = () => {
    const {control, handleSubmit, formState: {errors}, watch} = useForm();
    const pwd = watch('password');
    // console.log(errors);

    const [selected, setSelected] = useState("");

    const data = [
        {key:'1', value:'Mekanik'},
        {key:'2', value:'Reglerteknik'},
        {key:'3', value:'Envariabelanalys'}
    ]

    var info = [];
    const navigation = useNavigation();

    const onRegisterPressed = data => {
        // data.push({programme: selected})
        info.push(data)
        info.push({programme: selected})
        console.log(info)
        navigation.navigate('StartCourses', {user: data})
    };

    const onSignInPress = () => {
        navigation.navigate('SignIn')

    };

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Create an account</Text>

            <CustomInput 
                name="firstname"
                placeholder="First name" 
                control={control}
                rules={{required: 'First name is required'}}
            />

            <CustomInput 
                name="lastname"
                placeholder="Last name" 
                control={control}
                rules={{required: 'Last name is required'}}
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

            <SelectList
                    dropdownTextStyles={styles.selectList}
                    inputStyles={styles.selectList}
                    boxStyles={styles.boxStyles}
                    setSelected={(val) => setSelected(val)}
                    data={data}
                    save="value"
                    search={false}
                    placeholder='Choose course to see statistics'
            />

            <CustomButton 
                text="Register" 
                onPress={handleSubmit(onRegisterPressed)}
            />

            <CustomButton    
                text="Have an account? Sign in" 
                onPress={onSignInPress}
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
        marginBottom: 50,

    },
    selectListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '3%',
    },
    selectList: {
        fontWeight: 'bold',
        color: '#EFEFEF',
    },
    boxStyles: {
        width: 0.75 * Dimensions.get('window').width,
    },
    
});

export default SignUpScreen