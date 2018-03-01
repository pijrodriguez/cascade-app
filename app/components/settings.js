import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, TouchableHighlight, Alert, AsyncStorage, ListView, ScrollView, list, Switch } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Notification from 'react-native-in-app-notification';


export default class Login extends React.Component {
	
  
  constructor(props) {
  		super(props);
  		this.state = {
  			username: '',
  			password: '',
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
				
				console.log(this.state.username);
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
  
  chpassword = () => {
	AsyncStorage.removeItem('user');
	this._reloadState().done();
  }

  render() {
	  
	  const {navigate} = this.props.navigation;
	  
    return (
    	<KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
		
		<ScrollView contentContainerStyle={styles.contentContainer}>
		
		<Notification ref={(ref) => { this.notification = ref; }} />
 		
		<View style={styles.container}>
				
				<Text style={styles.textInput}>Notifications {this.state.notifications}</Text>
				<Text style={styles.textInput}>Custom theme {this.state.customtheme}</Text>
			
				<TouchableOpacity
				style={styles.textInput}
				onPress={this.logout}>
					<Text>Log out</Text>
				</TouchableOpacity>
		
				<TouchableOpacity
				style={styles.textInput}
				onPress={() => this.props.navigation.navigate('Page4')}>
					<Text>Change password</Text>
				</TouchableOpacity>
			
				<View style={styles.textInput}>
		<Text>Push Notifications</Text>
		<Switch
				value={this.state.show}
				onValueChange={(value) => {this.setState({
					show: value
				});
				console.log(this.state.username);
this.notification && this.notification.show({
            title: 'Notifications',
            message: 'change'})}
}
				activeText={'On'}
				inActiveText={'Off'}
            	/>
		</View>
				
				<TouchableOpacity
				style={styles.textInput}
				onPress={() => 
			this.props.navigation.navigate('Home')}>
					<Text>Save changes</Text>
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
