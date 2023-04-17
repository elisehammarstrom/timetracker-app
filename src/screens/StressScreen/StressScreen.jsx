import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import React, {useState, useRef} from 'react';
import {Text, View, TextInput, StyleSheet, FlatList} from 'react-native';

const data = [
    {id:1, name:"Mekanik"},
    {id:2, name:"Envariabelanalys"},
    {id:3, name:"Miljöteknik"}
]

const StressScreen = () => {

    const [dataFromState, setData]= useState(data)

    const item = ({item})=>{
        return(
            <View style = {{backgroundColor:"green"}}> 
                <Text style = {{fontSize:34}}> {item.name} </Text>
            </View>
        )
    }
const searchName = (input)=>{
    let data = dataFromState
    let searchData = data.filter((item)=>{
        return item.name.toLowerCase().includes(input.toLowerCase())
    })
    setData(searchData)
}
    return (
        <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
            <Text>Stress Screen </Text>

            <View>
                <TextInput 
                placeholder='Serach Course'
                    onChangeText = {(input)=> {
                        searchName(input)

                    }}
                    style = {{fontsize:30}}


                />
            </View>

            <FlatList 
            data={dataFromState}
            renderItem={item}
            keyExtractor={(item,index) => index.toString()} />

    

        </View>
    )
}

export default StressScreen