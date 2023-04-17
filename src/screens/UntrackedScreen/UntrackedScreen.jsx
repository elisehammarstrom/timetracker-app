
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import DatePicker from 'react-native-modern-datepicker';
import ButtonMenu from '../../components/ButtonMenu';

const UntrackedScreen = () => {

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

           

      <DatePicker
      onSelectedChange={date => setSelectedDate(date)}
      current="2023-04-17"
      selected="2023-04-17"
      minuteInterval={15}
      style={{ borderRadius: 2, height: 250, width: 250 }}
      onTimeChange={selectedTime => setTime(selectedTime)}
      
      />

                
            


             <ButtonMenu/>
            
        

        </View>
    )
}

export default UntrackedScreen