
import {useState, useEffect} from 'react'
import {FlatList, View, Text} from 'react-native'
import React from 'react'

export default function TestScreen() {
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
<FlatList
data={courses}
renderItem={ ( {item} ) => (
<Text key={item.id}> {item.courseTitle} </Text>
) }

/>
</View>

);}

 

