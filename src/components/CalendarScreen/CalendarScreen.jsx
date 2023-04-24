import React, {useState} from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import CustomButton from "../CustomButton/CustomButton";
import Navigation from "../../navigation";
import { useNavigation } from "@react-navigation/native";


const CalendarScreen = () => {
    const navigation = useNavigation();
    var [firstDate, setFirstDate] = useState('');
    var [lastDate, setLastDate] = useState('');
    console.log('first date=', firstDate)
    console.log('last date=', lastDate)

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
            console.log(day)

            
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
        console.log(marked)

        return marked;
    };

    const onSelectPressed = () => {
        navigation.navigate('YourReports', {firstDate: firstDate, lastDate: lastDate})
    }
    
    return (
        <View style={styles.container}>
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
    }
})

export default CalendarScreen;