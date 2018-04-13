import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ScrollView, Dimensions, Image } from 'react-native';
import { Header, Card, Divider, Avatar, Button} from 'react-native-elements';
import { Font } from 'expo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

export default class Profile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			fontLoaded: false,
			firstName: '',
			lastName: '',
			email: '',
			tasksCount: 'no',
			missed: 'no',
			finished: 'no',
			missedMessage: '',
			finishedMessage: ''
		}
	}

	//this function checks if there's a user logged in, if not it navigates back to the login page
	_loadInitialState = async () => {
		var user = await AsyncStorage.getItem('user');
		var firstName = await AsyncStorage.getItem('first_name');
		var lastName = await AsyncStorage.getItem('last_name');
		var email = await AsyncStorage.getItem('user');

		if (user !== null) {
			this.props.navigation.navigate('Home');
			this.setState({firstName:firstName, lastName:lastName,email: email});
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
		
      fetch('http://cascade-app-server.herokuapp.com/tasks', {
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
				var missedGoals = [];
				var finishedGoals = [];
				var activeGoals = [];
				//iterate through the tasks and separate the missed goals with the finished goals
				res.tasks.forEach(element => {
					if(element.missed == false){
						if(element.finished_date != null){
							finishedGoals.push(element);
						} else{ 
							activeGoals.push(element);
						}
					} else if (element.missed == true) {
						missedGoals.push(element);
					}
				});
				

				this.setState({
					tasksCount:Object.keys(activeGoals).length, 
					missed:Object.keys(missedGoals).length, 
					finished:Object.keys(finishedGoals).length
				})
			}

			else {
				console.log('NO TASKS ASSIGNED');
			}

		}))
		.then((() => {
			if(this.state.missed != 'no'){
				this.setState({missedMessage:'\nTime to work harder!'})
			}

			if(this.state.finished != 'no'){
				this.setState({finishedMessage:'\nKeep up the good \nwork!'})
			}
		}))
		.done();
	}

  render() {
    return (
			!this.state.fontLoaded ? <Text>Loading....</Text> : 
			<View style={styles.wrapper}>
				<Header
					leftComponent={{ icon: 'menu', color: '#fff', size: SCREEN_WIDTH/14, type:'entypo', onPress: () => this.props.navigation.navigate('DrawerOpen')}}
					centerComponent={{ text: 'HOME', style: { color: '#fff', fontSize: SCREEN_WIDTH/20, fontFamily:'Montserrat-Bold' } }}
					outerContainerStyles={{backgroundColor:'black'}}
				/>
				<ScrollView>
				<Card>
				<View style={{flexDirection:'row'}}>
				<FontAwesome
					name='user'
					color='black'
					size={SCREEN_WIDTH/7}
					style={{marginHorizontal:10}}
				/>
				<View>
				<Text style={{fontSize:SCREEN_WIDTH/15, fontFamily:'Montserrat-SemiBold', marginHorizontal:10}}>{this.state.firstName + ' ' + this.state.lastName}</Text>
				<Text style={{fontSize:SCREEN_WIDTH/25, fontFamily:'Montserrat-Regular',marginHorizontal:10}}>{this.state.email}</Text>
				</View>
				</View>
				</Card>

				<Card
				image={require('../../assets/images/getstarted.jpg')}
				featuredTitle={'You currently have '+ this.state.tasksCount + ' pending tasks'}
				featuredTitleStyle={{fontSize:20, fontFamily:'Montserrat-Regular', color:'#fff'}}
				>
					<Button
					title ='Get Started'
					buttonStyle={styles.getStarted}
					textStyle={{fontFamily:'Montserrat-Bold'}}
					onPress={() => this.props.navigation.navigate('Tasks')}
					/>
				</Card>	
				<ScrollView
					horizontal
				>

				<Card
				containerStyle = {{width:SCREEN_WIDTH - 30}}
				>

				<View style={{flexDirection: 'row'}}>
				<FontAwesome
					name='check-square-o'
					color='#00E676'
					size={100}
                />
				<Text style= {{fontFamily:'Montserrat-Regular', fontSize:SCREEN_WIDTH/20, marginHorizontal:20}}>
					{'You have ' + this.state.finished+'\ngoals finished.'+ this.state.finishedMessage}
				</Text>
				</View>

				</Card>

				<Card
				containerStyle = {{width:SCREEN_WIDTH - 30}}
				>

				<View style={{flexDirection: 'row'}}>
				<MaterialIcons
					name='error'
					color='#EF5350'
					size={100}
                />
				<Text style= {{fontFamily:'Montserrat-Regular', fontSize:SCREEN_WIDTH/20, marginHorizontal:20}}>
					{'You have ' + this.state.missed+'\ngoals missed.' + this.state.missedMessage}
				</Text>
				</View>

				</Card>
				
				</ScrollView>
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
