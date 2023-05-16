import React, {useState} from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Calendar } from 'react-native-calendars';
import CustomButton from "../CustomButton/CustomButton";
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
    const [filledWithZeros, setFilledWithZeros] = useState(false)

    if (filledWithZeros === true) {
        setFirstDate('');
        setLastDate('');
        alert('You have not tracked during this period, please pick other dates');
        setFilledWithZeros(false)
    } 

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

    const onSelectPressed = () => {
        if (lastDate.day - firstDate.day > 7) {
            alert('Choose up to a maximum of 7 days')
        } else {
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
            let totalTimeArray = [];
            for (let i=0; i<res.data.results.length; i++) {
                for (let j=0; j<res.data.results[0].timeStudied.length; j++) {
                    totalTimeArray.push(res.data.results[i].timeStudied[j])
                }
            }
            for (let i=0; i<totalTimeArray.length; i++) {
                if (totalTimeArray[i] != 0){
                    setFilledWithZeros(false)
                    navigation.navigate('YourReports', {firstDate: firstDate, lastDate: lastDate, courses: courses, token: token, courseIDs: courseIDs})
                } else {
                    setFilledWithZeros(true)
                }
            }
            
            })
            .catch((error) => {
            console.error(error)
            })
        }

    }
    const onArrowPressed = () => {
        navigation.navigate('ChooseReport', {token: token, courseIDs: courseIDs, courses: courses})
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