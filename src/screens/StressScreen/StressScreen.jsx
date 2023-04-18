
import { useNavigation } from '@react-navigation/native';
import React, {useState, useRef, useEffect} from 'react';
import {Text, View, TextInput, StyleSheet, FlatList, Image,TouchableOpacity,Dimensions,Button} from 'react-native';
import ButtonMenu from '../../components/ButtonMenu';
import { SelectList } from 'react-native-dropdown-select-list'
import DatePicker from 'react-native-modern-datepicker'
import CustomButton from '../../components/CustomButton';
import Ett from '../../../assets/ett.png'
import Två from '../../../assets/2.png'
import Tre from '../../../assets/3.png'
import Fyra from '../../../assets/4.png'
import Fem from '../../../assets/5.png'
import { StatusBar } from 'expo-status-bar';

const StressScreen = () => {  
    
    const [selectedDate, setSelectedDate] = useState('');
    const [selected, setSelected] = useState("");
    const [isShowingImage, setShowingImage] = React.useState(false)
    
   
    const data = [
    {key:'1', value:'Meknik'},
    {key:'2', value:'Reglerteknik'},
    {key:'3', value:'Envariabelanalys'},
 ]
 
 
    return (

    <View style={styles.container}>

        <View style={styles.selectListContainer}>
            <SelectList
                dropdownTextStyles={styles.selectList}
                inputStyles={styles.selectList}
                boxStyles={styles.boxStyles}
                setSelected={(val) => setSelected(val)}
                data={data}
                save="value"
                search={false}
                placeholder='Choose course to track stresslevel'
            />
        </View>

           
        {
                isShowingImage ?
            (
                <View  style={styles.dateButton}> 
                    <DatePicker
                        onSelectedChange={date => setSelectedDate(date)}
                        current="2023-04-17"
                        selected="2023-04-17"
                         mode = 'calendar'
                        style={{ borderRadius: 5, height: 250, width: 250 , padding:10, margin: 50 }}  
                    /> 

                    <CustomButton 
                         text="Hide calendar"
                            onPress={() => setShowingImage(false)}
                    />
                </View>
       
            ) : (
                <View style={styles.dateButton}>
                    <CustomButton
                        text="Select date"
                        onPress={() => setShowingImage(true)}
                    />
                 </View>
             )
        }
      

            
         
        <TouchableOpacity activeOpacity={0.5}>
            <Image 
                source={Ett} 
                style={[styles.logo, {height: 200 * 0.3}, {marginBottom:10}]} 
                resizeMode="contain"
                
            />
            <Text style={styles.text}> Stressfree day </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.5}>
            <Image 
                source={Två} 
                style={[styles.logo, {height: 200 * 0.3},{marginBottom:10}]} 
                resizeMode="contain"
            />
            <Text style={styles.text}> Today was not so stressfull </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.5}>
            <Image 
                source={Tre} 
                style={[styles.logo, {height: 200 * 0.3},{marginBottom:10}]} 
                resizeMode="contain"
            />
            <Text style={styles.text}> I felt a bit stressed today</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.5}>
            <Image 
                source={Fyra} 
                style={[styles.logo, {height: 200 * 0.3},{marginBottom:10}]} 
                resizeMode="contain"
            />
            <Text style={styles.text}> Today was superstressful </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.5}>
            <Image 
                source={Fem} 
                style={[styles.logo, {height: 200 * 0.3}]} 
                resizeMode="contain"
            />
            <Text style={styles.text}> Stressfree day </Text>
        </TouchableOpacity>
 
        <CustomButton
            text="Submit"
        />
        
        <ButtonMenu/>

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

    
    })




export default StressScreen

