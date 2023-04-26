 import React, { useState } from 'react';
 import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, CheckBox} from 'react-native';
 import CustomButton from '../../components/CustomButton';
 import { useNavigation } from '@react-navigation/native';
 import {CloseOutlined} from '@ant-design/icons';
import { TouchableHighlight } from 'react-native-gesture-handler';
import {SettingOutlined} from '@ant-design/icons';



 const ProfileScreen = () => {
    const profile = {
        fullName: 'Lovisa Nilsson',
        email: 'lovisanilsson58@gmail.com',
        picture: 'https://example.com/jane-doe-avatar.png',
        programme: 'STS',
        language: 'English'
      }
      const [fullName, setFullName] = useState(profile.fullName);
      const [email, setEmail] = useState(profile.email);
      const [programme, setProgramme] = useState(profile.programme);
      const [language, setLanguage] = useState(profile.language);
      const [picture, setpicture] = useState(profile.picture);
      const [isSelected, setSelection] = useState(false);
    
      const handleSubmit = () => {

       }

       const navigation = useNavigation();
      const courses = ["Mekanik", "Reglerteknik", "Envariabelanalys"];


       const onEditPressed = () => {
         navigation.navigate('EditProfile', {
         });
       };

       // fungerar ej än, eftersom kurserna inte skickas med
   /*   const onClosePressed = () => {
        navigation.navigate('Home', {});
      };  */

       const onEditCoursePressed = () => {
        navigation.navigate('StartCourses', {
        });

        
      };
             //make separate words bold
      const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

      const onClosedPress = () => {
        navigation.navigate('Home', {options: courses})
      }

     return (
     <View style={styles.topContainer}>
      <View>
      <TouchableHighlight style={styles.closeContainer} onPress={onClosedPress} >
          <View>
            <CloseOutlined style={styles.close} />
          </View>
        </TouchableHighlight>

      </View>

       <View style={styles.bottomContainer}>
        <SettingOutlined style={styles.settingIcon}/>
       <View style={styles.form}>

       <Text style={styles.label}><B>Full name:</B> {profile.fullName}</Text>
         <Text style={styles.label}><B>Email:</B> {profile.email}</Text>
         <Text style={styles.label}><B>Programme:</B> {profile.programme}</Text>
         <Text style={styles.label}><B>Language</B> {profile.language}</Text>
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

          <CustomButton
             text="Edit Courses" 
             onPress={onEditCoursePressed}
             type="HOMESCREEN"
             />


      </View>
      </View>
    </View>
  );
};
    const styles = StyleSheet.create({
        bottomContainer: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#313131',

        },
        topContainer: {
            flex: 1,
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
        close: {
          color: 'white',
          fontSize: 20,
          padding: 10,

        },
        closeContainer: {
          alignItems: 'flex-start',
        },
        settingIcon: {
          color: 'white',
          fontSize: 60,
          paddingBottom: 10,
        }
       
      });
export default ProfileScreen