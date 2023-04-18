
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import {Text, View,Dimensions,StyleSheet} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import DatePicker from 'react-native-modern-datepicker';
import ButtonMenu from '../../components/ButtonMenu';

const UntrackedScreen = () => {

    const [selectedDate, setSelectedDate] = useState('');
    const [selected, setSelected] = React.useState("");
    const [isShowingImage, setShowingImage] = React.useState(false)
    const [time, setTime] = useState('');
  
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


{
        isShowingImage ?
        (
            <View  style={styles.dateButton}> 
             <DatePicker
              options={{
                backgroundColor: '#090C08',
                textHeaderColor: '#FFA25B',
                textDefaultColor: '#F6E7C1',
                selectedTextColor: '#fff',
                mainColor: '#F4722B',
                textSecondaryColor: '#D6C7A1',
                borderColor: 'rgba(122, 146, 165, 0.1)',
              }}
      onSelectedChange={date => setSelectedDate(date)}
      current="2023-04-17"
      selected="2023-04-17"
      minuteInterval={15}
      style={{ borderRadius: 2, height: 250, width: 250 }}
      onTimeChange={selectedTime => setTime(selectedTime)}
      
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
         )}

             <ButtonMenu/>
            
        

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


})




export default UntrackedScreen