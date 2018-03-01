import React, {Component} from 'react';
import Router from './routes';
import {AppRegistry} from 'react-native';
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

export default class CustomDrawer extends Component {
  render () {
    return (
      <Router/>
    );
  }
}

AppRegistry.registerComponent('CustomDrawer', () => CustomDrawer);

