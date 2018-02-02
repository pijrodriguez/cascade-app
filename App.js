import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Login from './app/components/login';
import Profile from './app/components/profile';

const Application = StackNavigator({
    Home: { screen: Login },
    Profile: { screen: Profile }
    }, {
      navigationOptions: {
        header: false,
      }

});

export default class App extends React.Component {
  render() {
    return (
        <Application/>
    );
  }
}

