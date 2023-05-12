import { StyleSheet, Text, View ,TouchableOpacity, Image, ScrollView} from 'react-native';
import React , {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import ArrowBack from '../../../assets/arrowBack.png'
import CalendarBlock from '../../components/CalendarBlock';
import WeekCalendar from '../../components/WeekCalendar';





const CalendarOpScreen = ({route}) => {

    const {token} = route.params;
    const {courses} = route.params;
    const [isShowingInfo, setShowingInfo] = React.useState(true)
    const [name, setname] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [date, setDate] = useState(new Date());


    const navigation = useNavigation();

    let fruits = [
      {id: 1, name: 'mango'},
      {id: 2, name: 'banana'},
      {id: 3, name: 'cherry'}
  ]

  const onSelect = (item) => {
    setSelectedItem(item)
}
    
    const onClosedPress = () => {
        navigation.navigate('Home', {options: courses})
      }

      const colors = ['ONE','TWO','THREE','FOUR','FIVE','SIX']

      //get total study time per course from database
      const studyTime =[4, 5, 2]

      const showInfo = (option) => {
        let name = option
        console.log(name) 
      }
 
  return (
    <View style={styles.container} > 
    

      <View style={styles.topContainer}>
        
         <TouchableOpacity activeOpacity={0.5} style={styles.close} onPress={onClosedPress} >
            <Image 
              source={ArrowBack} 
              style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
              resizeMode="contain"
            />
        </TouchableOpacity>
        <Text style={styles.title}>Recommended study hours</Text>
        

        </View>
        <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />
        <View style={{height: '100%'}}> 
          <ScrollView >
                
                {courses.map((option, i) => (
  
                  <TouchableOpacity key={option} onPress={() => {setShowingInfo(false); console.log({option}); showInfo({option})}} >
        
                    <CalendarBlock
                      color={colors[i]}
                      courseName={option}
                      studyTime={studyTime[i]}/>  
                  </TouchableOpacity>
                  ))}
                  </ScrollView>
                  
                </View> 
                

</View>
    
  );
};

export default CalendarOpScreen;


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#313131',
        height: '2000%',
        alignitems: 'center',
        justifyContent: 'flex-start',
        
    },
      text: {
        color: 'white',
        fontSize: 30,
        flex: 5
      },
      topContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
        

      },
      close: {
        flex: 3
      },
      box: {
        backgroundColor: 'pink'
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#EFEFEF',
        margin: 10,
        justifyContent: 'flex-start'
    },
    
   
})