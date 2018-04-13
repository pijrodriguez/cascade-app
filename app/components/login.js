import React from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, Dimensions, Image } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Modal from "react-native-modal";
import { FormInput, Button, Input, Divider } from 'react-native-elements';
import { Font } from 'expo';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

export default class Login extends React.Component {
	
  constructor(props) {
  		super(props);
  		this.state = {
  			email: '',
			password: '',
			email_valid: true,
			email_modal: false,
			password_valid: true,
			password_modal: false,
			user_not_found: false,
			fontLoaded: false
  		}
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if ( re.test(email) == true ){
			console.log(re.test(email));
			this.setState({ email_modal: false });
			return re.test(email);
		} else {
			console.log(re.test(email));
			this.setState({ email_modal: true });
			return re.test(email);
		}
	}

	validatePassword(pass) {
		var regPass = regExPassword = /^[a-zA-Z0-9]{4,23}$/;

			if ( regPass.test(pass) == true ){
				console.log(regPass.test(pass));
				this.setState({ password_modal: false });
				return regPass.test(pass);
			} else {
				console.log(regPass.test(pass));
				this.setState({ password_modal: true });
				return regPass.test(pass);
			}
		}
  
  toggleEmailModal = () =>
  this.setState({ email_modal: !this.state.email_modal, email_valid: !this.state.email_valid });

  togglePasswordModal = () =>
  this.setState({ password_modal: !this.state.password_modal, password_valid: !this.state.password_valid });

  toggleUserModal = () =>
  this.setState({ user_not_found: !this.state.user_not_found });  
  
  async componentDidMount() {
		this._loadInitialState().done();
		
		//load the custom fonts using the Font package from expo
		await Font.loadAsync({
			'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
			'Montserrat-SemiBold': require('../../assets/fonts/Montserrat-SemiBold.ttf'),
			'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),
		});
		this.setState({fontLoaded:true})
  }
	
  _loadInitialState = async () => {
  		var value = await AsyncStorage.getItem('user');
  		if (value !== null) {
  			this.props.navigation.navigate('Home');
  		}
  }

  render() {
	  
	const {navigate} = this.props.navigation;
	const { email, password, email_valid, email_modal, user_not_found, password_modal, password_valid } = this.state;
	  
    return (
		!this.state.fontLoaded ? <Text>Loading....</Text> :
    	<KeyboardAvoidingView behavior='padding' style={styles.wrapper}>

			<Modal 
			isVisible={email_modal}
			onBackdropPress={() => this.setState({ email_modal: false })}>
			<View style={[styles.modalStyle, {height:SCREEN_HEIGHT/3, borderRadius:SCREEN_WIDTH/30}]}>
				<MaterialIcon
					name='error'
					color='rgba(171, 189, 219, 1)'
					size={100}
                />
				<Text style={{fontSize:SCREEN_WIDTH/25, marginVertical:10, fontFamily:'Montserrat-Bold'}}>Please enter a valid e-mail</Text>
				<Button
				title ='CLOSE'
				buttonStyle={styles.modalButton}
				textStyle={{fontWeight: 'bold'}}
				onPress={this.toggleEmailModal}
				/>
			</View>
			</Modal>

			<Modal 
			isVisible={password_modal}
			onBackdropPress={() => this.setState({ password_modal: false })}>
			<View style={[styles.modalStyle, {height:SCREEN_HEIGHT/3, borderRadius:SCREEN_WIDTH/30}]}>
				<MaterialIcon
					name='error'
					color='rgba(171, 189, 219, 1)'
					size={100}
                />
				<Text style={{fontSize:SCREEN_WIDTH/25, marginVertical:10, fontFamily:'Montserrat-Bold'}}>Please enter a valid password</Text>
				<Button
				title ='CLOSE'
				buttonStyle={styles.modalButton}
				textStyle={{fontWeight: 'bold'}}
				onPress={this.togglePasswordModal}
				/>
			</View>
			</Modal>

			<Modal 
			isVisible={user_not_found}
			onBackdropPress={() => this.setState({ user_not_found: false })}>
			<View style={[styles.modalStyle, {height:SCREEN_HEIGHT/3,borderRadius:SCREEN_WIDTH/30}]}>
				<Icon
					name='user-times'
					color='rgba(171, 189, 219, 1)'
					size={100}
				/>
				<Text style={{fontSize:SCREEN_WIDTH/25, marginVertical:10, fontFamily:'Montserrat-Bold'}}>Incorrect e-mail/password</Text>
				<Button
				title ='CLOSE'
				buttonStyle={styles.modalButton}
				textStyle={{fontWeight: 'bold'}}
				onPress={this.toggleUserModal}
				/>
			</View>
			</Modal>

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
				inputStyle={[styles.inputStyle,{fontFamily:'Montserrat-Regular'}]}
				placeholder='E-mail'
				onChangeText={ (email) => this.setState({email}) }
				keyboardType="email-address"
				returnKeyType="next"
				onSubmitEditing={() => {
                    this.setState({email_valid: this.validateEmail(email)});
                    this.passwordInput.focus();
                  }}
				underlineColorAndroid='transparent'
				placeholderTextColor="#7384B4"
				blurOnSubmit={false}
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
				inputStyle={[styles.inputStyle,{fontFamily:'Montserrat-Regular'}]}
				placeholder='Password'
				ref={ input => this.passwordInput = input}
				onChangeText={ (password) => this.setState({password}) }
				onSubmitEditing={() => {
                    this.setState({password_valid: this.validatePassword(password)})
                  }}
				returnKeyType="done"
				secureTextEntry={true}
				underlineColorAndroid='transparent'
				placeholderTextColor="#7384B4"
				/>
				</View>


				<Button
				title ='LOG IN'
				buttonStyle={styles.loginButton}
				textStyle={{fontFamily:'Montserrat-Bold'}}
				onPress={this.login}
				rounded={true}
				/>

			</View>

    	</KeyboardAvoidingView>
    );
  }
  
	login = () => {
		console.log('Logging in');
		if(this.validateEmail(this.state.email) == true && this.validatePassword(this.state.password) == true){
			fetch('http://cascade-app-server.herokuapp.com/users', {
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
					AsyncStorage.multiSet([
					['user', res.user], 
					['user_id', JSON.stringify(res.user_id)],
					['first_name', res.first_name],
					['last_name', res.last_name],
					['password', res.password],
					]);
					this.props.navigation.navigate('Home');
				}
	
				else {
					this.setState({ user_not_found: true })
				}
	
			}))
			.done();
		} else {
			this.setState({ email_modal: true })
		}
		
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
	modalStyle: {
		justifyContent:'center',
		alignItems: 'center',
		backgroundColor: 'white'
	},
	modalButton: {
		height: 40, 
		width: 200, 
		backgroundColor: '#00c6ff', 
		borderWidth: 2, 
		borderColor: 'white', 
		borderRadius: 30,
		marginVertical: 15
	}
})