import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, CheckBox, Span} from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';


const EditProfileScreen = () => {
  const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
  const {control, handleSubmit, formState: {errors}, watch} = useForm();


  //här ska sedan den nya infon skickas till databasen och ersätta det gamla i ProfileScreen
  const onSavePressed = data => {
    console.log(data)
    navigation.navigate('Profile')
};

const navigation = useNavigation();

    const profile = {
        username: 'Lovisa123',
        email: 'lovisanilsson58@gmail.com',
        picture: 'https://example.com/jane-doe-avatar.png',
        university: 'Uppsala'
      }
      const [username, setuserName] = useState(profile.username);
      const [email, setEmail] = useState(profile.email);
      const [university, setUniversity] = useState(profile.university);
      const [picture, setpicture] = useState(profile.picture);

      const [isSelected, setSelection] = useState(false);
    
      //make separate words bold
      const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

    return (
    <View style={styles.container}>
      <View style={styles.pictureContainer}>
        <Image
          style={styles.picture}
          source={{uri: 'https://www.bootdey.com/img/Content/avatar/avatar3.png'}}
        />
      </View>
      <View style={styles.form}>

      

        <Text style={styles.label}><B>Username:</B>
          <CustomInput 
              name="username"
              placeholder={profile.username}
              control={control}
              rules={{required: 'Username is required', minLength: {value: 3, message: 'Username should be at least 3 characters long'}}}
            /> 
        </Text>

        <Text style={styles.label}><B>Email:</B> 
        <CustomInput 
              name="email"
              placeholder={profile.email}
              control={control}
              rules={{ required: 'Email is required', pattern: {value: EMAIL_REGEX, message: 'Email is invalid'}}}
            /></Text>
        <Text style={styles.label}><B>University:</B> 
        <CustomInput 
              name="university"
              placeholder={profile.university}
              control={control}
              rules={{required: 'University is required',}}
            /></Text>

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
          width: '80%',
 
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
        }
       
      });

export default EditProfileScreen

