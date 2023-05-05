import React from 'react';
import {SafeAreaView, StyleSheet, text} from 'react-native';
import Navigation from './src/navigation';

const App = () => {
  return (
    <SafeAreaView style={styles.root}>
      <Navigation/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#313131',
    fontFamily: 'Monte'
  },
});

export default App;

// import Auth from './components/auth';
// import Home from './components/home';
// import Detail from './components/detail';

// import { createAppContainer } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';

// const AppNavigator = createStackNavigator({
//   Auth: {screen: Auth},
//   Home: {screen: Home},
//   Detail: {screen: Detail}
// })

// const App = createAppContainer(AppNavigator);

// export default App;
