import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styles from './SideMenu.style';
import {NavigationActions} from 'react-navigation';
import {ScrollView, Text, View, Icon, Image, ImageBackground, AsyncStorage, TouchableHighlight, TouchableOpacity, Dimensions} from 'react-native';
import { Avatar, Divider, Button } from 'react-native-elements';
import { Font } from 'expo';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

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

  state = {
    visibleModal: null,
  };
	
	_renderButton = (text, onPress) => (
    <Button
    title ={text}
    buttonStyle={styles.modalButton}
    textStyle={{fontFamily:'Montserrat-SemiBold'}}
    onPress={onPress}
    />
  );

  _renderModalContent = (text) => (
    <View style={styles.modalContent}>
      <Text style={{fontFamily:'Montserrat-SemiBold', marginVertical: 10, fontSize:SCREEN_WIDTH/25}}>{text}</Text>
      <View style={{flexDirection:'row'}}>
	  {this._renderButton('Yes', () => {this.logout()})}
      {this._renderButton('No', () => this.setState({ visibleModal: null }))}
      </View>
    </View>
  );
  
  async componentDidMount() {
		//load the custom fonts using the Font package from expo
		await Font.loadAsync({
			'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
			'Montserrat-SemiBold': require('../../assets/fonts/Montserrat-SemiBold.ttf'),
      'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),			
    });
    this.setState({fontLoaded:true});
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
      !this.state.fontLoaded ? <Text>Loading....</Text> :
    <View style={styles.container}>
		<View style={styles.topContainer}>
    <Image
				source={require('../../assets/images/sidemenu.png')}
				style={{width: 120, height: 50}}
				/>
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
              style={{marginTop:10}}/>
              <Text style={[styles.navItemStyle,{fontFamily:'Montserrat-Regular', fontSize:18}]} onPress={this.navigateToScreen('Home')}>
              HOME
              </Text>
            </View>

            <View style={styles.optionContainer} onPress={this.navigateToScreen('Tasks')}>
            <FontAwesome					
              name='tasks'
              color='#00c6ff'
              size={40}
              style={{marginTop:10}}/>
              <Text style={[styles.navItemStyle,{fontFamily:'Montserrat-Regular', fontSize:18}]} onPress={this.navigateToScreen('Tasks')}>
              GOALS
              </Text>
            </View>

            <View style={styles.optionContainer} onPress={this.navigateToScreen('Settings')}>
            <MaterialIcons					
              name='settings'
              color='#00c6ff'
              size={40}
              style={{marginTop:10}}/>
            <Text style={[styles.navItemStyle,{fontFamily:'Montserrat-Regular', fontSize:18}]} onPress={this.navigateToScreen('Settings')}>
               SETTINGS
            </Text>
            </View>
			
			

            <View style={styles.optionContainer} onPress={this.navigateToScreen('Settings')}>
            <MaterialIcons					
              name='exit-to-app'
              color='#00c6ff'
              size={40}
              style={{marginTop:10}}/>
            <Text style={[styles.navItemStyle,{fontFamily:'Montserrat-Regular', fontSize:18}]} onPress={this.popalert}>
            LOG OUT
            </Text>
            </View>

            </View>
			
			  <Modal
          isVisible={this.state.visibleModal === 2}
          animationIn={'slideInLeft'}
          animationOut={'slideOutRight'}
        >
          {this._renderModalContent('Are you sure you want to log out?')}
        </Modal>
          </View>
        </ScrollView>
     
      </View>
    );
  }

  logout = () => {
    AsyncStorage.multiRemove(['user','user_id','first_name','last_name', 'password']);
    this.setState({user:'Name'})
	this.setState({ visibleModal: null })
    this._reloadState().done();
    }
  
  popalert = () => {
    this.setState({ visibleModal: 2 })
    }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;
