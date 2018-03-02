import React, {Component} from 'react';
import Router from './routes';
import {AppRegistry} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Login from './app/components/login';
import Home from './app/components/home';


const Application = StackNavigator({
    Login: { screen: Login },
    Home: { screen: Home }
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

