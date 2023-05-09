import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableHighlight, Image} from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import CloseIcon from '../../../assets/close.png';



const EditProfileScreen = ({route}) => {
  const {token} = route.params;
  const {control, handleSubmit, formState: {errors}, watch} = useForm();
  const pwd = watch('password');


  const programmes = [
    {key:'1', value:'STS'},
    {key:'2', value:'Industriell ekonomi'}
  ]


   //här ska sedan den nya infon skickas till databasen och ersätta det gamla i ProfileScreen
  const onSavePressed = data => {
    navigation.navigate('Profile', {token: token})
    const info = {
      password: data.password,
      pID: selectedProgramme,
      lang: selectedLang,
    } 
    console.log(info)
  };

  const onClosedPress = () => {
    navigation.navigate('Profile', {token: token})
  }

  const navigation = useNavigation();

  const lang = ['English', 'Svenska']

  const [selectedLang,setSelectedLang] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState("");

  //make separate words bold
  const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

  return (
     <View style={styles.container}>

        <View style={styles.closeContainer}>
            <TouchableHighlight onPress={onClosedPress} >
              <Image 
                source={CloseIcon} 
                style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
                resizeMode="contain"
              />
          </TouchableHighlight>
        </View>

       <View style={styles.form}>
       

      
       <Text style={styles.topLabel}><B>Change password</B></Text>

       
       <Text style={styles.label}><B>Old password:</B></Text>
          <CustomInput 
              name="oldpassword"
              control={control}
              rules={{minLength: {value: 8, message: 'Password should be at least 8 characters long'}}}
              secureTextEntry
              placeholder='Old Password'
              minLength='30'
            /> 

          <Text style={styles.label}><B>New password:</B></Text>
          <CustomInput 
              name="password"
              control={control}
              rules={{minLength: {value: 8, message: 'Password should be at least 8 characters long'}}}
              secureTextEntry
              placeholder='New Password'
            /> 
          <Text style={styles.label}><B>Repeat new password:</B></Text>
          <CustomInput 
              name="passwordrepeat"
              control={control}
              rules={{validate: value => value === pwd || 'Password do not match'}}
              secureTextEntry
              placeholder='New password'
            /> 

          <Text style={styles.selectLabel}><B>Programme:</B> </Text>
            <SelectList
              dropdownTextStyles={styles.selectList}
              inputStyles={styles.selectList}
              boxStyles={styles.boxStyles}
              setSelected={(val) => setSelectedProgramme(val)}
              data={programmes}
              save="value"
              search={false}
              placeholder='Choose programme'
            />
          
          <Text style={styles.selectLabel}><B>Language:</B></Text>  
            <SelectList
              dropdownTextStyles={styles.selectList}
              inputStyles={styles.selectList}
              boxStyles={styles.boxStyles}
              setSelected={(val) => setSelectedLang(val)}
              data={lang}
              save="value"
              search={false}
              placeholder='Choose language'
            />
       
    
  
          <CustomButton 
            text="Save changes" 
            onPress={handleSubmit(onSavePressed)}
          />
       </View>

     </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: '#313131',

  },
    form: {
      paddingHorizontal: 50,
      justifyContent: 'flex-start',
      width: '100%',
      paddingBottom: 30,
    },
    label: {
      marginTop: 20,
      color: 'white',

    },
    selectLabel: {
      marginTop: 20,
      color: 'white',
      marginBottom: 10

    },
    topLabel: {
      color: 'white',
      fontSize: 20
    },
    info: {
      marginTop: 20,
      color: 'white',
      fontWeight: 'light'

    },

    pictureContainer: {
      marginTop: 20,
      alignItems: 'center',
      backgroundColor: '#313131',
    },
    picture: {
      width: 150,
      height: 150,
      borderRadius: 75,
      border: 'solid',
      borderColor: 'white',
      opacity: '50%',

    },
    checkbox:{
        marginLeft:30,
      backgroundColor:'gray'
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
      width: 0.75 * Dimensions.get('window').width,
  },
  closeContainer: {
  
    paddingRight: 20,
    alignItems: 'flex-end',
  },

});
export default EditProfileScreen