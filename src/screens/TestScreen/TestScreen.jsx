
import {useState, useEffect} from 'react'
import {FlatList, View, Text, StyleSheet} from 'react-native'
import React from 'react'
import {Picker} from '@react-native-picker/picker';
import DropDown from '../../components/DropDown';

export default function TestScreen() {
const [courses, setCourses] = useState ( [ ] ) ;
const [selectedItem, setSelectedItem] = useState(null);

/* const [pickerValue, setPickerValue] = useState('råtta')
 */
let fruits = [
    {id: 1, name: 'mango'},
    {id: 2, name: 'banana'},
    {id: 3, name: 'cherry'}
]

const onSelect = (item) => {
    setSelectedItem(item)
}


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

    <DropDown
        value={selectedItem}
        data={fruits}
        onSelect={onSelect}
    />

            {/* <Picker
              style={styles.picker}
              selectedValue = {pickerValue}
              onValueChange = {(itemValue) => (setPickerValue(itemValue))}
              >
                <Picker.Item label ='Råtta' value='råtta'/>
                <Picker.Item label ='Åsna' value='åsna'/>
                <Picker.Item label ='Berit' value='berit'/>

              </Picker> */}
{/* <FlatList
data={courses}
renderItem={ ( {item} ) => (
<Text key={item.id}> {item.courseTitle} </Text>
) }

/> */}
</View>

);}

const styles = StyleSheet.create({

picker: {
    width: 200,
    height: 1,
    backgroundColor: 'red'

  }, 
})

 

