import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './SideMenu.style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, Icon, Image, ImageBackground, AsyncStorage, TouchableHighlight} from 'react-native';
import { Avatar, Divider } from 'react-native-elements';
import { Font } from 'expo';
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
        fontLoaded: false,
  		}
  }
  
  async componentDidMount() {
		//load the custom fonts using the Font package from expo
		await Font.loadAsync({
			'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
			'Montserrat-SemiBold': require('../../assets/fonts/Montserrat-SemiBold.ttf'),
			'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),			
    });
    var first_name = await AsyncStorage.getItem('first_name');
    var last_name = await AsyncStorage.getItem('last_name');
    this.setState({fontLoaded:true, user:first_name + ' ' +last_name});
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
      !this.state.fontLoaded ? <Text>Loading....</Text> :
    <View style={styles.container}>
		<View style={styles.topContainer}>
    <Avatar
      medium
      rounded
      source={{uri: "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"}}
      onPress={this.change}
      containerStyle={{marginLeft: 10}}
    />
	   <Text style={[styles.navItemStyle,{fontFamily:'Montserrat-SemiBold', fontSize: 20}]}> {this.state.user} </Text>
     <Divider style={{ backgroundColor: 'white', marginBottom:10, width: 150 }}/>
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
              <Text style={[styles.navItemStyle,{fontFamily:'Montserrat-SemiBold'}]} onPress={this.navigateToScreen('Home')}>
              HOME
              </Text>
            </View>

            <View style={styles.optionContainer} onPress={this.navigateToScreen('Tasks')}>
            <FontAwesome					
              name='tasks'
              color='#00c6ff'
              size={40}
              style={{}}/>
              <Text style={[styles.navItemStyle,{fontFamily:'Montserrat-SemiBold'}]} onPress={this.navigateToScreen('Tasks')}>
              TASKS
              </Text>
            </View>

            <View style={styles.optionContainer} onPress={this.navigateToScreen('Settings')}>
            <MaterialIcons					
              name='settings'
              color='#00c6ff'
              size={40}
              style={{}}/>
            <Text style={[styles.navItemStyle,{fontFamily:'Montserrat-SemiBold'}]} onPress={this.navigateToScreen('Settings')}>
               SETTINGS
            </Text>
            </View>

            <View style={styles.optionContainer} onPress={this.navigateToScreen('Settings')}>
            <MaterialIcons					
              name='exit-to-app'
              color='#00c6ff'
              size={40}
              style={{}}/>
            <Text style={[styles.navItemStyle,{fontFamily:'Montserrat-SemiBold'}]} onPress={this.logout}>
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
    AsyncStorage.multiRemove(['user','user_id','first_name','last_name']);
    this.setState({user:'Name'})
    this._reloadState().done();
    }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;
