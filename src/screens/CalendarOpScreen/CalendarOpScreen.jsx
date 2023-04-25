import { StyleSheet, Text, View , SafeAreaView, FlatList} from 'react-native';
import React , {useState} from 'react';
import WeekCalendar from '../../components/WeekCalendar';
import Line from '../../components/Line';
import LineV from '../../components/LineV';





const CalendarOpScreen = () => {
    const [date, setDate] = useState(new Date());
    
   


    
    return (

<View style={styles.container}> 

<View style={styles.week}> 
<WeekCalendar  date={date} onChange={(newDate) => setDate(newDate)} />

</View>





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
        renderItem={({item}) =>  <View> <Line></Line> <Text style={styles.item}>{item.key}</Text> </View>}
        

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
   LineVe:{
    backgroundColor:'red'
   }

     
   
})