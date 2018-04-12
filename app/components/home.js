import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { Header, Card, Divider, Avatar, Button, Rating} from 'react-native-elements';
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
			tasksCount: 'no',
			missed: 'no',
			finished: 'no',
			rating: 0
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
		//get user rating and set it as state
		var userRating = parseInt(await AsyncStorage.getItem('user_rating'));
		//load the custom fonts using the Font package from expo
		await Font.loadAsync({
			'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
			'Montserrat-SemiBold': require('../../assets/fonts/Montserrat-SemiBold.ttf'),
			'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),			
		});

		this.setState({fontLoaded:true,rating: userRating})
		this._loadInitialState().done();
		this.getTasksCount();
	}

	getTasksCount = async () => {
		//get user_id from AsyncStorage and use it to fetch this user's tasks
		var user_id = await AsyncStorage.getItem('user_id');
		
      fetch('http://cascade-app-server.herokuapp.com/count-tasks', {
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
				//iterate through the tasks and separate the missed goals with the finished goals
				res.tasks.forEach(element => {
					if(element.missed == false){
						if(element.finished_date != null){
							finishedGoals.push(element);
						}
					} else {
						missedGoals.push(element);
					}
				});
				this.setState({tasksCount:Object.keys(res.tasks).length, missed:Object.keys(missedGoals).length, finished:Object.keys(finishedGoals).length})
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
					leftComponent={{ icon: 'menu', color: '#fff', size: SCREEN_WIDTH/14, type:'entypo', onPress: () => this.props.navigation.navigate('DrawerOpen')}}
					centerComponent={{ text: 'HOME', style: { color: '#fff', fontSize: SCREEN_WIDTH/20, fontFamily:'Montserrat-Bold' } }}
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
				<ScrollView
					horizontal
				>
				<Card
					containerStyle = {{width:SCREEN_WIDTH - 30}}
				>

				<View style={{alignItems:'center'}}>
				<Rating
					imageSize={40}
					readonly
					startingValue={this.state.rating}
					type='star'
					style={{marginTop:10}}
					/>
				
				<Text style= {{fontFamily:'Montserrat-Regular', fontSize:SCREEN_WIDTH/25, marginHorizontal:10, marginVertical:10}}>
					{'Your client have given you this rating'}
				</Text>
				</View>
				</Card>
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
					{'You have ' + this.state.finished+'\ngoals finished. \nKeep up the good \nwork!'}
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
					{'You have ' + this.state.finished+'\ngoals missed. \nTime to work \nharder!'}
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
