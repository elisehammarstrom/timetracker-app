// this is the page were you edit you profile
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import CloseIcon from '../../../assets/close.png';
import axios from 'axios';
import Text from '../../components/Text';
import Title from '../../components/Title';


const EditProfileScreen = ({ route }) => {
  const { token } = route.params;
  const { handleSubmit} = useForm();
  const [programmeInfo, setProgrammeInfo] = useState('');
  const [programmeNames, setProgrammeNames] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const navigation = useNavigation();
  const [yearGrades, setYearGrades] = useState('');
  const [selectedYearGrade, setSelectedYearGrade] = useState("");
  const [yearGradeInfo, setYearGradeInfo] = useState('');


  // Get the different programmes from the database
  axios({
    method: "get",
    url: "http://127.0.0.1:8000/api/programmes/",
    headers: {
      'Authorization': `token ` + token
    }
  })
    .then(function (response) {
      //handle success
      if (programmeNames.length < 1) {
        let fetchedProgrammeNames = [];
        //Push the info into an array to be able to use in the return 
        for (let i = 0; i < response.data.length; i++) {
          fetchedProgrammeNames.push(response.data[i].programmeName)
        }
        setProgrammeInfo(response.data)
        setProgrammeNames(fetchedProgrammeNames)
      }
    })
    .catch(function (response) {
      //handle error
      console.log(response);
    });

  // Get the different year grades from the database
  const getYearGrades = (selectedProgramme) => {
    const formData = new FormData();
    formData.append('programmeName', selectedProgramme);
    console.log('selectedProgramme:', selectedProgramme)

    axios({
      method: "post",
      url: "http://127.0.0.1:8000/api/yearGrade/get_yearGrades/",
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
      .then(function (response) {
        console.log('yearGrades:', response.data.yearGrades)
        //handle success

        setYearGradeInfo(response.data)
        setYearGrades(response.data.yearGrades)

      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  };


  // What happens when you press save
  const onSavePressed = data => {
    // Compare the selected programme to the info fetched from the database
    // If the same as one we send that ones id back to the database to save as new programme
    for (let i = 0; i < programmeInfo.length; i++) {
      if (selectedProgramme === programmeInfo[i].programmeName) {
        const formData = new FormData();
        formData.append('programmeID', programmeInfo[i].id);
        axios({
          method: "post",
          url: "http://127.0.0.1:8000/api/users/change_programme/",
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `token ` + token
          }
        })
          .then(function (response) {
            //handle success
            console.log(response.data);

          })
          .catch(function (response) {
            //handle error
            console.log(response);
          });
      }
    }
    const formData = new FormData();
    formData.append('yearGradeClass', selectedYearGrade);
    // If you change your year grade this is were it updates
    axios({
      method: "post",
      url: "http://127.0.0.1:8000/api/users/update_yearGrade/",
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `token ` + token
      }
    })
      .then(function (response) {
        //handle success
        console.log(response.data);
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });

    navigation.navigate('Profile', { token: token })

  };

  const onClosedPress = () => {
    navigation.navigate('Profile', { token: token })
  }


  //make separate words bold
  const B = (props) => <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>

  return (
    <View style={styles.container}>
      
      <View style={styles.closeContainer}>
      <Title style={styles.title}>Edit Profile</Title>
        <TouchableOpacity activeOpacity={0.5} onPress={onClosedPress} >
          <Image
            source={CloseIcon}
            style={[{ height: 100 * 0.3 }, { width: 100 * 0.3 }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.form}>


          <Text style={styles.selectLabel}><B>Programme:</B> </Text>
          <SelectList
            dropdownTextStyles={styles.selectList}
            inputStyles={styles.selectList}
            boxStyles={styles.boxStyles}
            setSelected={(val) => setSelectedProgramme(val)}
            data={programmeNames}
            save="value"
            search={false}
            placeholder='Choose programme'
            onSelect={() => getYearGrades(selectedProgramme)}
          />

          <Text style={styles.selectLabel}><B>Year Grade:</B> </Text>
          <SelectList
            dropdownTextStyles={styles.selectList}
            inputStyles={styles.selectList}
            boxStyles={styles.boxStyles}
            setSelected={(val) => setSelectedYearGrade(val)}
            data={yearGrades}
            save="value"
            search={true}
            placeholder='Choose Year Grade'
            dropdownStyles={styles.dropDown}

          />
          <View style={styles.button}>

            <CustomButton
              text="Save changes"
              onPress={handleSubmit(onSavePressed)}
            />
          </View>
        </View>
      </ScrollView>

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#313131',
    height: '100%'

  },
  form: {
    marginTop: '10%',
    paddingHorizontal: 50,
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    color: 'white',
  },
  selectLabel: {
    marginTop: 20,
    color: 'white',
    marginBottom: 10

  },
  topLabel: {
    color: 'white',
    fontSize: 20,
    marginBottom: '5%'
  },
  selectList: {
    fontWeight: 'bold',
    color: '#EFEFEF',
    fontFamily: 'Trebuchet MS'
  },
  boxStyles: {
    width: 0.75 * Dimensions.get('window').width,
  },
  closeContainer: {
    paddingRight: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    marginTop: '10%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EFEFEF',
    marginLeft: '30%',
    marginTop:'5%'

  }

});
export default EditProfileScreen