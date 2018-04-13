import React from 'react';
import { StyleSheet, Dimensions, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, ListView, ScrollView, list, Switch } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Font } from 'expo';
import {FormLabel, FormInput, Header, Divider, Button} from 'react-native-elements';
import Modal from 'react-native-modal';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

export default class Change extends React.Component {
	
	constructor(props) {
  		super(props);
  		this.state = {
				old_password: '',
				old_password_valid: false,
				password_valid: false,
				new_password: '',
				confirm_password: '',
				current_password: '',
				current_id: '',
				confirmpass_modal: false,
				old_password_modal:false,
				success_modal: false,
				fontLoaded: false
		}
	}
	
	state = {
    visibleModal: null,
  };


	async componentDidMount() {

		//load the custom fonts using the Font package from expo
		await Font.loadAsync({
			'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
			'Montserrat-SemiBold': require('../../assets/fonts/Montserrat-SemiBold.ttf'),
			'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),			
		});
		this.setState({fontLoaded:true})
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
				return true
			} else {
				this.setState({old_password_modal: true})
			}
		}
	}

	//Function to check if the new password entered matches the current new one
	new_passwords_match = () => {
	    if (this.state.confirm_password !== null) {
				if (this.state.new_password == this.state.confirm_password) {
					console.log("Entered password matches new password");
					//this.changePassword();
					return true
				} else {
					this.setState({confirmpass_modal:true})
				}
		}
	}

	//Function to change the password in async by calling the server and changing it in the db first
	changePassword = () => {
		if (this.old_passwords_match() == true) {
			if (this.new_passwords_match() == true) {
			
				fetch('http://267941cd.ngrok.io/password', {
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
						this.setState({ success_modal: true })
						console.log('Password changed.');
						AsyncStorage.setItem('password', this.state.new_password);
					}

				}))
				.done();
			} else {
				console.log("Entered password does not match new password");
				this.setState({confirmpass_modal:true});
			}
		} else {
			console.log("Entered password does not match current password");
			this.setState({old_password_modal:true});
		} 
	}

	 
  toggleConfirmpassModal = () =>
  this.setState({ confirmpass_modal: !this.state.confirmpass_modal});

  toggleOldPassModal = () =>
  this.setState({ old_password_modal: !this.state.old_password_modal});

	toggleSuccessModal = () =>
	this.setState({ success_modal: !this.state.success_modal});
	
	render() {

		const {navigate} = this.props.navigation;
	  
		return (
			!this.state.fontLoaded ? <Text>Loading....</Text> :
			<KeyboardAvoidingView behavior='padding' style={styles.wrapper}>

				<Header
					leftComponent={{ icon: 'menu', color: '#fff', size: SCREEN_WIDTH/14, type:'entypo', onPress: () => this.props.navigation.navigate('DrawerOpen')}}
					centerComponent={{ text: 'SETTINGS', style: { color: '#fff',fontSize: SCREEN_WIDTH/20, fontFamily:'Montserrat-Bold' } }}
					outerContainerStyles={{backgroundColor:'black'}}
				/>
			<View style={styles.container}>

				<Modal 
				isVisible={this.state.old_password_modal}
				onBackdropPress={() => this.setState({ old_password_modal: false })}>
				<View style={[styles.modalStyle, {height:SCREEN_HEIGHT/3, borderRadius:SCREEN_WIDTH/30}]}>
					<MaterialIcon
						name='error'
						color='rgba(171, 189, 219, 1)'
						size={100}
									/>
					<Text style={{fontSize:SCREEN_WIDTH/25, marginVertical:10, fontFamily:'Montserrat-Bold'}}>{'This does not match your \ncurrent password'}</Text>
					<Button
					title ='CLOSE'
					buttonStyle={styles.modalButton}
					textStyle={{fontWeight: 'bold'}}
					onPress={this.toggleOldPassModal}
					/>
				</View>
				</Modal>

				
				<Modal 
				isVisible={this.state.confirmpass_modal}
				onBackdropPress={() => this.setState({ confirmpass_modal: false })}>
				<View style={[styles.modalStyle, {height:SCREEN_HEIGHT/3, borderRadius:SCREEN_WIDTH/30}]}>
					<MaterialIcon
						name='error'
						color='rgba(171, 189, 219, 1)'
						size={100}
									/>
					<Text style={{fontSize:SCREEN_WIDTH/25, marginVertical:10, fontFamily:'Montserrat-Bold'}}>{'Entered passwords \ndoes not match'}</Text>
					<Button
					title ='CLOSE'
					buttonStyle={styles.modalButton}
					textStyle={{fontWeight: 'bold'}}
					onPress={this.toggleConfirmpassModal}
					/>
				</View>
				</Modal>
			
        
        <Modal
          isVisible={this.state.success_modal}
          animationIn={'zoomInDown'}
          animationOut={'zoomOutUp'}
          animationInTiming={1000}
          animationOutTiming={1000}
          backdropTransitionInTiming={1000}
          backdropTransitionOutTiming={1000}
        >
				<View style={[styles.modalStyle, {height:SCREEN_HEIGHT/3, borderRadius:SCREEN_WIDTH/30}]}>

					<Entypo
						name='check'
						color='rgba(171, 189, 219, 1)'
						size={100}
					/>
					<Text style={{fontSize:SCREEN_WIDTH/25, marginVertical:10, fontFamily:'Montserrat-Bold'}}>{'Password Changed.'}</Text>
					<Button
					title ='CLOSE'
					buttonStyle={styles.modalButton}
					textStyle={{fontWeight: 'bold'}}
					onPress={() => {this.toggleSuccessModal; this.props.navigation.navigate('Home');}}
					/>
					</View>
        </Modal>

				<View style={styles.inputContainers}>
					<FormLabel style={{fontFamily:'Montserrat-Regular'}}>Current Password</FormLabel>
					<FormInput
					inputStyle={[styles.inputStyle,{fontFamily:'Montserrat-Regular'}]}
					placeholder='Enter current password'
					returnKeyType="next"
					onChangeText={(old_password)=>this.setState({old_password})}
					ref={ input => this.old_passwordInput = input}
					onSubmitEditing={() => {
						this.setState({old_password_valid: this.old_passwords_match()});
						this.new_passwordInput.focus();
					}}
					underlineColorAndroid='transparent'
					placeholderTextColor="#5388C8"
					blurOnSubmit={false}
					secureTextEntry={true}
					/>
				</View>
				
				<View style={styles.inputContainers}>
					<FormLabel style={{fontFamily:'Montserrat-Regular'}}>New Password</FormLabel>
					<FormInput 
					inputStyle={[styles.inputStyle,{fontFamily:'Montserrat-Regular'}]}
					placeholder='Enter new password'
					returnKeyType="next"
					onChangeText={ (new_password) => this.setState({new_password}) }
					ref={ input => this.new_passwordInput = input}
					onSubmitEditing={() => {
						this.confirm_passwordInput.focus();
					}}
					underlineColorAndroid='transparent'
					placeholderTextColor="#5388C8"
					blurOnSubmit={false}
					secureTextEntry={true}
					/>
				</View>
				
				<View style={styles.inputContainers}>
					<FormLabel style={{fontFamily:'Montserrat-Regular'}}>Confirm Password</FormLabel>
					<FormInput 
					inputStyle={[styles.inputStyle,{fontFamily:'Montserrat-Regular'}]}
					label='Confirm password'
					placeholder='Confirm new password'
					returnKeyType="done"
					onChangeText={ (confirm_password) => this.setState({confirm_password}) }
					ref={ input => this.confirm_passwordInput = input}
					onSubmitEditing={() => {
						this.setState({password_valid: this.new_passwords_match()});
						this.confirm_passwordInput.focus()
					}}
					underlineColorAndroid='transparent'
					placeholderTextColor="#5388C8"
					blurOnSubmit={false}
					secureTextEntry={true}
					/>
				</View>
				
				<Button
				title ='SAVE'
				buttonStyle={styles.saveButton}
				textStyle={{fontWeight: 'bold',fontFamily:'Montserrat-Regular'}}
				onPress={this.changePassword}
				rounded={true}
				/>
						
			</View>
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
	inputStyle: {
		
	},
	inputContainers: {
		padding: 10,
		width:350
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
	saveButton: {
		height: 50, 
		width: 150, 
		backgroundColor: '#00c6ff', 
		borderWidth: 2, 
		borderColor: 'white',
		marginVertical: 30
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