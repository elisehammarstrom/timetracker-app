import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';

const CustomRadioButton = ({question, firstOption, secondOption, thirdOption, fourthOption}) => {
  const [checked, setChecked] = React.useState('first');

  return (

    <View>
      {question}
      <View style={styles.container}>
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
  container:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
})

export default CustomRadioButton;