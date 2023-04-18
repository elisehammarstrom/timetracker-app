
import { useNavigation } from '@react-navigation/native';
import React, {useState, useRef, useEffect} from 'react';
import {Text, View, TextInput, StyleSheet, FlatList, Image,TouchableOpacity,Dimensions,Button, Alert, PixelRatio} from 'react-native';
import ButtonMenu from '../../components/ButtonMenu';
import { SelectList } from 'react-native-dropdown-select-list'
import DatePicker from 'react-native-modern-datepicker'
import CustomButton from '../../components/CustomButton';
import Ett from '../../../assets/ett.png'
import Två from '../../../assets/2.png'
import Tre from '../../../assets/3.png'
import Fyra from '../../../assets/4.png'
import Fem from '../../../assets/5.png'
import { setDate } from 'date-fns/esm';
import ProfileIcon from '../../components/ProfileIcon/ProfileIcon';

const StressScreen = () => {  
    
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
            <View><ProfileIcon> </ProfileIcon></View>
        </View>

        <View style={styles.smileys}>
      
            <TouchableOpacity activeOpacity={0.5}>
            <Image 
                source={Ett} 
                style={[ {height: 200 * 0.3}, {width: 200*0.3}, {marginBottom:10}]} 
                resizeMode="contain"
            />
                    <Text style={styles.text}> Stressfree day </Text>
            
        </TouchableOpacity>


        <TouchableOpacity activeOpacity={0.5}>
            <Image 
                source={Två} 
                style={[{height: 200 * 0.3},{width: 200*0.3},{marginBottom:10}]} 
                resizeMode="contain"
            />
            <Text style={styles.text}> Today was not so stressfull </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5}>
            <Image 
                source={Tre} 
                style={[ {height: 200 * 0.3},{width: 200*0.3}, {marginBottom:10}]} 
                resizeMode="contain"
            />
            <Text style={styles.text}> I felt a bit stressed today</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.5}>
            <Image 
                source={Fyra} 
                style={[{height: 200 * 0.3},{width: 200*0.3},{marginBottom:10}]} 
                resizeMode="contain"

            />
            <Text style={styles.text}> Today was very stressful </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5}>
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
            /></View>
   
           

            <ButtonMenu
             screen='timeTracking'/>

        </View>
  
)}


    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#313131',
            height: '100%',
            
        },
        layout: {
            flexDirection: 'row',
            justifyContent: 'space-between',

        },
        smileys: {
            flexDirection: 'column',
            marginLeft: 7,

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
          },
    
    })




export default StressScreen

