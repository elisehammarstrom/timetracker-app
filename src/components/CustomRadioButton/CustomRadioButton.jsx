import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';

const CustomRadioButton = ({question, firstOption, secondOption, thirdOption, fourthOption}) => {
  const [checked, setChecked] = React.useState('first');

  return (

    <View style={styles.container}>
      <Text style={styles.title}>{question}</Text>

      <View style={styles.options}>
        <Text style={styles.optionText}>{firstOption}</Text>

        <Text style={styles.optionText}>{secondOption}</Text>
        
        <Text style={styles.optionText}>{thirdOption}</Text>

        <Text style={styles.optionText}>{fourthOption}</Text>

      </View>

      <View style={styles.radioButtonContainer}>
        
        <RadioButton
          value="first"
          status={ checked === 'first' ? 'checked' : 'unchecked' }
          onPress={() => setChecked('first')}
        />
        <RadioButton
          value="second"
          status={ checked === 'second' ? 'checked' : 'unchecked' }
          onPress={() => setChecked('second')}
        />
        <RadioButton
          value="third"
          status={ checked === 'third' ? 'checked' : 'unchecked' }
          onPress={() => setChecked('third')}
        />
        <RadioButton
          value="fourth"
          status={ checked === 'fourth' ? 'checked' : 'unchecked' }
          onPress={() => setChecked('fourth')}
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
    fontSize: 15,
    fontWeight: 'bold',
    color: '#EFEFEF',
  },
})

export default CustomRadioButton;