import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './SideMenu.style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, Icon, Image, ImageBackground, AsyncStorage} from 'react-native';


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
  			user: 'd',
  			
  		}
  }
  

 
  _loadInitialState = async () => {
	
  		var value = await AsyncStorage.getItem('user');
      if (value !== null){
        this.setState({user: value});
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

	_reloadState = async () => {
    var value = await AsyncStorage.getItem('user');
    if (value == null) {
      this.props.navigation.navigate('Login');
    } else {
      this.setState({status: "Error: Logout Failed"});
    }
  }

  render () {
    return (
      <View style={styles.container}>
		<View style={styles.topContainer}>
		<ImageBackground source={require('./user.png')} style={{width: 200, height: 150}}>  
		<Image source={require('./contact.png')}
       style={{width: 100, height: 100}} />
	   
	   <Text style={styles.navItemStyle}> Welcome {this.state.user} </Text>
	
	   
	   </ImageBackground>
        </View>
        <ScrollView>
          <View>
        
		
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Home')}>
              <Image source={require('./profile.png')}
       style={{width: 40, height: 40}} /> PROFILE
              </Text>
            </View>
          </View>
          <View>
            
            <View style={styles.navSectionStyle}>
              <Text style={styles.navItemStyle} onPress={this.navigateToScreen('Settings')}>
               <Image source={require('./cog.png')}
       style={{width: 40, height: 40}} /> SETTINGS
              </Text>
              <Text style={styles.navItemStyle} onPress={this.logout}>
                <Image source={require('./out.png')}
       style={{width: 40, height: 40}} /> LOG OUT
              </Text>
            </View>
          </View>
        </ScrollView>
     
      </View>
    );
  }

  logout = () => {
    AsyncStorage.removeItem('user');
    this._reloadState().done();
    }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;
