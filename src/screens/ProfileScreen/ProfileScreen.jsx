 import React, { useState } from 'react';
 import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, CheckBox} from 'react-native';
 import CustomButton from '../../components/CustomButton';
 import { useNavigation } from '@react-navigation/native';



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

       const navigation = useNavigation();

       const onEditPressed = () => {
         navigation.navigate('EditProfile', {
         });
       };

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

       <Text style={styles.label}><B>Username:</B> {profile.username}</Text>
         <Text style={styles.label}><B>Email:</B> {profile.email}</Text>
         <Text style={styles.label}><B>University:</B> {profile.university}</Text>
         <Text style={styles.label}><B>Notification:</B>
         <CheckBox
         value={isSelected}
         onValueChange={setSelection}
         style={styles.checkbox}
        color='gray'
      /> </Text> 

         <CustomButton
             text="Edit Profile"
             onPress={onEditPressed}
             type="HOMESCREEN"
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

         pictureContainer: {
          marginTop: 20,
          alignItems: 'center',
        },
        picture: {
           width: 150,
           height: 150,
           borderRadius: 75,
           border: 'solid',
           borderColor: 'white'
         },


         checkbox:{
             marginLeft:30,
             backgroundColor:'gray'
        },
       
      });
export default ProfileScreen