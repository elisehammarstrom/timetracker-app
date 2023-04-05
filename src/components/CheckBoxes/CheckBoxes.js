import React, {useState} from "react";
import { View, Text, StyleSheet, Pressable, CheckBox, SafeAreaView } from 'react-native';

const CheckBoxes= () => {
    const [isSelected, setSelection] = useState(false);

    return (
        <SafeAreaView>
          <CheckBox
            value={isSelected}
            onValueChange={setSelection}
            style={styles.checkbox}
            />
            {isSelected ? 'yes' : 'no'}
            
      </SafeAreaView>

    );
};

const styles =StyleSheet.create({
    text: {
        flex: 1,
        fontSize: 40
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 20,
      },
      checkbox: {
        alignSelf: 'center',
      },
      label: {
        margin: 8,
      },
   
})

export default CheckBoxes

