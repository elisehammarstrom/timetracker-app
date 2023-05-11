import { StyleSheet, Text, View ,TouchableOpacity, Image,TouchableHighlight, Button} from 'react-native';
import React , {useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import CloseIcon from '../../../assets/close.png'
import CalendarBlock from '../../components/CalendarBlock';
import DropDown from '../../components/DropDown';
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

 /*    const courses = ["Mekanik", "Miljöteknik", "Envariabelanalys"]; */
    
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
    <View style={styles.container}> 
    

      <View style={styles.topContainer}>
         <TouchableOpacity activeOpacity={0.5} style={styles.close} onPress={onClosedPress} >
            <Image 
              source={CloseIcon} 
              style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
              resizeMode="contain"
            />
        </TouchableOpacity>
        

        </View>
        <WeekCalendar date={date} onChange={(newDate) => setDate(newDate)} />
        <View> 
                
                {courses.map((option, i) => (
  
                  <TouchableOpacity key={option} onPress={() => {setShowingInfo(false); console.log({option}); showInfo({option})}} >
        
                    <CalendarBlock
                      color={colors[i]}
                      courseName={option}
                      studyTime={studyTime[i]}>

                        
                      </CalendarBlock>
                     {/*  <DropDown
                        value={selectedItem}
                        data={fruits}
                        courseName={option}
                        onSelect={onSelect}/> */}
                      
                  </TouchableOpacity>
                  ))}
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
        padding: 10

      },
      close: {
        flex: 3
      },
      box: {
        backgroundColor: 'pink'
      },
    
   
})