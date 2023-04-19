
import React, {useState} from 'react';
import {Text, View,Dimensions,StyleSheet, Button, TouchableHighlight} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import ButtonMenu from '../../components/ButtonMenu';
import WeekCalendar from '../../components/WeekCalendar';
import {ArrowLeftOutlined, ArrowRightOutlined} from '@ant-design/icons';

const UntrackedScreen = () => {

    const [selected, setSelected] = React.useState("");
    const [isShowingArrow, setShowingArrow] = React.useState(false)

    const data = [
        {key:'1', value:'Meknik'},
        {key:'2', value:'Reglerteknik'},
        {key:'3', value:'Envariabelanalys'},
        ]

    const [date, setDate] = useState(new Date());

    var ourDate = new Date();

    //Change it so that it is 7 days in the past.
    var pastDate = ourDate.getDate() - 7;
    ourDate.setDate(pastDate);      

   

    const onCalendarPressed = () => {       
        setDate(ourDate)
        console.log('pressed')
        
      }

      const onCurrentDatePressed = () => {       
        setDate(new Date())
        console.log('pressed again')
      }

    return (
    <View style={styles.container}>
 
{
        isShowingArrow ?
        (
            <View style={styles.layout}>
                <TouchableHighlight onPress={() => {onCalendarPressed(true); setShowingArrow(false);}}> 
                <View>
                    <ArrowLeftOutlined style={styles.leftArrow} />
                    </View>
                    </TouchableHighlight>
                    <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />
                    <View>
                        <ArrowLeftOutlined style={styles.invisibleArrow} />
                    </View>
                </View>
         ) : (
            <View style={styles.layout}>
                <View>
                    <ArrowLeftOutlined style={styles.invisibleArrow} />
                    </View>
                    <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />
                    <TouchableHighlight onPress={() => {onCurrentDatePressed(true); setShowingArrow(true);}}> 
                    <View>
                        <ArrowRightOutlined style={styles.rightArrow} />
                    </View>
                    </TouchableHighlight>
                </View>
         )} 
    
        <View style={styles.selectListContainer}>
            <SelectList
                dropdownTextStyles={styles.selectList}
                inputStyles={styles.selectList}
                boxStyles={styles.boxStyles}
                setSelected={(val) => setSelected(val)}
                data={data}
                save="value"
                search={false}
                placeholder='Choose course'
            />
             <ButtonMenu 
             screen='timeTracking'/>
        
        </View>
    </View>
        
)
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#313131',
        height: '100%',
    },
    selectListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '3%',
       
    },
    selectList: {
        fontWeight: 'bold',
        color: '#EFEFEF',
    },
    boxStyles: {
        width: 0.9 * Dimensions.get('window').width,
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
    }

})

export default UntrackedScreen