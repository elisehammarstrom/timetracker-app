
import React, {useState} from 'react';
import {Text, View,Dimensions,StyleSheet, Button, TouchableHighlight, TouchableOpacity, Image} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import ButtonMenu from '../../components/ButtonMenu';
import WeekCalendar from '../../components/WeekCalendar';
/* import {ArrowLeftOutlined, ArrowRightOutlined} from '@ant-design/icons'; */
import CustomButton from '../../components/CustomButton';
import LeftArrow from '../../../assets/left-arrow.png'
import RightArrow from '../../../assets/right-arrow.png'
import Invisible from '../../../assets/invisible-box.png'




const UntrackedScreen = ({route}) => {
    const {courses} = route.params;
    const {token} = route.params;

    const [selectedCourse, setSelectedCourse] = React.useState("");
    const [selectedHour, setSelectedHour] = React.useState("");
    const [selectedMinute, setSelectedMinute] = React.useState("");

    const [isShowingArrow, setShowingArrow] = React.useState(true)


    const hourData = [
        {key:'1', value:'00'},
        {key:'2', value:'01'},
        {key:'3', value:'02'},
        {key:'4', value:'03'},
        {key:'5', value:'04'},
        {key:'6', value:'05'},
        {key:'7', value:'06'},
        {key:'8', value:'07'},
        {key:'9', value:'08'},
        {key:'10', value:'09'},
        {key:'11', value:'10'},
    ]

    const minuteData = [
        {key:'1', value:'00'},
        {key:'2', value:'15'},
        {key:'3', value:'30'},
        {key:'4', value:'45'},
    ]

    const [date, setDate] = useState(new Date());

    var ourDate = new Date();

    //Change it so that it is 7 days in the past.
    var pastDate = ourDate.getDate() - 7;
    ourDate.setDate(pastDate);      

   

    const onCalendarPressed = () => {       
        setDate(ourDate)
        
      }

    const onCurrentDatePressed = () => {       
    setDate(new Date())
    }

    const onAddTimePressed = () => {
        console.log(selectedHour,':', selectedMinute)
        alert('Time tracked')
        setSelectedHour('')
        setSelectedMinute('')
        
    }

    return (
    <View style={styles.container}>
 
        {
            isShowingArrow ?
            (
                <View style={styles.layout}>
                    <TouchableHighlight onPress={() => {onCalendarPressed(true); setShowingArrow(false);}}> 
                        <Image 
                            source={LeftArrow} 
                            style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
                            resizeMode="contain"
                        />
                    </TouchableHighlight>

                    <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />
                    <View>
                        <Image 
                            source={Invisible} 
                            style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
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
                            style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
                            resizeMode="contain"
                        />
                    </View>

                    <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />

                    <TouchableHighlight onPress={() => {onCurrentDatePressed(true); setShowingArrow(true);}}> 
                        <Image 
                            source={RightArrow} 
                            style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
                            resizeMode="contain"
                        />
                    </TouchableHighlight>
                </View>
            )
        } 

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
            />
        </View>
        <View style={styles.timeLayout}>
            <View style={styles.selectListTimeContainer}>
                <Text style={styles.addTime}>Add time:</Text>
                <View>
               
            
                </View>
    
                <SelectList
                    dropdownTextStyles={styles.selectList}
                    inputStyles={styles.selectList}
                    boxStyles={styles.boxTimeStyles}
                    setSelected={(val) => setSelectedHour(val)}
                    data={hourData}
                    save="value"
                    search={false}
                    placeholder='00'
                    dropdownStyles={{width: 0.18 * Dimensions.get('window').width, border: 'none'}}
                    
                />
                <Text style={{color: 'white', fontSize: 30}}>:</Text>

                <SelectList
                    dropdownTextStyles={styles.selectList}
                    inputStyles={styles.selectList}
                    boxStyles={styles.boxTimeStyles}
                    setSelected={(val) => setSelectedMinute(val)}
                    data={minuteData}
                    save="value"
                    search={false}
                    placeholder='00'
                    dropdownStyles={{width: 0.18 * Dimensions.get('window').width, border: 'none'}}
                />
            </View>
        </View>

        <View style={styles.customButtonContainer}>
            <CustomButton
                text="Add time"
                onPress={onAddTimePressed}
            />
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
        marginTop: '3%',
        flexDirection: 'row',
        borderRadius: 20,
        border: 'solid',
        borderColor: 'red',
        width: '60%',
    },
    selectList: {
        fontWeight: 'bold',
        color: '#EFEFEF',
    },
    boxStyles: {
        width: 0.75 * Dimensions.get('window').width,
    },
    boxTimeStyles: {
        width: 0.18 * Dimensions.get('window').width,
        borderStyle: 'none'
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
        marginBottom: 50,
        justifyContent: 'flex-start'
    },
    dateButton: {
        marginRight: '2%',
        width:100, 
    },
    logo: {
        width: '70%',
        maxWidth: 300,
        maxHeight: 200,  
        flexDirection:'row',
    },
    text:{
        marginLeft:220,
        flexDirection:'row',
        position: "absolute",
        marginTop:23,
        fontsize:20,
        fontWeight:'bold',
        color: 'white',
    },
    layout: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rightArrow: {
        color: 'white', 
        height: 20, 
        width: 20,
        marginTop: 20,
        padding: 20,
    },
    leftArrow: {
        color: 'white', 
        height: 20, 
        width: 20,
        marginTop: 20,
        padding: 20,
    },
    invisibleArrow: {
        color: '#313131', 
        height: 20, 
        width: 20,
        marginTop: 20,
        padding: 20,
    },
    plusIcon: {
        color: 'white',
        padding: 20,
    },
    minusIcon: {
        color: 'white',
        padding: 20,
    },
    addTime: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: 12,
        paddingLeft: 13,
    },
    timeLayout: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    customButtonContainer: {
        paddingHorizontal: 50,
        marginTop: 30,
      },

})

export default UntrackedScreen