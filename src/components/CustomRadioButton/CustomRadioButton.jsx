import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';

const CustomRadioButton = ({question, firstOption, secondOption, thirdOption, fourthOption, fifthOption}) => {
  const [checked, setChecked] = React.useState(1);
  console.log(checked)
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
        
        <RadioButton
          value={1}
          status={ checked === 1 ? 'checked' : 'unchecked' }
          onPress={() => setChecked(1)}
        />
        <RadioButton
          value={2}
          status={ checked === 2 ? 'checked' : 'unchecked' }
          onPress={() => setChecked(2)}
        />
        <RadioButton
          value={3}
          status={ checked === 3 ? 'checked' : 'unchecked' }
          onPress={() => setChecked(3)}
        />
        <RadioButton
          value={4}
          status={ checked === 4 ? 'checked' : 'unchecked' }
          onPress={() => setChecked(4)}
        />
        <RadioButton
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