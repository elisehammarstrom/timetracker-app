
import { useNavigation } from '@react-navigation/native';
import React, {useState, useRef, useEffect} from 'react';
import {Text, View, TextInput, StyleSheet, FlatList, Image,TouchableOpacity} from 'react-native';
import ButtonMenu from '../../components/ButtonMenu';
import { SelectList } from 'react-native-dropdown-select-list'
import DatePicker from 'react-native-modern-datepicker';





const StressScreen = () => {  

    const [selectedDate, setSelectedDate] = useState('');
    
    
    const [selected, setSelected] = React.useState("");
  
    const data = [
    {key:'1', value:'Meknik'},
    {key:'2', value:'Reglerteknik'},
    {key:'3', value:'Envariabelanalys'},
    ]
    
    const [courses, setCourses] = useState ( [ ] ) ;

    useEffect ( () => {

        fetch('http://127.0.0.1:8000/api/courses/', {
        method: 'GET', 
        Headers: {
            'Authorization': `Token 5e8cf830b92a2b0308348a1fdf52dcd48f3b832e`
            }
            
    })
        .then(res => res.json())
        .then(jsonRes => setCourses(jsonRes) ) 
        //.catch(error = console.log(error) );

    }, [] );
   

    return (

             <View> 
           <SelectList 
                setSelected={(val) => setSelected(val)} 
                data = {data}
                save="value"
                placeholder= "Select course you want to track here"
                renderItem = {({item}) => (item.courseTitle)}
             />


<FlatList
data={courses}
renderItem={ ( {item} ) => (
<Text key={item.id}> {item.courseTitle}</Text>

)

}

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

