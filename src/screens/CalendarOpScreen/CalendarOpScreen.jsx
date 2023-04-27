import { StyleSheet, Text, View , SafeAreaView, FlatList, TouchableHighlight, Image} from 'react-native';
import React , {useState} from 'react';
import WeekCalendar from '../../components/WeekCalendar';
import Line from '../../components/Line';
import LineV from '../../components/LineV';
import { useNavigation } from '@react-navigation/native';
import CloseIcon from '../../../assets/close.png'




const CalendarOpScreen = () => {
    const [date, setDate] = useState(new Date());

    const navigation = useNavigation();

    const courses = ["Mekanik", "Miljöteknik", "Envariabelanalys"];
    
    const onClosedPress = () => {
        navigation.navigate('Home', {options: courses})
      }
 
  return (
    <View style={styles.container}> 

         <TouchableHighlight style={styles.closeContainer} onPress={onClosedPress} >
            <Image 
              source={CloseIcon} 
              style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
              resizeMode="contain"
            />
        </TouchableHighlight>

    
      <View style={styles.week}> 
 
       <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />
        <LineV> </LineV>
      </View>

{/*       OBS!!!!! Flatlisten funkar inte med iOS */}

      <FlatList
        data={[
          {key: '07'},
          {key: '08'},
          {key: '09'},
          {key: '10'},
          {key: '11'},
          {key: '12'},
          {key: '13'},
          {key: '14'},
          {key: '15'},
          {key: '16'},
          {key: '17'},
          {key: '18'},
          {key: '19'},
          {key: '20'},
          {key: '21'},
          {key: '22'},
        ]}
        renderItem={({item}) =>  <View>  <Line ></Line> <Text style={styles.item}>{item.key}</Text> </View>}
      />
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
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color:'white',
      },
      week:{
        width:'95%',
        paddingLeft:40,
      },
      verticleLine: {
        height:'100%',
        width: 1.5,
        backgroundColor: '#909090',
      },
      close: {
        color: 'white',
        fontSize: 20,
        padding: 10,
        alignItems: 'flex-start'
      },
      closeContainer: {
        alignItems: 'flex-start',
        padding: 10,
      },
   
})