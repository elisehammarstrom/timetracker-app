import * as React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { RadioButton } from 'react-native-paper';
import axios from 'axios';

const CustomRadioButton = ({token, question, answerID, submit, firstOption, secondOption, thirdOption, fourthOption, fifthOption}) => {
  const [checked, setChecked] = React.useState(1);

  if (submit === true) {
    const formData = new FormData();
    formData.append('answerID', answerID)
    formData.append('answerNumber', checked)
    if (checked === 1) {
      formData.append('answerText', firstOption)
    }
    if (checked === 2) {
      formData.append('answerText', secondOption)
    }
    if (checked === 3) {
      formData.append('answerText', thirdOption)
    }
    if (checked === 4) {
      formData.append('answerText', fourthOption)
    }
    if (checked === 5) {
      formData.append('answerText', fifthOption)
    }
    axios({
      method: "post",
      url: " http://127.0.0.1:8000/api/evaluate/update_answer/",
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization':`token ` + token
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
  
  return (

    <View style={styles.container}>
      <Text style={styles.title}>{question}</Text>

      <View style={styles.options}>
        <Text style={styles.optionText}>{firstOption}</Text>

        <Text style={styles.optionText}>{secondOption}</Text>
        
        <Text style={styles.optionText}>{thirdOption}</Text>

        <Text style={styles.optionText}>{fourthOption}</Text>

        <Text style={styles.optionText}>{fifthOption}</Text>

      </View>

      <View style={styles.radioButtonContainer}>
        
        <RadioButton.Android
          value={1}
          status={ checked === 1 ? 'checked' : 'unchecked' }
          onPress={() => setChecked(1)}
        />
        <RadioButton.Android
          value={2}
          status={ checked === 2 ? 'checked' : 'unchecked' }
          onPress={() => setChecked(2)}
        />
        <RadioButton.Android
          value={3}
          status={ checked === 3 ? 'checked' : 'unchecked' }
          onPress={() => setChecked(3)}
        />
        <RadioButton.Android
          value={4}
          status={ checked === 4 ? 'checked' : 'unchecked' }
          onPress={() => setChecked(4)}
        />
        <RadioButton.Android
          value={5}
          status={ checked === 5 ? 'checked' : 'unchecked' }
          onPress={() => setChecked(5)}
        />

      </View>
    </View>
  );
};

const styles=StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    textAlign: 'center',
    overflowWrap: 'break-word',
    width: 0.9 * Dimensions.get('window').width,
   
  },
  radioButtonContainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EFEFEF',
    margin: 10,
  },
  options: {
    color: '#EFEFEF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  optionText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#EFEFEF',
  },
})

export default CustomRadioButton;