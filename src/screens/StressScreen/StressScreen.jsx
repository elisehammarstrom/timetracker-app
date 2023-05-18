// The screen where the student can track their stress each day for each course. 
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, PixelRatio, ScrollView, Dimensions } from 'react-native';
import ButtonMenu from '../../components/ButtonMenu';
import { SelectList } from 'react-native-dropdown-select-list'
import CustomButton from '../../components/CustomButton';
import Ett from '../../../assets/ett.png'
import Två from '../../../assets/2.png'
import Tre from '../../../assets/3.png'
import Fyra from '../../../assets/4.png'
import Fem from '../../../assets/5.png'
import ArrowBack from '../../../assets/arrowBack.png'
import axios from 'axios';


const StressScreen = ({ route }) => {
    const { courses } = route.params;
    const { token } = route.params;
    const { courseIDs } = route.params;

    const navigation = useNavigation();
    const [selected, setSelected] = useState("");

    // get today's date
    var thisDay = new Date().getDate(); //To get the Current Date
    var month = new Date().getMonth() + 1; //To get the Current Month
    var year = new Date().getFullYear(); //To get the Current Year
    const [thisDate, setThisDate] = useState('');

    // Giving the date the right format we need for sending it to the database; YYYY-MM-DD
    if (thisDate.length < 1) {
        if (`${thisDay}`.length === 1 & `${month}`.length === 1) {
            setThisDate(year + '-0' + month + '-0' + thisDay)
        }
        else if (`${day}`.length === 1) {
            setThisDate(year + '-' + month + '-0' + thisDay)
        }
        else if (`${month}`.length === 1) {
            setThisDate(year + '-0' + month + '-' + thisDay)
        }
        else {
            setThisDate(year + '-' + month + '-' + thisDay)

        }
    }
    // For the little circle displaying the day
    var days = [, 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    Date.prototype.getDayName = function () {
        return days[this.getDay()];
    };
    var now = new Date();
    var day = now.getDayName();

    // Set which stresslevel the student picks.
    const [selectedValue, setSelectedValue] = useState("");
    const [pressed1, setPressed1] = useState(false);
    const [pressed2, setPressed2] = useState(false);
    const [pressed3, setPressed3] = useState(false);
    const [pressed4, setPressed4] = useState(false);
    const [pressed5, setPressed5] = useState(false);

    const onClosedPress = () => {
        navigation.navigate('Home', { options: courses, token: token })
    }

    const onSubmitPressed = () => {

        let checkedID = [];
        for (let i = 0; i < courses.length; i++) {
            if (selected === courses[i]) {
                checkedID.push(courseIDs[i])// The database need the courseID, and not the name of the course
            }
        }
        let stressTracked = {
            course: checkedID[0],
            date: thisDate,
            stress: selectedValue
        }
        console.log("stressTracked.course= ", stressTracked.course)
        if (stressTracked.course === undefined) {
            alert('Please choose a course')
        }
        if (stressTracked.stress === '') {
            alert('Please track your stress before submitting')
        }
        if (stressTracked.course != undefined & stressTracked.stress != '') {
            alert('Stress tracked!')
            setPressed1(false)
            setPressed2(false)
            setPressed3(false)
            setPressed4(false)
            setPressed5(false)
            setSelectedValue('')
        }
        //Sending the tracked stress to the database

        const formData = new FormData();
        formData.append('courseID', stressTracked.course);
        formData.append('stress', stressTracked.stress);
        formData.append('date', stressTracked.date)

        // posting the stress to the database
        axios({
            method: "post",
            url: "http://127.0.0.1:8000/api/tracking/track_stress/",
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `token ` + token
            }
        })
            .then(function (response) {
                //handle success
                console.log(response.data);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
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
                <Text style={styles.title}>Track your stress today</Text>
                <View style={styles.dailyContainer}>
                    <Text style={styles.day}>{day}</Text>
                    <View>
                        <View style={styles.circle}>
                            <Text style={styles.date}>{thisDay}</Text>
                        </View>
                    </View>
                </View>

            </View>
            <ScrollView>
                <View style={styles.layout}>


                    <View style={styles.selectListContainer}>
                        <SelectList
                            dropdownTextStyles={styles.selectList}
                            dropdownStyles={styles.dropDown}
                            inputStyles={styles.selectList}
                            setSelected={(val) => setSelected(val)}
                            data={courses}
                            save="value"
                            search={false}
                            placeholder='Choose course to track'
                            boxStyles={styles.boxStyle}
                        />
                    </View>
                </View>

                <View style={styles.smileys}>

                    <TouchableOpacity activeOpacity={0.5} onPress={() => { setSelectedValue("1"), setPressed1(true), setPressed2(false), setPressed3(false), setPressed4(false), setPressed5(false) }} style={pressed1 ? styles.pressed : styles.notPressed} >
                        <Image
                            source={Ett}
                            style={[{ height: 200 * 0.3 }, { width: 200 * 0.3 }, { marginBottom: 10 }]}
                            resizeMode="contain"
                        />
                        <Text style={styles.text}> Stressfree day </Text>

                    </TouchableOpacity>


                    <TouchableOpacity activeOpacity={0.5} onPress={() => { setSelectedValue("2"), setPressed1(false), setPressed2(true), setPressed3(false), setPressed4(false), setPressed5(false) }} style={pressed2 ? styles.pressed : styles.notPressed} >
                        <Image
                            source={Två}
                            style={[{ height: 200 * 0.3 }, { width: 200 * 0.3 }, { marginBottom: 10 }]}
                            resizeMode="contain"
                        />
                        <Text style={styles.text}> Today was not so stressful </Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => { setSelectedValue("3"), setPressed1(false), setPressed2(false), setPressed3(true), setPressed4(false), setPressed5(false) }} style={pressed3 ? styles.pressed : styles.notPressed}>
                        <Image
                            source={Tre}
                            style={[{ height: 200 * 0.3 }, { width: 200 * 0.3 }, { marginBottom: 10 }]}
                            resizeMode="contain"
                        />
                        <Text style={styles.text}> I felt a bit stressed today</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.5} onPress={() => { setSelectedValue("4"), setPressed1(false), setPressed2(false), setPressed3(false), setPressed4(true), setPressed5(false) }} style={pressed4 ? styles.pressed : styles.notPressed}>
                        <Image
                            source={Fyra}
                            style={[{ height: 200 * 0.3 }, { width: 200 * 0.3 }, { marginBottom: 10 }]}
                            resizeMode="contain"

                        />
                        <Text style={styles.text}> Today was very stressful </Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5} onPress={() => { setSelectedValue("5"), setPressed1(false), setPressed2(false), setPressed3(false), setPressed4(false), setPressed5(true) }} style={pressed5 ? styles.pressed : styles.notPressed}>
                        <Image
                            source={Fem}
                            style={[{ height: 200 * 0.3 }, { width: 200 * 0.3 }]}
                            resizeMode="contain"
                        />
                        <Text style={styles.text}> Extremely stressful day </Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.customButtonContainer}>
                    <CustomButton
                        text="Submit"
                        onPress={onSubmitPressed}
                    />
                </View>
            </ScrollView>

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
        justifyContent: 'space-between',
    },
    layout: {
        flexDirection: 'row',
        justifyContent: 'center',

    },
    smileys: {
        flexDirection: 'column',
        paddingHorizontal: 50,
        paddingTop: 30,
        paddingBottom: 30

    },
    selectListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 5,
        marginTop: 10,

    },
    selectList: {
        fontWeight: 'bold',
        color: '#EFEFEF',


    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
        marginBottom: 50,
        justifyContent: 'flex-start'
    },

    date: {
        color: 'white',
        fontSize: 20,

    },
    day: {
        color: 'white',
        alignSelf: 'center',
        marginTop: 10,
    },
    circle: {
        height: 40,
        width: 40,
        borderRadius: 40 / PixelRatio.get(),
        backgroundColor: '#0376C2',
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        position: "absolute",
        marginLeft: 80,
        marginTop: 23,
        fontsize: 20,
        fontWeight: 'bold',
        color: 'white',
        alignItems: 'flex-start',
    },
    customButtonContainer: {
        paddingHorizontal: 50,
        marginTop: 10,
    },
    pressed: {
        backgroundColor: '#606060',
        borderRadius: 10,
    },
    notPressed: {
        backgroundColor: 'transparent'
    },
    topContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
    },
    dailyContainer: {
        marginTop: -15
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
    },

    boxStyle: {
        backgroundColor: '#0376C2',
        width: 0.75 * Dimensions.get('window').width
    },
    dropDown: {
        backgroundColor: '#0376C2',
        width: 0.75 * Dimensions.get('window').width

    }

})




export default StressScreen

