import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, ListView, ScrollView, list, Switch } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class Change extends React.Component {
	
	constructor(props) {
  		super(props);
  		this.state = {
  			old_password: '',
			password_valid: true,
			new_password: '',
			confirm_password: '',
			current_password: '',
			current_id: '',
		}
	}

	//On page start run this function
	componentDidMount() {
        this.getProfile();
    }

	//Use async to get the current account password and set it to a variable with a current state
    async getProfile() {
		var account_password = await AsyncStorage.getItem("password");
		var account_id = await AsyncStorage.getItem("user_id");
        this.setState({
			current_password: account_password,
			current_id: account_id
        });
    }

	//Function to check if the old password entered matches the current one
    old_passwords_match = () => {
	    if (this.state.old_password !== null) {
			if (this.state.old_password == this.state.current_password) {
				console.log("Entered password matches current password");
				//this.changePassword();
				return(this.state.password_valid)
			} else {
				console.log("Entered password does not match current password");
			}
		}
	}

	//Function to check if the new password entered matches the current new one
	new_passwords_match = () => {
	    if (this.state.confirm_password !== null) {
			if (this.state.new_password == this.state.confirm_password) {
				console.log("Entered password matches new password");
				//this.changePassword();
				return(this.state.password_valid)
			} else {
				console.log("Entered password does not match new password");
			}
		}
	}

	//Function to change the password in async by calling the server and changing it in the db first
	changePassword = () => {
		if (this.old_passwords_match() == true) {
			if (this.new_passwords_match() == true) {
			
				fetch('https://cascade-app-server.herokuapp.com/password', {
				//fetch('http://a8b21e86.ngrok.io/password', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						password: this.state.new_password,
						user_id: this.state.current_id
					}),
				})

				.then((response) => response.json())
				.then((res => {

					if (res.success == true) {
						console.log('Password changed.');
						AsyncStorage.setItem('password', res.password);
						this.props.navigation.navigate('Home');
					}

				}))
				.done();
			} else {
				console.log("Entered password does not match new password");
			}
		} else {
			console.log("Entered password does not match current password");
		} 
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
				onChangeText={(old_password)=>this.setState({old_password})}
				ref={ input => this.old_passwordInput = input}
				onSubmitEditing={() => {
                    this.setState({old_password_valid: this.old_passwords_match()});
                    this.old_passwordInput.focus();
                  }}
				underlineColorAndroid='transparent'
				/>

				<TextInput 
				style={styles.textInput} 
				placeholder='Enter new password'
				onChangeText={ (new_password) => this.setState({new_password}) }
				underlineColorAndroid='transparent'
				/>
					
				<TextInput 
				style={styles.textInput} 
				placeholder='Confirm new password'
				onChangeText={ (confirm_password) => this.setState({confirm_password}) }
				ref={ input => this.confirm_passwordInput = input}
				onSubmitEditing={() => {
                    this.setState({password_valid: this.new_passwords_match()});
                    this.confirm_passwordInput.focus();
                  }}
				underlineColorAndroid='transparent'
				/>
				
				<TouchableOpacity
				style={styles.textInput}
				onPress={this.changePassword}>
				<Text>SAVE</Text>
				</TouchableOpacity>
					
			</View>
				
			</ScrollView>
			</KeyboardAvoidingView>
		);
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