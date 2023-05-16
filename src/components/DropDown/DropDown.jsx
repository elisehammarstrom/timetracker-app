import React, {Component, useState} from 'react';
import {View, Text, StyleSheet,TouchableOpacity, Image, ScrollView} from 'react-native';
import DropdownArrow from '../../../assets/dropdownArrow.png'


const DropDown = ({
    data = [],
    value = {},
    courseName,
    onSelect = () => {}
}) => {

    const [showOption, setShowOption] = useState(false);
    const onSelectedItem = (val) => {
        setShowOption(false)
        onSelect(val)
        
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.5} style={styles.dropdownStyle} onPress={() => setShowOption(!showOption)}>
                <Text style={{paddingRight: 6 ,  fontWeight: 'bold'}}
                
                >{!!value? value?.name: courseName}</Text>
                <Image
                    source={DropdownArrow}
                    style={[ {height: 50 * 0.3},{width: 50*0.3},
                    {transform: [{rotate: showOption? '180deg': '0deg'}]}]} 
                    resizeMode="contain"
                />

            </TouchableOpacity>
            {showOption && (<View style={{padding: 8, borderRadius: 6, maxHeight: 100}}>
            <ScrollView>
            {data.map((val, i) => {
                return(
                    <TouchableOpacity activeOpacity={0.5} 
                        key={String(i)}
                        onPress={()=>onSelectedItem(val)}
                        /* style = {{backgroundColor: value.id == val.id? 'pink':'transparent'}} */
                        >
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{padding: 5}}>{val.name}</Text>
                        <Text> {val.time} </Text>
                        </View>
                    </TouchableOpacity>
                )
            })}
            </ScrollView>
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