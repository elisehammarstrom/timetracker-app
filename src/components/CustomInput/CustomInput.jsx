// Custom input field for use in various places in the app.

import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'
import { Controller } from 'react-hook-form';
import Text from '../../components/Text';

const CustomInput = ({ control, name, rules, placeholder, secureTextEntry }) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                    <View style={[styles.container, { borderColor: error ? 'red' : '#e8e8e8' }]} >
                        <TextInput
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            style={styles.input}
                            secureTextEntry={secureTextEntry}
                            autoCapitalize="none"
                        />
                    </View>
                    {error && (<Text style={{ color: 'red', alignSelf: 'stretch' }}>{error.message || 'Error'} </Text>)}
                </>
            )}
        />
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EFEFEF',
        width: '100%',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        padding: 10
    },
    input: {
        fontSize: 20,
        fontFamily: 'Trebuchet MS'
    }
});

export default CustomInput