import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, Platform} from 'react-native';

export default function App() {
  return (
    <SafeAreaView>
      <Text>Hello World</Text>
      <Text>Nina was here</Text>
      <Text>Lovisa was here</Text>
      <Text>Platform: {Platform.OS === 'ios' ? 'ios' : 'android'}</Text>
      <StatusBar style='dark'/>
    </SafeAreaView>

  );
}

