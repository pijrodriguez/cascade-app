import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './SideMenu.style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, Icon, Image, ImageBackground, AsyncStorage, TouchableHighlight} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class SideMenu extends Component {
  navigateToScreen = (route) => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
  }
  
  constructor(props) {
  		super(props);
  		this.state = {
        user: 'Name',	
        contact: './contact.png',
        test3: '',
  		}
  }

	_reloadState = async () => {
    var value = await AsyncStorage.getItem('user');
    if (value == null) {
      this.props.navigation.navigate('Login');
    } else {
      this.setState({status: "Error: Logout Failed"});
    }
  }

  change = async () => {
	  var value = await AsyncStorage.getItem('profile');
	  console.log(value);
	  if (value == null){
		  this.props.navigation.navigate('Picture');
	  }
	  else {
      this.setState({contact: value});
      console.log(this.state.contact);
      this.props.navigation.navigate('Picture');
	  };
	}
	
	update = () => {
	
	console.log('test3       ' + this.state.contact);
  AsyncStorage.removeItem('profile');
	this.props.navigation.navigate('Picture');
  }



  render () {
    return (
    <View style={styles.container}>
		<View style={styles.topContainer}>
		<ImageBackground source={require('./user.png')} style={{width: 200, height: 150}}>  
		<TouchableHighlight onPress={this.change}>
		<Image source={{uri: this.state.contact}}
       style={{width: 100, height: 100}} />
	  </TouchableHighlight>
	   
	   <Text style={styles.navItemStyle}> Welcome {this.state.user} </Text>
	
	   
	   </ImageBackground>
        </View>
        <ScrollView>
          <View>
            <View style={styles.navSectionStyle}>
            <View style={styles.optionContainer} onPress={this.navigateToScreen('Home')}>
              <Entypo					
              name='home'
              color='#00c6ff'
              size={40}
              style={{}}/>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Home')}>
              HOME
              </Text>
            </View>

            <View style={styles.optionContainer} onPress={this.navigateToScreen('Tasks')}>
            <FontAwesome					
              name='list-ol'
              color='#00c6ff'
              size={40}
              style={{}}/>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Tasks')}>
              TASKS
              </Text>
            </View>

            <View style={styles.optionContainer} onPress={this.navigateToScreen('Settings')}>
            <MaterialIcons					
              name='settings'
              color='#00c6ff'
              size={40}
              style={{}}/>
            <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Settings')}>
               SETTINGS
            </Text>
            </View>

            <View style={styles.optionContainer} onPress={this.navigateToScreen('Settings')}>
            <Entypo					
              name='log-out'
              color='#00c6ff'
              size={40}
              style={{}}/>
            <Text style={styles.navItemStyle} onPress={this.logout}>
            LOG OUT
            </Text>
            </View>

            </View>
          </View>
        </ScrollView>
     
      </View>
    );
  }

  logout = () => {
    AsyncStorage.multiRemove(['user','user_id']);
    this._reloadState().done();
    }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;
