import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, Dimensions, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { FormInput, Button, Input } from 'react-native-elements';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

export default class Login extends React.Component {
	
  constructor(props) {
  		super(props);
  		this.state = {
  			email: '',
  			password: '',
  		}
  }
	
  
  componentDidMount() {
  		this._loadInitialState().done();
  }
	
  _loadInitialState = async () => {
  		var value = await AsyncStorage.getItem('user');
  		if (value !== null) {
  			this.props.navigation.navigate('Home');
  		}
  }

  render() {
	  
	const {navigate} = this.props.navigation;
	  
    return (
    	<KeyboardAvoidingView behavior='padding' style={styles.wrapper}>

			<View style={styles.container}>

				<Image
				source={require('../../assets/images/Logo.png')}
				style={{width:300,
				height:300}}
				/>
				
				<View style={styles.inputContainer}>
				<SimpleIcon
					name='user'
					color='rgba(171, 189, 219, 1)'
					size={25}
					style={{marginLeft:15}}
                />

				<FormInput 
				inputStyle={styles.inputStyle}
				placeholder='E-mail'
				onChangeText={ (email) => this.setState({email}) }
				underlineColorAndroid='transparent'
				placeholderTextColor="#7384B4"
				icon={<SimpleIcon name='user' color="#7384B4" size={18} />}
				/>
				</View>

				<View style={styles.inputContainer}>

				<SimpleIcon
					name='lock'
					color='rgba(171, 189, 219, 1)'
					size={25}
					style={{marginLeft:15}}
                />
				<FormInput 
				inputStyle={styles.inputStyle}
				placeholder='Password'
				onChangeText={ (password) => this.setState({password}) }
				secureTextEntry={true}
				underlineColorAndroid='transparent'
				placeholderTextColor="#7384B4"
				/>
				</View>


				<Button
				title ='LOG IN'
				buttonStyle={styles.loginButton}
				textStyle={{fontWeight: 'bold'}}
				onPress={this.login}
				/>

			</View>

    	</KeyboardAvoidingView>
    );
  }
  
	login = () => {
		console.log('login');

		fetch('https://cascade-app-server.herokuapp.com/users', {
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
				AsyncStorage.multiSet([['user', res.user], ['user_id', JSON.stringify(res.user_id)]]);
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
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#191919',
		paddingLeft: 40,
		paddingRight: 40,
	},
	loginButton: {
		height: 50, 
		width: 250, 
		backgroundColor: '#00c6ff', 
		borderWidth: 2, 
		borderColor: 'white', 
		borderRadius: 30,
		marginVertical: 30
	},
	inputContainer: {
		height: 45,
		width: 350,
		marginVertical: 10,
		alignItems:'center',
		flexDirection:'row'
		
	},
	inputStyle: {
		flex:1,
		color: 'white',
		fontSize: 16,
		width:280
	},
})