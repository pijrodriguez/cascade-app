import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ScrollView } from 'react-native';
import { Header, Card, Divider, Avatar, Button} from 'react-native-elements';
import { Font } from 'expo';

export default class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			fontLoaded: false,
			firstName: '',
			lastName: '',
			tasksCount: 'no'
		}
	}

	//this function checks if there's a user logged in, if not it navigates back to the login page
	_loadInitialState = async () => {
		var user = await AsyncStorage.getItem('user');
		var firstName = await AsyncStorage.getItem('first_name');
		var lastName = await AsyncStorage.getItem('last_name');

		if (user !== null) {
			this.props.navigation.navigate('Home');
			this.setState({firstName:firstName, lastName:lastName});
		} else {
			this.props.navigation.navigate('Login');
		}
	}

	async componentDidMount() {
		//load the custom fonts using the Font package from expo
		await Font.loadAsync({
			'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
			'Montserrat-SemiBold': require('../../assets/fonts/Montserrat-SemiBold.ttf'),
			'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),			
		});
		this.setState({fontLoaded:true})
		this._loadInitialState().done();
		this.getTasksCount();
	}

	getTasksCount = async () => {
		//get user_id from AsyncStorage and use it to fetch this user's tasks
		var user_id = await AsyncStorage.getItem('user_id');
		
      fetch('https://cascade-app-server.herokuapp.com/count-tasks', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				user_id: user_id,
			}),
		})

		.then((response) => response.json())
		.then((res => {

			if (res.success == true) {
				console.log('COUNT');
				this.setState({tasksCount:Object.keys(res.tasks).length})
			}

			else {
				console.log('NO TASKS ASSIGNED');
			}

		}))
		.done();
	}

  render() {
    return (
			!this.state.fontLoaded ? <Text>Loading....</Text> : 
			<View style={styles.wrapper}>
				<Header
					leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.props.navigation.navigate('DrawerOpen')}}
					centerComponent={{ text: 'HOME', style: { color: '#fff', fontSize: 15, fontWeight: 'bold' } }}
					outerContainerStyles={{backgroundColor:'black'}}
				/>
				<ScrollView>
				<Card>
				<Text style={{fontSize:20, fontFamily:'Montserrat-Regular'}}>Welcome,</Text>
					<View style={{flexDirection:'row', marginVertical:10}}>
					<Avatar
						medium
						rounded
						source={{uri: "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png"}}
						activeOpacity={0.7}
					/>
					<Text style={{fontSize:35, fontFamily:'Montserrat-SemiBold', marginHorizontal:10}}>{this.state.firstName + ' ' + this.state.lastName}</Text>
					</View>
				</Card>

				<Card
				image={require('../../assets/images/getstarted.jpg')}>
					<Text style={{fontSize:20, fontFamily:'Montserrat-Regular', marginHorizontal:10}}>{'You currently have '+ this.state.tasksCount + ' pending tasks'}</Text>
					<Button
					title ='Get Started'
					buttonStyle={styles.getStarted}
					textStyle={{fontFamily:'Montserrat-Bold'}}
					onPress={() => this.props.navigation.navigate('Tasks')}
					/>
				</Card>		
				</ScrollView>
			</View>
    );
  }
}

const styles = StyleSheet.create({
	wrapper:{
		flex:1	
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#fff',
		paddingLeft: 20,
		paddingRight: 20,
	},
	text: {
		color: '#fff',
		marginBottom: 20
	},
	btn: {
		alignSelf: 'stretch',
		backgroundColor: '#F44336',
		padding: 20,
		alignItems: 'center'
	},
	getStarted:{
		height: 50,
		backgroundColor: '#00c6ff',
		marginVertical: 10
	},
})