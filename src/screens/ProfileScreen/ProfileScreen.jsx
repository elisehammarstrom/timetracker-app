// On this screen you can see your own info and also navigate to where you can edit courses, programme adn year grade

import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import ArrowBack from '../../../assets/arrowBack.png';
import SettingIcon from '../../../assets/settings.png';
import axios from 'axios';
import SignOutIcon from '../../../assets/signout.png'
import Text from '../../components/Text';

const ProfileScreen = ({ route }) => {
  const { token } = route.params;
  const { courses } = route.params;
  const { courseIDs } = route.params;
  const navigation = useNavigation();
  const [profile, setProfile] = useState([]);

  // Fetching the userdata from the database
  axios({
    method: "get",
    url: "http://127.0.0.1:8000/api/users/get_user_data/",
    headers: {
      'Authorization': `token ` + token
    }
  })
    .then((res) => {
      //Setting the profileinfo, if-condtition to avoid inifinite loop
      if (`${profile}` != `${res.data.userObject}`) {
        setProfile(res.data.userObject)
      }

    })
    .catch((error) => {
      console.error(error)
    })
  // Navigate to edit screens
  const onEditPressed = () => {
    navigation.navigate('EditProfile', { token: token, courseIDs: courseIDs });
  };

  const onEditCoursePressed = () => {
    navigation.navigate('StartCourses', { token: token, originalCourseIDs: courseIDs });
  };
  //make separate words bold
  const B = (props) => <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>

  const onClosedPress = () => {
    navigation.navigate('Home', { token: token })
  }
  // This function logs ut the user
  const onSignOutPressed = () => {
    axios({
      method: "post",
      url: "http://127.0.0.1:8000/auth/logout/",
      headers: {
        'Authorization': `token ` + token
      }
    })
      .then(function (response) {
        //handle success
        navigation.navigate('SignIn')
      })
      .catch(function (response) {
        //handle error
       console.log(response);
      });

  }

  return (
    <View style={styles.topContainer}>
      <View style={styles.closeContainer}>

        <TouchableOpacity activeOpacity={0.5} onPress={onClosedPress} >
          <Image
            source={ArrowBack}
            style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOut} activeOpacity={0.5} onPress={onSignOutPressed} >
          <Image
            source={SignOutIcon}
            style={[{ height: 120 * 0.3 }, { width: 120 * 0.3 }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <Image
          source={SettingIcon}
          style={[{ height: 200 * 0.3 }, { width: Dimensions.get('window').width }]}
          resizeMode="contain"
        />
        <View style={styles.form}>

          <Text style={styles.label}><B>Email:</B> {profile.email}</Text>

          <Text style={styles.label}><B>University:</B> {profile.university}</Text>

          <Text style={styles.label}><B>Programme:</B> {profile.programmeName}</Text>

          <Text style={styles.label}><B>Year Grade:</B> {profile.yearGrade}</Text>


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
  checkbox: {
    marginLeft: 30,
    backgroundColor: 'gray'
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
    paddingHorizontal: 20

  },
  settingIcon: {
    color: 'white',
    fontSize: 60,
    paddingBottom: 10,
  },


});

export default ProfileScreen