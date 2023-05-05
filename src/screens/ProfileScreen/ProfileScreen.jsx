import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import CloseIcon from '../../../assets/close.png'
import SettingIcon from '../../../assets/settings.png'



 const ProfileScreen = () => {
    const navigation = useNavigation();

    const profile = {
        email: 'lovisanilsson58@gmail.com',
        picture: 'https://example.com/jane-doe-avatar.png',
        programme: 'STS',
        university: 'Uppsala university'
        // language: 'English'
      }
    const [fullName, setFullName] = useState(profile.fullName);
    const [email, setEmail] = useState(profile.email);
    const [programme, setProgramme] = useState(profile.programme);
    const [language, setLanguage] = useState(profile.language);
    const [picture, setpicture] = useState(profile.picture);
    const [isSelected, setSelection] = useState(false);
  
    const handleSubmit = () => {

    }

      
    const onEditPressed = () => {
      navigation.navigate('EditProfile', {
      });
    };

    const onEditCoursePressed = () => {
      navigation.navigate('StartCourses', {
    });  
    };
            //make separate words bold
    const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

    const onClosedPress = () => {
      navigation.navigate('Home')
    }

    return (
    <View style={styles.topContainer}>

  {/*    Close does not work on iOS right now */}
  
      <TouchableHighlight style={styles.closeContainer} onPress={onClosedPress} >
        <Image 
              source={CloseIcon} 
              style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
              resizeMode="contain"
          />
      </TouchableHighlight>

      <View style={styles.bottomContainer}>
        <Image 
            source={SettingIcon} 
            style={[ {height: 200 * 0.3}, {width: Dimensions.get('window').width}]} 
            resizeMode="contain"
        />
      <View style={styles.form}>

      <Text style={styles.label}><B>Email:</B> {profile.email}</Text>

      <Text style={styles.label}><B>University:</B> {profile.university}</Text>

      <Text style={styles.label}><B>Programme:</B> {profile.programme}</Text>

      {/* <Text style={styles.label}><B>Language</B> {profile.language}</Text> */}
      

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
          padding: 10,
        },
        settingIcon: {
          color: 'white',
          fontSize: 60,
          paddingBottom: 10,
        }
      });
export default ProfileScreen