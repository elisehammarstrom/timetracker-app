
import { useState, useEffect } from 'react'
import { FlatList, View, Text, StyleSheet } from 'react-native'
import React from 'react'
import ClickableWeekCalendar from '../../components/ClickableWeekCalendar';
import WeekCalendar from '../../components/WeekCalendar';

export default function TestScreen() {
    const [courses, setCourses] = useState([]);
    const [date, setDate] = useState(new Date());
    /* const onCalendarPressed = () => {
        setDate(ourDate)
    
    }
    
    const onCurrentDatePressed = () => {
        setDate(new Date())
    }
     */
    /* const [pickerValue, setPickerValue] = useState('råtta')
     */


    useEffect(() => {

        fetch('http://127.0.0.1:8000/api/courses/', {
            method: 'GET',
            Headers: {
                'Authorization': `Token 5e8cf830b92a2b0308348a1fdf52dcd48f3b832e`
            }

        })
            .then(res => res.json())
            .then(jsonRes => setCourses(jsonRes))
        //.catch(error = console.log(error) );
    }, []);



    return (
        <View>
            <ClickableWeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />

        </View>

    );
}

const styles = StyleSheet.create({

    picker: {
        width: 200,
        height: 1,
        backgroundColor: 'red'

    },
})



