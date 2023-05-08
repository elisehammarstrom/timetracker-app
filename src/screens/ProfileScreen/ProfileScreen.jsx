import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import CloseIcon from '../../../assets/close.png';
import SettingIcon from '../../../assets/settings.png';
import axios from 'axios';
import SignOutIcon from '../../../assets/signout.png'


const ProfileScreen = ({route}) => {
  const {token} = route.params;
  const {courses} = route.params;
  const navigation = useNavigation();
  // const profile = [];
  const [profile, setProfile] = useState([]);

  axios({
    method: "get",
    url: "http://127.0.0.1:8000/api/users/get_user_data/",
    headers: {
      'Authorization': `token ` + token
    }
  })
  .then((res) => {

    if (`${profile}` != `${res.data.userObject}`) {
      setProfile(res.data.userObject)
    }

  })
  .catch((error) => {
    console.error(error)
  })
  
  const handleSubmit = () => {

  }
    
  const onEditPressed = () => {
    navigation.navigate('EditProfile', {token: token});
  };

  const onEditCoursePressed = () => {
    navigation.navigate('StartCourses', {token: token, originalCourses: courses});  
  };
          //make separate words bold
  const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

  const onClosedPress = () => {
    navigation.navigate('Home', {token: token})
  }

  const onSignOutPressed = () => {
    navigation.navigate('SignIn')
  }

    return (
    <View style={styles.topContainer}>
      <View style={styles.closeContainer}>
  
      <TouchableHighlight onPress={onClosedPress} >
        <Image 
              source={CloseIcon} 
              style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
              resizeMode="contain"
          />
      </TouchableHighlight>

      <TouchableHighlight  onPress={onSignOutPressed} >
        <Image 
              source={SignOutIcon} 
              style={[ {height: 100 * 0.3},{width: 100*0.3}]} 
              resizeMode="contain"
          />
      </TouchableHighlight>
      </View>

      <View style={styles.bottomContainer}>
        <Image 
            source={SettingIcon} 
            style={[ {height: 200 * 0.3}, {width: Dimensions.get('window').width}]} 
            resizeMode="contain"
        />
      <View style={styles.form}>

      <Text style={styles.label}><B>Email:</B> {profile.email}</Text>

      <Text style={styles.label}><B>University:</B> {profile.university}</Text>

      <Text style={styles.label}><B>Programme:</B> {profile.programmeName}</Text>

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
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
      },
      settingIcon: {
        color: 'white',
        fontSize: 60,
        paddingBottom: 10,
      }
      });
export default ProfileScreen