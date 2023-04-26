
import { useNavigation } from '@react-navigation/native';
import React, {useState, useRef, useEffect} from 'react';
import {Text, View, TextInput, StyleSheet, FlatList, Image,TouchableOpacity,Dimensions,Button, Alert, PixelRatio} from 'react-native';
import ButtonMenu from '../../components/ButtonMenu';
import { SelectList } from 'react-native-dropdown-select-list'
import CustomButton from '../../components/CustomButton';
import Ett from '../../../assets/ett.png'
import Två from '../../../assets/2.png'
import Tre from '../../../assets/3.png'
import Fyra from '../../../assets/4.png'
import Fem from '../../../assets/5.png'

const StressScreen = () => {  

    const navigation = useNavigation();
    
    const [selectedDate, setSelectedDate] = useState('');
    const [selected, setSelected] = useState("");
    const [isShowingImage, setShowingImage] = React.useState(false);
 /*    const [date, setDate] = useState(null); */
    
   
    const data = [
    {key:'1', value:'Mekanik'},
    {key:'2', value:'Reglerteknik'},
    {key:'3', value:'Envariabelanalys'},
 ]

    // get today's date
    var date = new Date().getDate(); //To get the Current Date
    var month = new Date().getMonth() + 1; //To get the Current Month
    var year = new Date().getFullYear(); //To get the Current Year

    var days = [,'Mon','Tue','Wed','Thu','Fri','Sat', 'Sun'];

    Date.prototype.getDayName = function() {
        return days[ this.getDay() ];
    };

    var now = new Date();

    var day = now.getDayName();

    const onSettingsPressed = () => {
        navigation.navigate('Profile')
        console.log('pressed')
    };

    const [selectedValue, setSelectedValue] = useState("");
    const [pressed1, setPressed1] = useState(false);
    const [pressed2, setPressed2] = useState(false);
    const [pressed3, setPressed3] = useState(false);
    const [pressed4, setPressed4] = useState(false);
    const [pressed5, setPressed5] = useState(false);

    

    
    const onSubmitPressed = () => {
        let stressTracked = {
            course: selected,
            date: date + "-" + month +"-" + year,
            stress: selectedValue
        }
        if (stressTracked.course === ''){
            alert('Please choose a course')
        }
        if (stressTracked.stress === ''){
            alert('Please track your stress before submitting')
        }
        if (stressTracked.course != '' & stressTracked.stress != ''){
            alert('Stress tracked!')
            console.log(stressTracked)
            setPressed1(false)
            setPressed2(false)
            setPressed3(false)
            setPressed4(false)
            setPressed5(false)
            setSelectedValue('')
        }
    }
    return (

    <View style={styles.container}>
        <Text style={styles.day}>{day}</Text>
        <View style={styles.layout}>
        
            <View style={styles.circle}>
                <Text style={styles.date}>{date}</Text>
            </View>
            
           
            <View style={styles.selectListContainer}>
                <SelectList
                    dropdownTextStyles={styles.selectList}
                    inputStyles={styles.selectList}
                    setSelected={(val) => setSelected(val)}
                    data={data}
                    save="value"
                    search={false}
                    placeholder='Choose course'
                />
            </View>
        </View>

        <View style={styles.smileys}>
      
            <TouchableOpacity activeOpacity={0.5} onPress={() => {setSelectedValue("1"), setPressed1(true), setPressed2(false),setPressed3(false),setPressed4(false), setPressed5(false)}} style={pressed1 ? styles.pressed : styles.notPressed} >
                <Image 
                    source={Ett} 
                    style={[ {height: 200 * 0.3}, {width: 200*0.3}, {marginBottom:10}]} 
                    resizeMode="contain"
                />
                <Text style={styles.text}> Stressfree day </Text>
            
            </TouchableOpacity>


            <TouchableOpacity activeOpacity={0.5} onPress={() => {setSelectedValue("2"), setPressed1(false), setPressed2(true),setPressed3(false),setPressed4(false), setPressed5(false)}} style={pressed2 ? styles.pressed : styles.notPressed} >
                <Image 
                    source={Två} 
                    style={[{height: 200 * 0.3},{width: 200*0.3},{marginBottom:10}]} 
                    resizeMode="contain"
                />
                <Text style={styles.text}> Today was not so stressful </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} onPress={() => {setSelectedValue("3"), setPressed1(false), setPressed2(false),setPressed3(true),setPressed4(false), setPressed5(false)}} style={pressed3 ? styles.pressed : styles.notPressed}>
                <Image 
                    source={Tre} 
                    style={[ {height: 200 * 0.3},{width: 200*0.3}, {marginBottom:10}]} 
                    resizeMode="contain"
                />
                <Text style={styles.text}> I felt a bit stressed today</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.5} onPress={() => {setSelectedValue("4"), setPressed1(false), setPressed2(false),setPressed3(false),setPressed4(true), setPressed5(false)}} style={pressed4 ? styles.pressed : styles.notPressed}>
                <Image 
                    source={Fyra} 
                    style={[{height: 200 * 0.3},{width: 200*0.3},{marginBottom:10}]} 
                    resizeMode="contain"

                />
                <Text style={styles.text}> Today was very stressful </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5} onPress={() => {setSelectedValue("5"), setPressed1(false), setPressed2(false),setPressed3(false),setPressed4(false), setPressed5(true)}} style={pressed5 ? styles.pressed : styles.notPressed}>
                <Image 
                    source={Fem} 
                    style={[{height: 200 * 0.3}, {width: 200*0.3}]} 
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
   
        <View>

            <ButtonMenu
                screen='timeTracking'
            />
            </View>

        </View>
  
)}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#313131',
        height: '100%',
        justifyContent: 'space-between',
    },
    layout: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    smileys: {
        flexDirection: 'column',
        // marginLeft: 40,
        paddingHorizontal: 50

    },
    selectListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        
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
    dateButton: {
        marginRight: '2%',
        width:100,
        
    },

    date: {
        color: 'white',
        fontSize: 20,
    
    },
    day: {
        color: 'white',
        marginLeft: 18,
        marginBottom: -30,
        marginTop: 5,
    },
    circle: {
        height: 40,
        width: 40,
        borderRadius: 40 / PixelRatio.get(),
        backgroundColor: '#0376C2',
        marginTop: 30,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text:{
        position: "absolute",
        marginLeft: 80,
        marginTop:23,
        fontsize:20,
        fontWeight:'bold',
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
        settings: {
            color: 'white',
            height: 40,
            width: 40,
        }

})




export default StressScreen

