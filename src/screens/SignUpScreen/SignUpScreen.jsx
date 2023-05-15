import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import { LogBox } from 'react-native'; LogBox.ignoreLogs(['Warning: ...']);

LogBox.ignoreAllLogs();

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

const SignUpScreen = () => {

    const [courses, setCourses] = useState([]);

    const { control, handleSubmit, formState: { errors }, watch } = useForm();
    const pwd = watch('password');
    // console.log(errors);

    const [selectedProgramme, setSelectedProgramme] = useState("");

    const data = [
        { key: '1', value: 'STS' },
        { key: '2', value: 'Industriell ekonomi' }
    ]

    const [selectedUni, setSelectedUni] = useState("");

    const universityData = [
        { key: '1', value: 'Uppsala University' }
    ]

    const navigation = useNavigation();

    const onRegisterPressed = data => {
        const info = {
            first_name: data.firstname,
            last_name: data.lastname,
            email: data.email.toLowerCase(),
            password: data.password,
            university: selectedUni,
            pID: selectedProgramme,
            role: 'STUDENT'
        }

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        }

        const formData = new FormData();
        formData.append('email', info.email);
        formData.append('last_name', info.last_name);
        formData.append('first_name', info.first_name);
        formData.append('password', info.password);
        formData.append('role', info.role);
        formData.append('university', info.university);
        formData.append('pID', '1');

        axios
            .post('http://127.0.0.1:8000/api/users/create_user/', formData, headers, {
                timeout: 3000,
            })
            .then(async response => {
                console.log(response.data);
                axios.post('http://127.0.0.1:8000/auth/login/', formData)
                    .then((res) => {
                        // console.log(res.data.token)
                        // setToken(res.data.token)
                        navigation.navigate('StartCourses', { token: res.data.token, user: info })


                    })
                    .catch((error) => {
                        console.error(error)
                    })
            })
            .catch(error => {
                console.log("error from image :");
            })





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
                rules={{ required: 'First name is required' }}
            />

            <CustomInput
                name="lastname"
                placeholder="Last name"
                control={control}
                rules={{ required: 'Last name is required' }}
            />

            <CustomInput
                name="email"
                placeholder="Email"
                control={control}
                rules={{ pattern: { value: EMAIL_REGEX, message: 'Email is invalid' } }}
            />

            <CustomInput
                name="password"
                placeholder={"Password"}
                control={control}
                rules={{ required: 'Password is required', minLength: { value: 8, message: 'Password should be at least 8 characters long' } }}
                secureTextEntry
            />
            <CustomInput
                name="passwordrepeat"
                placeholder={"Repeat password"}
                control={control}
                rules={{ validate: value => value === pwd || 'Password do not match' }}
                secureTextEntry
            />
            <View style={styles.selectContainer}>



                <SelectList
                    dropdownTextStyles={styles.selectList}
                    inputStyles={styles.selectList}
                    boxStyles={styles.boxStyles}
                    setSelected={(val) => setSelectedUni(val)}
                    data={universityData}
                    save="value"
                    search={false}
                    placeholder='Choose University'
                    dropdownStyles={styles.dropDown}
                />
            </View>
            <View style={styles.selectContainer}>

                <SelectList
                    dropdownTextStyles={styles.selectList}
                    inputStyles={styles.selectList}
                    boxStyles={styles.boxStyles}
                    setSelected={(val) => setSelectedProgramme(val)}
                    data={data}
                    save="value"
                    search={true}
                    placeholder='Choose programme'
                    dropdownStyles={styles.dropDown}
                />
            </View>

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
    dropDown: {
        width: 0.75 * Dimensions.get('window').width,
    },
    selectContainer: {
        paddingVertical: 5
    }

});

export default SignUpScreen