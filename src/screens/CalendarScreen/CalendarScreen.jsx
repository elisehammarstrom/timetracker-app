// This is the screen you get to first when you want to view your own reports.
// At first you have to choose a date span, this is where you do that.

import React, {useState} from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Calendar } from 'react-native-calendars';
import CustomButton from "../../components/CustomButton/CustomButton";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import BackArrow from '../../../assets/arrowBack.png';


const CalendarScreen = ({route}) => {
    const {courses} = route.params;
    const {token} = route.params;
    const {courseIDs} = route.params;

    const navigation = useNavigation();
    var [firstDate, setFirstDate] = useState('');
    var [lastDate, setLastDate] = useState('');

    // This function gets the chosen datespan when you press a first date and a lastdate.
    const getMarked = () => {
        let marked = {};
        
        marked[firstDate.dateString] = {
            startingDay: firstDate.day,
            endingDay: lastDate.day,
            color: '#80CAFF',
            textColor: '#313131',
            disabled: true
        }
        marked[lastDate.dateString] = {
            startingDay: firstDate.day,
            endingDay: lastDate.day,
            color: '#80CAFF',
            textColor: '#313131',
            disabled: true
        }
        for (let i=firstDate.day; i<=lastDate.day; i++) {
            let day = i;
            let month = firstDate.month;
            let year = firstDate.year;
            let dayLength = `${day}`.length;
            let monthLength = `${firstDate.month}`.length;

            // Depending on if the dates chosen are in the format d or dd, we want them in dd. 
            // This means that if we chose a span of days from 8-11, we want it to be 08, 09, 10, 11, and the same for months.
            if (monthLength < 2 & dayLength < 2 ) {
                marked[`${year}-0${month}-0${day}`] = {
                    startingDay: i == firstDate.day,
                    endingDay: i == lastDate.day,
                    color: '#80CAFF',
                    textColor: '#313131',
                    disabled: true
                };
            }
            else if (monthLength < 2 ) {
                marked[`${year}-0${month}-${day}`] = {
                    startingDay: i == firstDate.day,
                    endingDay: i == lastDate.day,
                    color: '#80CAFF',
                    textColor: '#313131',
                    disabled: true
                };
            }
            else if (dayLength < 2 ) {
                marked[`${year}-${month}-0${day}`] = {
                    startingDay: i == firstDate.day,
                    endingDay: i == lastDate.day,
                    color: '#80CAFF',
                    textColor: '#313131',
                    disabled: true
                };
            }
            else {
                marked[`${year}-${month}-${day}`] = {
                    startingDay: i == firstDate.day,
                    endingDay: i == lastDate.day,
                    color: '#80CAFF',
                    textColor: '#313131',
                    disabled: true
                };
            }
  
        }

        return marked;
    };
    // When you press on the 'select¨'-button
    const onSelectPressed = () => {
        // For the sake of keeping the graph clean we decided to only allow choosing a span of 7 days
        if (lastDate.day - firstDate.day > 7) {
            alert('Choose up to a maximum of 7 days')
        } else {
            // We are fetching the studytime data from backend to see if their is any data
            const formData = new FormData();
            formData.append('startDate', firstDate.dateString)
            formData.append('endDate', lastDate.dateString)
            axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/tracking/get_user_course_study_time/",
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `token ` + token
            }
            })
            .then((res) => {
            // We push the data for all the courses in to an array with the total time.
            let totalTimeArray = [];
            for (let i=0; i<res.data.results.length; i++) {
                for (let j=0; j<res.data.results[0].timeStudied.length; j++) {
                    totalTimeArray.push(res.data.results[i].timeStudied[j])
                }
            }
            // We check the sum of the array
            let sum = 0;
            for (let i=0; i<totalTimeArray.length; i++) {
                sum = sum + totalTimeArray[i];
            }
            // If the sum of the array is =0, there is no tracked data. 
            // If there is no data, the next page is worthless and therefore will only be navigate if the chosen datespan contains tracked data
            if (sum != 0) {
                navigation.navigate('YourReports', {firstDate: firstDate, lastDate: lastDate, courses: courses, token: token, courseIDs: courseIDs});
            } else {
                alert('You have not tracked during this perios, please choose another');
                setFirstDate('');
                setLastDate('');
            }
            
            })
            .catch((error) => {
            console.error(error)
            })
        }

    }
    const onArrowPressed = () => {
        navigation.navigate('Home', {token: token, courseIDs: courseIDs, courses: courses})
      }

    
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={0.5} style={styles.backArrow} onPress={onArrowPressed}>
                <Image 
                    source={BackArrow} 
                    style={[{height: 100 * 0.3}, {width: 100 * 0.3}]} 
                    resizeMode="contain"
                />
            </TouchableOpacity >
            <Text style={styles.title}>
                Choose dates to see your reports:
            </Text>
            {/* A Calendar component fetched from the react native calendar library */}
            <Calendar
                onDayPress={day => {
                    {if (day.dateString === firstDate.dateString){
                        setFirstDate('')
                        setLastDate('')
                        }
                    else {
                        {if (firstDate != 0 & day.day>firstDate.day){
                            setLastDate(day)
                            }
                        else {
                            setLastDate(firstDate)
                            setFirstDate(day)
                        }}
                    }
                    };
                }}
                enableSwipeMonths={true}
                markingType={'period'}
                markedDates={getMarked()}
                style={styles.calendar}
                theme={{
                    dayTextColor: '#EFEFEF',
                    monthTextColor: '#EFEFEF',
                    calendarBackground: '#313131'
                }}
            />
            <View style={styles.button}>
                <CustomButton
                    text="Select"
                    onPress={onSelectPressed}
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#313131',
        justifyContent: 'center',
    },
    calendar: {
        backgroundColor: '#313131',
        color: '#EFEFEF',
    },
    button: {
        padding: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
        justifyContent: 'flex-start'
    },
    backArrow: {
        width: '10%',
        padding: 10
    },
})

export default CalendarScreen;