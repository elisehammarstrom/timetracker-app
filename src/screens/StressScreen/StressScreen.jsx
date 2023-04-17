
import { useNavigation } from '@react-navigation/native';
import React, {useState, useRef} from 'react';
import {Text, View, TextInput, StyleSheet, FlatList, Image,TouchableOpacity} from 'react-native';
import ButtonMenu from '../../components/ButtonMenu';
import { SelectList } from 'react-native-dropdown-select-list'
import DatePicker from 'react-native-modern-datepicker';
import ett from '../../../assets/1.png';










const StressScreen = () => {  

    const [selectedDate, setSelectedDate] = useState('');
    
    
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

<Image 
                source={ett} 
               
            />

           

      <DatePicker
      onSelectedChange={date => setSelectedDate(date)}
      current="2023-04-17"
      selected="2023-04-17"
      mode = 'calendar'
      style={{ borderRadius: 2, height: 250, width: 250 }}
      
      
      />

                
            


             <ButtonMenu/>
             </View>

            

        

        
    )
}



export default StressScreen

