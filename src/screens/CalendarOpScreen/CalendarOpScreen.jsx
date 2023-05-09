import { StyleSheet, Text, View ,TouchableOpacity, Image} from 'react-native';
import React , {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import CloseIcon from '../../../assets/close.png'




const CalendarOpScreen = () => {

    const navigation = useNavigation();

    const courses = ["Mekanik", "Miljöteknik", "Envariabelanalys"];
    
    const onClosedPress = () => {
        navigation.navigate('Home', {options: courses})
      }

      var todaysDate = new Date().getDate();
      var monthNumber = new Date().getMonth() + 1;


      function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        return date.toLocaleString('en-US', { month: 'long' });
      }

      var showMonth = getMonthName(monthNumber)
 
  return (
    <View style={styles.container}> 
    <View style={styles.topContainer}>
         <TouchableOpacity activeOpacity={0.5} style={styles.close} onPress={onClosedPress} >
            <Image 
              source={CloseIcon} 
              style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
              resizeMode="contain"
            />
        </TouchableOpacity>


          <Text style = {styles.text}>{todaysDate} {showMonth}</Text>
          </View>


        </View>
    
  );
};

export default CalendarOpScreen;


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#313131',
        height: '100%',
        alignitems: 'center',
        justifyContent: 'space-between',
        
    },
      text: {
        color: 'white',
        fontSize: 30,
        flex: 5
      },
      topContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10
      },
      close: {
        flex: 3
      }
   
})