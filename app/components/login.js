import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, KeyboardAvoidingView, TouchableOpacity, AsyncStorage } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class Login extends React.Component {
	

  
  constructor(props) {
  		super(props);
  		this.state = {
  			username: '',
  			password: '',
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

  render() {
	  
	  const {navigate} = this.props.navigation;
	  
    return (
    	<KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
			
		
					
		
			<View style={styles.container}>
		
		
	
			  
		
		<TouchableOpacity style={styles.header2} onPress={() => this.props.navigation.navigate('Page3')}>
					<Icon name="info" size={20} color="#3271E5" />
		</TouchableOpacity>

				<Text style={styles.textInput}> Cascade Psych Services </Text>
				<TextInput 
				style={styles.textInput} 
				placeholder='Username'
				onChangeText={ (username) => this.setState({username}) }
				underlineColorAndroid='transparent'
				/>

				<TextInput 
				style={styles.textInput} 
				placeholder='Password'
				onChangeText={ (password) => this.setState({password}) }
				secureTextEntry={true}
				underlineColorAndroid='transparent'
				/>

				<TouchableOpacity
				style={styles.btn}
				onPress={this.login}>
					<Text>Log in</Text>
				</TouchableOpacity>
				
				
		


			</View>

    	</KeyboardAvoidingView>
    );
  }
  
	
	login = () => {

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
				this.props.navigation.navigate('Page1');
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
		backgroundColor: '#191919',
		paddingLeft: 40,
		paddingRight: 40,
	},
	header2: {
		flex: 0.2,
		alignItems: 'center',
		justifyContent: 'flex-end',
		backgroundColor: '#191919',
		paddingLeft: 5,
		flexDirection: 'row',
		
	},
	header: {
		fontSize: 24,
		marginBottom: 60,
		color: '#fff',
		fontWeight: 'bold'
	},
	textInput: {
		alignSelf: 'stretch',
		padding: 16,
		marginBottom: 20,
		backgroundColor: '#fff'
	},
	btn: {
		alignSelf: 'stretch',
		backgroundColor: '#01c853',
		padding: 20,
		alignItems: 'center'
	}

})
