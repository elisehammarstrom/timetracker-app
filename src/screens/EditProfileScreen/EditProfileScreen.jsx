import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions} from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';



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

  const navigation = useNavigation();

  const lang = ['English', 'Svenska']

  const [selectedLang,setSelectedLang] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState("");

  //make separate words bold
  const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

  return (
     <View style={styles.container}>
       <View style={styles.form}>

          <Text style={styles.label}><B>Change password:</B>
            <CustomInput 
              name="password"
              control={control}
              rules={{minLength: {value: 8, message: 'Password should be at least 8 characters long'}}}
              secureTextEntry
            /> 
          </Text>

          <Text style={styles.label}><B>Repeat password:</B>
            <CustomInput 
              name="passwordrepeat"
              control={control}
              rules={{validate: value => value === pwd || 'Password do not match'}}
              secureTextEntry
            /> 
          </Text>

          <Text style={styles.label}><B>Programme:</B> 
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
          </Text>
          <Text style={styles.label}><B>Language:</B> 
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
          </Text> 
  
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#313131',
  },
    form: {
      padding: 50,
    },
    label: {
      marginTop: 20,
      color: 'white',

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

});
export default EditProfileScreen