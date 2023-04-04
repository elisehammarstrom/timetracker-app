import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, Platform, TextInput, Button, FlatList, ImageBackground} from 'react-native';
// import { ImageBackground } from 'react-native-web';
// import { FlatList } from 'react-native-web';

export default function Home(props) {
  const [name, setName] = useState('IT queens')

  return (
    <SafeAreaView style={styles.home}>
        <Button
        title="go to Details"
        onPress={() => props.navigation.navigate("Detail")}
        />
        <FlatList 
            data={[
                {key: "Nina1"},
                {key: "Nina2"},
                {key: "Nina3"},
                {key: "Nina4"},
                {key: "Nina5"},
                {key: "Nina6"},
            ]}
            renderItem={ 
                ({item}) => <Text style={styles.text}>{item.key}</Text>
            }
        />
            <Text style={styles.text}>Hello World</Text>
            <Text>{props.msg}</Text>
            <Text style={styles.name}>{name}</Text>

            <TextInput
                style={{height: 40, backgroundColor: 'red'}}
                value={name}
                placeholder="type in your name"
                onChangeText={(text) => setName(text)}
            /> 
            <Button
                onPress={()=> alert(name + " clicked the button")} 
                title="click me"
            />

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    backgroundColor: Platform.OS == 'ios' ? '#fff' : '#00ff00',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  name: {
    color: '#00ff00',
    marginTop: 30,
    flex: 5
  },
  text: {
    flex: 1,
    fontSize: 40
  }
});
