import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, TouchableHighlight, Alert, AsyncStorage, ListView, ScrollView, list, Dimensions} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Header, ListItem, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Notification from 'react-native-in-app-notification';
import { Font } from 'expo';
import Modal from 'react-native-modal';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

export default class Settings extends React.Component {

  constructor(props) {
  		super(props);
  		this.state = {
  			email: '',
  			password: '',
			notifications: true,
			customtheme: 'false',
			show: true,
			fontLoaded: false,
			value: this.props.value,
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
				this.props.navigation.navigate('Home');
				
				console.log(this.state.email);
			} else {
				this.setState({status: "Error: Logout Failed"});
			}
	}
  
  static defaultProps = {   
        value: 1
    }
  
  logout = () => {
    AsyncStorage.multiRemove(['user','user_id','first_name','last_name', 'password']);
	this._reloadState().done();
  }
  
  popalert = () => {
    this.setState({ visibleModal: 2 })
    }

  render() {
	  
	  const {navigate} = this.props.navigation;
	  const options = [
		{
			name: 'Change Password',
			icon: 'key'
		}, 
		{
			name: 'Log out',
			icon: 'exit-to-app'
		}
	];
    return (
    	<KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
		
		<Header
			leftComponent={{ icon: 'menu', color: '#fff', size: SCREEN_WIDTH/14, type:'entypo', onPress: () => this.props.navigation.navigate('DrawerOpen')}}
			centerComponent={{ text: 'SETTINGS', style: { color: '#fff', fontSize: SCREEN_WIDTH/20, fontFamily:'Montserrat-Bold' } }}
			outerContainerStyles={{backgroundColor:'black'}}
      	/>

		<ScrollView contentContainerStyle={styles.container}>
 		
		<View style={styles.container}>
				
			<ListItem
				title={<Text style={{fontFamily:'Montserrat-Regular', fontSize:SCREEN_WIDTH/25}}>Change Password</Text>}
				leftIcon={{name:'key', type:'entypo'}}
				onPress={() => this.props.navigation.navigate('Change')}
			/>

			<ListItem
				title={<Text style={{fontFamily:'Montserrat-Regular', fontSize:SCREEN_WIDTH/25}}>Log out</Text>}
				leftIcon={{name:'exit-to-app', type:'material-community-icons'}}
				onPress={this.popalert}
			/>
			
			
			
			<Modal
          isVisible={this.state.visibleModal === 2}
          animationIn={'slideInLeft'}
          animationOut={'slideOutRight'}
        >
          {this._renderModalContent('Are you sure you want to log out?')}
			</Modal>

		</View>
			
		 </ScrollView>
			<Notification ref={(ref) => { this.notification = ref; }} />
    	</KeyboardAvoidingView>
    );
  }

changePassword = () => {

		fetch('http://267941cd.ngrok.io/users', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password,
			}),
		})

		.then((response) => response.json())
		.then((res => {

			if (res.success == true) {
				AsyncStorage.setItem('user', res.user);
				this.props.navigation.navigate('Home');
			}

			else {
				alert(res.message);
			}

		}))
		.done();
	}
  
}

const styles = StyleSheet.create({
	wrapper: {
		flex:1,
	},
	container: {
		backgroundColor: 'white'
	},
	header: {
		fontSize: 24,
		marginBottom: 60,
		color: '#fff',
		fontWeight: 'bold'
	},
	textInput: {
		alignSelf: 'stretch',
		padding: 20,
		marginBottom: 5,
		backgroundColor: '#7AC6F6',
		flexDirection: 'row',
		
	},
	btn: {
		alignSelf: 'stretch',
		backgroundColor: '#01c853',
		padding: 20,
		alignItems: 'center'
	},
	titleText: {
		fontSize: 20,
		fontWeight: 'bold',
		alignSelf: 'stretch',
		padding: 16,
		marginBottom: 20,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
	},
	modalButton: {
		height: 40, 
		width: 100, 
		backgroundColor: '#00c6ff', 
		borderWidth: 2, 
		borderColor: 'white', 
		marginVertical: 5
	}

})