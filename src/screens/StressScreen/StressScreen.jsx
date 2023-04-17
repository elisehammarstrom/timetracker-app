
import { useNavigation } from '@react-navigation/native';
import React, {useState, useRef} from 'react';
import {Text, View, TextInput, StyleSheet, FlatList, Image,TouchableOpacity} from 'react-native';
import ButtonMenu from '../../components/ButtonMenu';
import { SelectList } from 'react-native-dropdown-select-list'







const StressScreen = () => {  
    
    const [selected, setSelected] = React.useState("");
  
    const data = [
    {key:'1', value:'Meknik'},
    {key:'2', value:'Reglerteknik'},
    {key:'3', value:'Envariabelanalys'},
    ]
   
   
    


   

    return (

             <View> 
             <SelectList 
                setSelected={(val) => setSelected(val)} 
                data={data} 
                save="value"
                placeholder= "Select course you want to track here"
             />
            


             <ButtonMenu/>
             </View>

            

        

        
    )
}



export default StressScreen