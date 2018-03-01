import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, ListView, ScrollView, list, Switch } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class Login extends React.Component {
	
  
  constructor(props) {
  		super(props);
  		this.state = {
  			username: '',
  			password: '',
			newpass: '',
			confirmpass: '',
			notifications: true,
			customtheme: 'false',
			show: true,
			value: this.props.value,
  		}
  }
	
	_reloadState = async () => {
			var value = await AsyncStorage.getItem('user');
			if (value == null) {
				this.props.navigation.navigate('Home');
			} else {
				this.setState({status: "Error: Logout Failed"});
			}
	}

  componentDidMount() {
  		this._loadInitialState().done();
  }
	

  _loadInitialState = async () => {
  		var value = await AsyncStorage.getItem('user');
  		if (value !== null) {
  			this.props.navigation.navigate('Profile');
  		}
  }
  
  static defaultProps = {
      
        value: 1
    }
  
  logout = () => {
	AsyncStorage.removeItem('user');
	this._reloadState().done();
  }
  
  mutual = () => {
	  if (this.state.newpass !== null) {
		  if (this.state.newpass == this.state.confirmpass) {
		
			  
		  this.changePassword();
		  
	  }
  }
  }
  
  chpassword = () => {
	AsyncStorage.removeItem('user');
	this._reloadState().done();
  }

  render() {
	  
	  const {navigate} = this.props.navigation;
	  
    return (
    	<KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
		<ScrollView contentContainerStyle={styles.contentContainer}>
 
		<View style={styles.container}>

			
					
					<TextInput 
				style={styles.textInput} 
				placeholder='Enter current password'
				onChangeText={ (password) => this.setState({password}) }
				underlineColorAndroid='transparent'
				/>

				<TextInput 
				style={styles.textInput} 
				placeholder='Enter new password'
				onChangeText={ (newpass) => this.setState({newpass}) }
				secureTextEntry={true}
				underlineColorAndroid='transparent'
				/>
					
				<TextInput 
				style={styles.textInput} 
				placeholder='Confirm new password'
				onChangeText={ (confirmpass) => this.setState({confirmpass}) }
				secureTextEntry={true}
				underlineColorAndroid='transparent'
				/>
				
			
				<TouchableOpacity
				style={styles.textInput}
				onPress={this.mutual}>
					<Text>SAVE</Text>
				</TouchableOpacity>
				
</View>
			
		 </ScrollView>
    	</KeyboardAvoidingView>
    );
  }

changePassword = () => {

		fetch('https://cascade-app-server.herokuapp.com/users', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password,
			}),
		})

		.then((response) => response.json())
		.then((res => {

			if (res.success == true) {
				AsyncStorage.setItem('user', res.user);
				this.props.navigation.navigate('Profile');
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
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		paddingLeft: 40,
		paddingRight: 40,
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
		backgroundColor: '#fff',
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

})