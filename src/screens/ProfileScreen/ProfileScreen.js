import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, CheckBox} from 'react-native';
import CustomButton from '../../components/CustomButton';


const ProfileScreen = () => {

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
    
      const handleSubmit = () => {
    
      }

    return (
    <View style={styles.container}>
      <View style={styles.pictureContainer}>
        <Image
          style={styles.picture}
          source={{uri: 'https://www.bootdey.com/img/Content/avatar/avatar3.png'}}
        />
      </View>
      <View style={styles.form}>

        <Text style={styles.label}> Username: {profile.username} </Text>
      
        <Text style={styles.label}> Email: {profile.email}</Text>
       
        <Text style={styles.label}> University: {profile.university} </Text>


        <Text style={styles.label}> Notification: <CheckBox
          value={isSelected}
          onValueChange={setSelection}
          style={styles.checkbox}
          color='gray'
        /> </Text>  
      
        <CustomButton
            text="Edit Profile"
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
        },
       
        pictureContainer: {
          marginTop: 20,
          alignItems: 'center',
        },
        picture: {
          width: 150,
          height: 150,
          borderRadius: 75,
        },
        checkbox:{
            marginLeft:30,
            backgroundColor:'gray'
        }
       
      });

export default ProfileScreen

