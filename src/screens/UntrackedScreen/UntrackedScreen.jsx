// This is the screen where you add untracked time

import React, { useState } from 'react';
import { Text, View, Dimensions, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import ButtonMenu from '../../components/ButtonMenu';
import ClickableWeekCalendar from '../../components/ClickableWeekCalendar';
import CustomButton from '../../components/CustomButton';
import LeftArrow from '../../../assets/left-arrow.png'
import RightArrow from '../../../assets/right-arrow.png'
import Invisible from '../../../assets/invisible-box.png'
import ArrowBack from '../../../assets/arrowBack.png'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


const UntrackedScreen = ({ route }) => {
    const { courses } = route.params;
    const { token } = route.params;
    const { courseIDs } = route.params;

    const [selectedCourse, setSelectedCourse] = React.useState("");
    const [selectedHour, setSelectedHour] = React.useState("00");
    const [selectedMinute, setSelectedMinute] = React.useState("00");
    const [isShowingArrow, setShowingArrow] = React.useState(true)
    const navigation = useNavigation();

    //The times you can pick to add
    const hourData = [
        { key: '1', value: '00' },
        { key: '2', value: '01' },
        { key: '3', value: '02' },
        { key: '4', value: '03' },
        { key: '5', value: '04' },
        { key: '6', value: '05' },
        { key: '7', value: '06' },
        { key: '8', value: '07' },
        { key: '9', value: '08' },
        { key: '10', value: '09' },
        { key: '11', value: '10' },
    ]

    const minuteData = [
        { key: '1', value: '00' },
        { key: '2', value: '15' },
        { key: '3', value: '30' },
        { key: '4', value: '45' },
    ]

    const [date, setDate] = useState(new Date());

    var ourDate = new Date();

    //Change it so that it is 7 days in the past.
    var pastDate = ourDate.getDate() - 7;
    ourDate.setDate(pastDate);

    const onCalendarPressed = () => {
        setDate(ourDate)
    }

    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    if (month && day < 10) {
        var month = '0' + month
        var day = '0' + day
        var newDate = year + '-' + month + '-' + day
        console.log(newDate)
        console.log('type:', typeof (newDate))
    }
    else if (day < 10) {
        var day = '0' + day
        var newDate = year + '-' + month + '-' + day
        console.log(newDate)
        console.log('type:', typeof (newDate))
    }
    else if (month < 10) {
        var month = '0' + month
        var newDate = year + '-' + month + '-' + day
        console.log(newDate)
        console.log('type:', typeof (newDate))
    }
    else {
        var newDate = year + '-' + month + '-' + day
        console.log(newDate)
        console.log('type:', typeof (newDate))
    }

    const onClosedPress = () => {
        navigation.navigate('Home', { options: courses, token: token })
    }

    const onCurrentDatePressed = () => {
        setDate(new Date())
    }

    const onAddTimePressed = () => {
        // We do a for-loop to get the right courseID for the selected course
        for (let i = 0; i < courses.length; i++) {
            if (selectedCourse === courses[i]) {
                let time = selectedHour + ':' + selectedMinute + ':' + '00';
                console.log("date= ", newDate)
                const formData = new FormData();
                formData.append('courseID', courseIDs[i]);
                formData.append('date', newDate);
                formData.append('duration', time);

                axios({
                    method: "post",
                    url: "http://127.0.0.1:8000/api/tracking/add_untracked_time/",
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `token ` + token
                    }
                })
                    .then(function (response) {
                        //handle success
                        console.log(response.data);
                        alert('Time tracked');

                    })
                    .catch(function (response) {
                        //handle error
                        console.log(response);
                    });


            }
        }


    }

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TouchableOpacity activeOpacity={0.5} style={styles.close} onPress={onClosedPress} >
                    <Image
                        source={ArrowBack}
                        style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.title}>Add untracked time</Text>
            </View>

            {
                isShowingArrow ?
                    (
                        <View style={styles.layout}>
                            <TouchableOpacity onPress={() => { onCalendarPressed(true); setShowingArrow(false); }}>
                                <Image
                                    source={LeftArrow}
                                    style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>

                            <View style={styles.calendar}>
                                <ClickableWeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />

                            </View>
                            <View>
                                <Image
                                    source={Invisible}
                                    style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                    )
                    :
                    (
                        <View style={styles.layout}>
                            <View>
                                <Image
                                    source={Invisible}
                                    style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={{ paddingHorizontal: 10 }}>
                                <ClickableWeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />
                            </View>

                            <TouchableOpacity onPress={() => { onCurrentDatePressed(true); setShowingArrow(true); }}>
                                <Image
                                    source={RightArrow}
                                    style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    )
            }

            <ScrollView>
                <View style={styles.selectListContainer}>
                    <SelectList
                        dropdownTextStyles={styles.selectList}
                        inputStyles={styles.selectList}
                        boxStyles={styles.boxStyles}
                        setSelected={(val) => setSelectedCourse(val)}
                        data={courses}
                        save="value"
                        search={false}
                        placeholder='Choose course'
                        dropdownStyles={styles.dropDown}
                    />
                </View>



                <View style={styles.timeLayout}>
                    <View style={styles.selectListTimeContainer}>
                        <Text style={styles.addTime}>Add time:</Text>

                        <SelectList
                            dropdownTextStyles={styles.selectList}
                            inputStyles={styles.selectList}
                            boxStyles={styles.boxTimeStyles}
                            setSelected={(val) => setSelectedHour(val)}
                            data={hourData}
                            save="value"
                            search={false}
                            placeholder='00'
                            dropdownStyles={{ width: 0.18 * Dimensions.get('window').width, borderColor: '#313131' }}

                        />
                        <Text style={{ color: 'white', fontSize: 30 }}>:</Text>

                        <SelectList
                            dropdownTextStyles={styles.selectList}
                            inputStyles={styles.selectList}
                            boxStyles={styles.boxTimeStyles}
                            setSelected={(val) => setSelectedMinute(val)}
                            data={minuteData}
                            save="value"
                            search={false}
                            placeholder='00'
                            dropdownStyles={{ width: 0.18 * Dimensions.get('window').width, borderColor: '#313131' }}
                        />
                    </View>
                </View>

                <View style={styles.customButtonContainer}>
                    <CustomButton
                        text="Add time"
                        onPress={onAddTimePressed}
                    />
                </View>
            </ScrollView>



            <View>

            </View>
            <View>

                <ButtonMenu
                    screen='timeTracking'
                    token={token}
                />
            </View>

        </View>

    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#313131',
        height: '100%',
        alignitems: 'center',
        justifyContent: 'space-between',
    },
    selectListContainer: {
        justifyContent: 'center',
        marginTop: '3%',
        flexDirection: 'row',
    },
    selectListTimeContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 20,
        borderColor: 'white',
        borderWidth: 0.5

    },
    selectList: {
        fontWeight: 'bold',
        color: '#EFEFEF',

    },
    boxStyles: {
        width: 0.75 * Dimensions.get('window').width,
        backgroundColor: '#0376C2'
    },
    boxTimeStyles: {
        width: 0.18 * Dimensions.get('window').width,
        borderColor: '#313131'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,

    },
    dateButton: {
        marginRight: '2%',
        width: 100,
    },
    logo: {
        width: '70%',
        maxWidth: 300,
        maxHeight: 200,
        flexDirection: 'row',
    },
    text: {
        marginLeft: 220,
        flexDirection: 'row',
        position: "absolute",
        marginTop: 23,
        fontsize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    layout: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addTime: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 12,
        paddingLeft: 13,
    },
    timeLayout: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10%'
    },
    customButtonContainer: {
        paddingHorizontal: 50,
        marginTop: '20%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
        flex: 2.5
    },
    topContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,

    },
    close: {
        flex: 0.5,
    },
    calendar: {
        paddingHorizontal: 10,
    },
    middleContainer: {
        justifyContent: 'space-between',
        backgroundColor: 'red'
    },
    dropDown: {
        backgroundColor: '#0376C2'
    }

})

export default UntrackedScreen