//Dropdown component used on calendarOp screen 

import React, { Component, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import DropdownArrow from '../../../assets/dropdownArrow.png'
import Text from '../../components/Text';


const DropDown = ({ data = [], value = {}, courseName }) => {
    
    const [showOption, setShowOption] = useState(false);
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.5} style={styles.dropdownStyle} onPress={() => setShowOption(!showOption)}>
                <Text style={{ paddingRight: 6, fontWeight: 'bold' }}

                >{!!value ? value?.name : courseName}</Text>
                <Image
                    source={DropdownArrow}
                    style={[{ height: 50 * 0.3 }, { width: 50 * 0.3 },
                    { transform: [{ rotate: showOption ? '180deg' : '0deg' }] }]}
                    resizeMode="contain"
                />

            </TouchableOpacity>
            {showOption && (<View style={{ padding: 8, borderRadius: 6, maxHeight: 100 }}>
                {data != '' ?
                    <ScrollView>
                        {data.map((val, i) => {
                            return (
                                <View key={val}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ padding: 5 }}>{val.assignmentName}</Text>
                                        <Text> {val.hours} h </Text>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>

                : null}
               
            </View>)}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {

    },
    dropdownStyle: {
        padding: 8,
        borderRadius: 6,
        minHeight: 42,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,

    },
})

export default DropDown;